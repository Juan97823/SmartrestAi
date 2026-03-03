'use server';
/**
 * @fileOverview Este archivo define un flujo de Genkit para alertar proactivamente a los gerentes de cocina
 * sobre ingredientes en riesgo de agotarse.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveInventoryAlertsInputSchema = z.object({
  inventoryItems: z
    .array(
      z.object({
        name: z.string().describe('Nombre del ingrediente.'),
        currentStock: z.number().positive().describe('Cantidad actual en stock.'),
        unit: z.string().describe('Unidad de medida (kg, unidades, litros).'),
        averageDailyConsumption: z.number().min(0).describe('Consumo diario estimado.'),
      })
    )
    .min(1),
});
export type PredictiveInventoryAlertsInput = z.infer<typeof PredictiveInventoryAlertsInputSchema>;

const PredictiveInventoryAlertsOutputSchema = z.object({
  atRiskIngredients: z
    .array(
      z.object({
        name: z.string().describe('Nombre del ingrediente en riesgo.'),
        currentStock: z.number().describe('Stock actual.'),
        unit: z.string().describe('Unidad.'),
        estimatedDaysRemaining: z.number().min(0).describe('Días estimados restantes.'),
        reorderRecommendation: z.number().positive().describe('Cantidad sugerida para reordenar.'),
        reason: z.string().describe('Explicación del riesgo en español.'),
      })
    ),
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
  prompt: `Eres un asistente de IA para un gerente de cocina en Colombia.
Tu tarea es revisar el inventario e identificar ingredientes en riesgo de agotarse pronto (menos de 3 días de stock). 

Datos de inventario:
{{#each inventoryItems}}
- {{{name}}}: Stock actual {{{currentStock}}} {{{unit}}}, Consumo Diario: {{{averageDailyConsumption}}} {{{unit}}}
{{/each}}

Identifica los ítems en riesgo y proporciona recomendaciones de pedido. Responde todo en ESPAÑOL.`,
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
