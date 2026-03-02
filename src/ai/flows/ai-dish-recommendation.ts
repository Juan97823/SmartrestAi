'use server';
/**
 * @fileOverview Provides AI-generated dish recommendations based on sales history and customer context.
 *
 * - aiDishRecommendation - A function that generates dish recommendations.
 * - DishRecommendationInput - The input type for the aiDishRecommendation function.
 * - DishRecommendationOutput - The return type for the aiDishRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DishRecommendationInputSchema = z.object({
  orderedDishNames: z.array(z.string()).describe('A list of dishes already ordered by the customer.'),
  customerPreferences: z.string().optional().describe('Any known customer preferences or dietary restrictions (e.g., "vegetarian", "no nuts", "prefers spicy food").'),
  occasionOrTime: z.string().optional().describe('Context such as "dinner", "lunch", "dessert", "happy hour", or "special celebration".'),
  popularItemsRecently: z.array(z.string()).optional().describe('A list of popular dishes or pairings based on recent sales data to influence recommendations.'),
});
export type DishRecommendationInput = z.infer<typeof DishRecommendationInputSchema>;

const DishRecommendationOutputSchema = z.object({
  recommendedDishes: z.array(z.string()).describe('A list of recommended dishes, considering the ordered dishes and customer preferences, aiming for upsell or enhanced experience.'),
  reasoning: z.string().describe('A brief and persuasive explanation for the recommendations, highlighting why they complement the current order or meet preferences.'),
});
export type DishRecommendationOutput = z.infer<typeof DishRecommendationOutputSchema>;

export async function aiDishRecommendation(input: DishRecommendationInput): Promise<DishRecommendationOutput> {
  return dishRecommendationFlow(input);
}

const dishRecommendationPrompt = ai.definePrompt({
  name: 'dishRecommendationPrompt',
  input: { schema: DishRecommendationInputSchema },
  output: { schema: DishRecommendationOutputSchema },
  prompt: `You are an expert waiter and sommelier at a high-end restaurant, known for your exceptional ability to recommend the perfect complementary dishes to enhance a customer's dining experience. Your primary goal is to provide recommendations that will delight the customer, align with their tastes, and potentially lead to an upsell, thereby improving their overall meal.

The customer has already ordered the following dishes:
{{#if orderedDishNames}}
  {{#each orderedDishNames}}
    - {{{this}}}
  {{/each}}
{{else}}
  No dishes have been ordered yet, this is an opportunity to suggest initial appealing options.
{{/if}}

{{#if customerPreferences}}
Known customer preferences or dietary restrictions: {{{customerPreferences}}}
{{/if}}

{{#if occasionOrTime}}
The current dining context or occasion is: {{{occasionOrTime}}}
{{/if}}

{{#if popularItemsRecently}}
Based on recent sales history and popular demand, some highly recommended items or classic pairings include:
{{#each popularItemsRecently}}
  - {{{this}}}
{{/each}}
Consider these popular choices or their complementary aspects when making your recommendations.
{{/if}}

Based on all this information, thoughtfully recommend 1-3 dishes that would best complement their current order or serve as appealing options if no dishes are ordered yet. Focus on items that would naturally fit or significantly elevate their meal. For each recommendation, provide a brief, compelling, and professional reason, highlighting how it enhances the dining experience, complements the existing choices, or aligns with their preferences. Think about taste profiles, culinary balance, and customer satisfaction.`,
});

const dishRecommendationFlow = ai.defineFlow(
  {
    name: 'dishRecommendationFlow',
    inputSchema: DishRecommendationInputSchema,
    outputSchema: DishRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await dishRecommendationPrompt(input);
    return output!;
  }
);
