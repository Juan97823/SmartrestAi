'use server';
/**
 * @fileOverview Flujo de Genkit para análisis predictivo de rentabilidad por sucursal en Pesos Colombianos (COP).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalisisRentabilidadInputSchema = z.object({
  sucursalId: z.string().describe('ID de la sucursal a analizar.'),
  ingresosMensuales: z.number().describe('Ingresos brutos mensuales actuales en COP.'),
  costosFijos: z.number().describe('Costos fijos mensuales en COP.'),
  costosVariables: z.number().describe('Costos variables mensuales en COP.'),
  mesesProyectados: z.number().default(6).describe('Número de meses para la proyección.'),
});
export type AnalisisRentabilidadInput = z.infer<typeof AnalisisRentabilidadInputSchema>;

const AnalisisRentabilidadOutputSchema = z.object({
  margenActual: z.number().describe('Margen de beneficio actual en porcentaje.'),
  proyeccionBeneficio: z.array(z.object({
    mes: z.string(),
    beneficioEstimado: z.number(),
  })).describe('Proyección de beneficios mensuales en COP.'),
  recomendacionesOptimización: z.array(z.string()).describe('Sugerencias de la IA para mejorar la rentabilidad en el contexto colombiano.'),
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
  prompt: `Eres un consultor financiero experto en la industria restaurantera de Colombia. 
Analiza los datos de la sucursal {{{sucursalId}}} expresados en Pesos Colombianos (COP):
- Ingresos: {{{ingresosMensuales}}} COP
- Costos Fijos: {{{costosFijos}}} COP
- Costos Variables: {{{costosVariables}}} COP

Calcula el margen actual. Proyecta los beneficios para {{{mesesProyectados}}} meses considerando tendencias de mercado local (inflación colombiana, estacionalidad, etc.).
Provee 3-5 recomendaciones específicas de optimización adecuadas para el mercado de Colombia (ej. proveedores locales, eficiencia energética, gestión de propinas o impuestos como el impoconsumo).
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
