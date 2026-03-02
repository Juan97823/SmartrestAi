'use server';
/**
 * @fileOverview Flujo de Genkit para análisis predictivo de rentabilidad por sucursal.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalisisRentabilidadInputSchema = z.object({
  sucursalId: z.string().describe('ID de la sucursal a analizar.'),
  ingresosMensuales: z.number().describe('Ingresos brutos mensuales actuales.'),
  costosFijos: z.number().describe('Costos fijos (alquiler, salarios, etc.).'),
  costosVariables: z.number().describe('Costos variables (insumos, energía).'),
  mesesProyectados: z.number().default(6).describe('Número de meses para la proyección.'),
});
export type AnalisisRentabilidadInput = z.infer<typeof AnalisisRentabilidadInputSchema>;

const AnalisisRentabilidadOutputSchema = z.object({
  margenActual: z.number().describe('Margen de beneficio actual en porcentaje.'),
  proyeccionBeneficio: z.array(z.object({
    mes: z.string(),
    beneficioEstimado: z.number(),
  })).describe('Proyección de beneficios para los próximos meses.'),
  recomendacionesOptimización: z.array(z.string()).describe('Sugerencias de la IA para mejorar la rentabilidad.'),
  nivelRiesgo: z.enum(['Bajo', 'Moderado', 'Alto']).describe('Evaluación del riesgo financiero.'),
});
export type AnalisisRentabilidadOutput = z.infer<typeof AnalisisRentabilidadOutputSchema>;

export async function analizarRentabilidad(input: AnalisisRentabilidadInput): Promise<AnalisisRentabilidadOutput> {
  return analisisRentabilidadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analisisRentabilidadPrompt',
  input: {schema: AnalisisRentabilidadInputSchema},
  output: {schema: AnalisisRentabilidadOutputSchema},
  prompt: `Eres un consultor financiero experto en la industria restaurantera. 
Analiza los datos de la sucursal {{{sucursalId}}}:
- Ingresos: {{{ingresosMensuales}}}
- Costos Fijos: {{{costosFijos}}}
- Costos Variables: {{{costosVariables}}}

Calcula el margen actual. Proyecta los beneficios para {{{mesesProyectados}}} meses considerando tendencias de mercado (inflación del 0.5% mensual en costos y crecimiento esperado del 2% en ingresos).
Provee 3-5 recomendaciones específicas de optimización (ej. ingeniería de menú, reducción de desperdicios, optimización de turnos).
Determina el nivel de riesgo financiero.`,
});

const analisisRentabilidadFlow = ai.defineFlow(
  {
    name: 'analisisRentabilidadFlow',
    inputSchema: AnalisisRentabilidadInputSchema,
    outputSchema: AnalisisRentabilidadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
