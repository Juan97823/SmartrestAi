'use server';
/**
 * @fileOverview Flujo de Genkit para predecir la demanda diaria del restaurante.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDailyDemandInputSchema = z.object({
  date: z
    .string()
    .describe("La fecha específica para predecir la demanda (ej., '2024-07-20')."),
  dayOfWeek: z
    .string()
    .describe("El día de la semana (ej., 'Lunes', 'Sábado')."),
  specialEvents: z
    .string()
    .optional()
    .describe('Eventos especiales o festivos conocidos (ej., "festival local", "festivo nacional").'),
});
export type PredictDailyDemandInput = z.infer<typeof PredictDailyDemandInputSchema>;

const PredictDailyDemandOutputSchema = z.object({
  predictedDemandLevel: z
    .enum(['Low', 'Medium', 'High', 'Very High'])
    .describe('Predicción categórica del nivel de demanda esperado.'),
  predictedCovers: z
    .number()
    .int()
    .describe('Número estimado de clientes o cubiertos para el día.'),
  staffingRecommendation: z
    .string()
    .describe('Recomendaciones de personal basadas en la demanda prevista.'),
  inventoryNotes: z
    .string()
    .describe('Notas importantes para la gestión de inventario.'),
  reasoning: z.string().describe('Razonamiento y factores detrás de la predicción.'),
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
  prompt: `Eres un modelo de predicción de demanda impulsado por IA para un restaurante.
Tu tarea es predecir la demanda diaria basándote en la fecha, el día de la semana y eventos especiales.

Detalles de entrada:
Fecha: {{{date}}}
Día: {{{dayOfWeek}}}
{{#if specialEvents}}Eventos Especiales: {{{specialEvents}}}{{/if}}

Considera patrones típicos:
- Los fines de semana y festivos suelen tener mayor demanda.
- Los días de semana (Lunes-Miércoles) suelen ser más flojos.
- Los eventos especiales impactan significativamente.

Proporciona la salida en ESPAÑOL:
- 'predictedDemandLevel' (Low, Medium, High, Very High).
- 'predictedCovers' (número estimado).
- 'staffingRecommendation' (en español).
- 'inventoryNotes' (en español).
- 'reasoning' (en español).`,
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
