'use server';
/**
 * @fileOverview This file implements a Genkit flow for predicting daily restaurant demand.
 *
 * - predictDailyDemand - A function that handles the daily demand prediction process.
 * - PredictDailyDemandInput - The input type for the predictDailyDemand function.
 * - PredictDailyDemandOutput - The return type for the predictDailyDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDailyDemandInputSchema = z.object({
  date: z
    .string()
    .describe("The specific date for which to predict demand (e.g., '2024-07-20')."),
  dayOfWeek: z
    .string()
    .describe("The day of the week for the prediction (e.g., 'Monday', 'Saturday')."),
  specialEvents: z
    .string()
    .optional()
    .describe('Any known special events or holidays on this date (e.g., "local festival", "public holiday").'),
});
export type PredictDailyDemandInput = z.infer<typeof PredictDailyDemandInputSchema>;

const PredictDailyDemandOutputSchema = z.object({
  predictedDemandLevel: z
    .enum(['Low', 'Medium', 'High', 'Very High'])
    .describe('A categorical prediction of the expected demand level.'),
  predictedCovers: z
    .number()
    .int()
    .describe('An estimated number of customers or covers for the day.'),
  staffingRecommendation: z
    .string()
    .describe('Recommendations for appropriate staffing levels based on predicted demand.'),
  inventoryNotes: z
    .string()
    .describe('Important notes or considerations for inventory management based on the prediction.'),
  reasoning: z.string().describe('The reasoning and factors behind the demand prediction.'),
});
export type PredictDailyDemandOutput = z.infer<typeof PredictDailyDemandOutputSchema>;

export async function predictDailyDemand(
  input: PredictDailyDemandInput
): Promise<PredictDailyDemandOutput> {
  return aiDemandPredictionFlow(input);
}

const predictDailyDemandPrompt = ai.definePrompt({
  name: 'predictDailyDemandPrompt',
  input: {schema: PredictDailyDemandInputSchema},
  output: {schema: PredictDailyDemandOutputSchema},
  prompt: `You are an AI-powered demand prediction model for a restaurant, trained on simulated historical sales data and general restaurant industry patterns.
Your task is to predict the daily demand for the restaurant based on the provided date, day of the week, and any special events.

Simulate the output of a simplified machine learning model.

Input Details:
Date: {{{date}}}
Day of Week: {{{dayOfWeek}}}
{{#if specialEvents}}Special Events: {{{specialEvents}}}{{/if}}

Consider typical restaurant demand patterns:
- Weekends and holidays generally have higher demand.
- Weekdays (Monday-Wednesday) often have lower demand, with Thursday and Friday seeing an increase.
- Special events significantly impact demand.

Provide the following output:
- A 'predictedDemandLevel' (Low, Medium, High, Very High).
- An estimated 'predictedCovers' (number of customers).
- 'staffingRecommendation' appropriate for the predicted demand.
- 'inventoryNotes' with considerations for stocking based on demand.
- A 'reasoning' explaining your prediction, referencing the input factors.
`,
});

const aiDemandPredictionFlow = ai.defineFlow(
  {
    name: 'aiDemandPredictionFlow',
    inputSchema: PredictDailyDemandInputSchema,
    outputSchema: PredictDailyDemandOutputSchema,
  },
  async input => {
    const {output} = await predictDailyDemandPrompt(input);
    return output!;
  }
);
