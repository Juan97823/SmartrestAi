'use server';
/**
 * @fileOverview Flujo de Genkit para un chatbot de soporte al cliente del restaurante SmartRest AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSupportChatbotInputSchema = z.object({
  query: z.string().describe('La consulta o mensaje del cliente para el chatbot.'),
});
export type CustomerSupportChatbotInput = z.infer<typeof CustomerSupportChatbotInputSchema>;

const CustomerSupportChatbotOutputSchema = z.object({
  respuesta: z.string().describe('La respuesta detallada del chatbot en español.'),
});
export type CustomerSupportChatbotOutput = z.infer<typeof CustomerSupportChatbotOutputSchema>;

const prompt = ai.definePrompt({
  name: 'customerSupportChatbotPrompt',
  input: {schema: CustomerSupportChatbotInputSchema},
  output: {schema: CustomerSupportChatbotOutputSchema},
  prompt: `Eres un asistente de IA amigable y servicial para el restaurante "SmartRest AI" en Colombia. Tu propósito es ayudar a los clientes y al personal con información precisa sobre el restaurante.

Directrices:
1. Responde siempre en ESPAÑOL Colombiano de forma concisa y profesional.
2. Si te preguntan sobre el restaurante, usa la información proporcionada abajo.
3. Si te preguntan por un "análisis", explica que como asistente de soporte puedes dar información general, pero los informes detallados están en los módulos de "Rentabilidad" o "Insights".

Información del Restaurante:
- Menú Destacado: SmartBurger ($35.000 COP), Pizza Veggie Criolla ($32.000 COP), Salmón a la Parrilla ($48.000 COP), Patatas Trufadas ($18.000 COP).
- Horarios: Lunes a Viernes 11:00 AM - 10:00 PM. Fines de semana 9:00 AM - 11:00 PM.
- Reservas: Se pueden gestionar en el módulo de "Gestión de Mesas" o llamando al (601) 555-1234.
- Ubicación: Sede principal en Centro Histórico, Bogotá.

Consulta del Cliente: {{{query}}}
`,
});

const customerSupportChatbotFlow = ai.defineFlow(
  {
    name: 'customerSupportChatbotFlow',
    inputSchema: CustomerSupportChatbotInputSchema,
    outputSchema: CustomerSupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function customerSupportChatbot(
  input: CustomerSupportChatbotInput
): Promise<string> {
  const result = await customerSupportChatbotFlow(input);
  return result.respuesta;
}
