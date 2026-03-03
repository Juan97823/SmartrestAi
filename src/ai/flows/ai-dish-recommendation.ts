'use server';
/**
 * @fileOverview Proporciona recomendaciones de platos generadas por IA basadas en el historial de ventas y el contexto del cliente.
 *
 * - aiDishRecommendation - Una función que genera recomendaciones de platos.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DishRecommendationInputSchema = z.object({
  orderedDishNames: z.array(z.string()).describe('Una lista de platos ya ordenados por el cliente.'),
  customerPreferences: z.string().optional().describe('Cualquier preferencia conocida del cliente o restricciones dietéticas (ej., "vegetariano", "sin nueces", "prefiere comida picante").'),
  occasionOrTime: z.string().optional().describe('Contexto como "cena", "almuerzo", "postre", "happy hour" o "celebración especial".'),
  popularItemsRecently: z.array(z.string()).optional().describe('Una lista de platos populares o maridajes basados en datos de ventas recientes.'),
});
export type DishRecommendationInput = z.infer<typeof DishRecommendationInputSchema>;

const DishRecommendationOutputSchema = z.object({
  recommendedDishes: z.array(z.string()).describe('Una lista de platos recomendados para el upsell.'),
  reasoning: z.string().describe('Una explicación breve y persuasiva para las recomendaciones en español.'),
});
export type DishRecommendationOutput = z.infer<typeof DishRecommendationOutputSchema>;

export async function aiDishRecommendation(input: DishRecommendationInput): Promise<DishRecommendationOutput> {
  return dishRecommendationFlow(input);
}

const dishRecommendationPrompt = ai.definePrompt({
  name: 'dishRecommendationPrompt',
  input: { schema: DishRecommendationInputSchema },
  output: { schema: DishRecommendationOutputSchema },
  prompt: `Eres un mesero experto y sommelier en un restaurante de alta gama en Colombia. Tu objetivo es recomendar platos complementarios para mejorar la experiencia del cliente y aumentar el ticket promedio.

El cliente ya ha pedido:
{{#if orderedDishNames}}
  {{#each orderedDishNames}}
    - {{{this}}}
  {{/each}}
{{else}}
  Aún no han pedido nada, sugiere opciones atractivas para empezar.
{{/if}}

{{#if customerPreferences}}
Preferencias: {{{customerPreferences}}}
{{/if}}

{{#if occasionOrTime}}
Contexto: {{{occasionOrTime}}}
{{/if}}

Basado en esto, recomienda 1-3 platos que complementen su orden actual. Proporciona una explicación persuasiva y profesional en ESPAÑOL Colombiano, enfocándote en el sabor y la armonía del menú.`,
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
