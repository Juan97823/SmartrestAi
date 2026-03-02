'use server';
/**
 * @fileOverview This file defines a Genkit flow for proactively alerting kitchen managers
 * about ingredients at risk of running out based on predicted demand.
 *
 * - predictiveInventoryAlerts - A function that triggers the inventory risk assessment.
 * - PredictiveInventoryAlertsInput - The input type for the predictiveInventoryAlerts function.
 * - PredictiveInventoryAlertsOutput - The return type for the predictiveInventoryAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveInventoryAlertsInputSchema = z.object({
  inventoryItems: z
    .array(
      z.object({
        name: z.string().describe('The name of the inventory item (ingredient).'),
        currentStock: z.number().positive().describe('The current quantity of the item in stock.'),
        unit: z.string().describe('The unit of measurement for the item (e.g., "kg", "units", "liters").'),
        averageDailyConsumption: z.number().min(0).describe('The estimated average daily consumption of this item.'),
      })
    )
    .min(1)
    .describe('A list of current inventory items with their stock and average daily consumption.'),
});
export type PredictiveInventoryAlertsInput = z.infer<typeof PredictiveInventoryAlertsInputSchema>;

const PredictiveInventoryAlertsOutputSchema = z.object({
  atRiskIngredients: z
    .array(
      z.object({
        name: z.string().describe('The name of the ingredient at risk.'),
        currentStock: z.number().describe('The current quantity of the ingredient in stock.'),
        unit: z.string().describe('The unit of measurement.'),
        estimatedDaysRemaining: z.number().min(0).describe('Estimated number of days until the ingredient runs out.'),
        reorderRecommendation: z.number().positive().describe('A suggested quantity to reorder for this ingredient.'),
        reason: z.string().describe('A brief explanation of why this ingredient is considered at risk.'),
      })
    )
    .describe('A list of ingredients that are at risk of running out.'),
});
export type PredictiveInventoryAlertsOutput = z.infer<typeof PredictiveInventoryAlertsOutputSchema>;

export async function predictiveInventoryAlerts(
  input: PredictiveInventoryAlertsInput
): Promise<PredictiveInventoryAlertsOutput> {
  return predictiveInventoryAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveInventoryAlertsPrompt',
  input: {schema: PredictiveInventoryAlertsInputSchema},
  output: {schema: PredictiveInventoryAlertsOutputSchema},
  prompt: `You are an AI assistant for a restaurant kitchen manager.
Your task is to review the current inventory and identify any ingredients that are at risk of running out soon, based on their current stock and average daily consumption. Assume a reorder lead time of 2 days for all items when making recommendations.

For each item, calculate the estimated days remaining before it runs out. If an item has less than 3 days of stock remaining, consider it 'at risk'. For 'at risk' items, provide a reorder recommendation that covers at least 7 days of average consumption, plus the 2-day lead time.

Here is the current inventory data:

{{#each inventoryItems}}
- Name: {{{name}}}, Current Stock: {{{currentStock}}} {{{unit}}}, Average Daily Consumption: {{{averageDailyConsumption}}} {{{unit}}}
{{/each}}

Identify all ingredients at risk and provide reorder recommendations.`,
});

const predictiveInventoryAlertsFlow = ai.defineFlow(
  {
    name: 'predictiveInventoryAlertsFlow',
    inputSchema: PredictiveInventoryAlertsInputSchema,
    outputSchema: PredictiveInventoryAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
