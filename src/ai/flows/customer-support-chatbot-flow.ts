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

const CustomerSupportChatbotOutputSchema = z
  .string()
  .describe('La respuesta del chatbot a la consulta del cliente.');
export type CustomerSupportChatbotOutput = z.infer<typeof CustomerSupportChatbotOutputSchema>;

const prompt = ai.definePrompt({
  name: 'customerSupportChatbotPrompt',
  input: {schema: CustomerSupportChatbotInputSchema},
  output: {schema: CustomerSupportChatbotOutputSchema},
  prompt: `Eres un asistente de IA amigable y servicial para el restaurante SmartRest AI en Colombia. Tu propósito es ayudar a los clientes y al personal con información sobre el restaurante. Responde siempre en ESPAÑOL de forma concisa.

Información del Restaurante:
- Menú: SmartBurger (hamburguesa gourmet), Pizza Veggie Criolla, Salmón a la Parrilla, Patatas Trufadas.
- Horarios: Lunes a Viernes 11:00 AM - 10:00 PM. Fines de semana 9:00 AM - 11:00 PM.
- Reservas: Se pueden hacer por la web o llamando al (555) 123-4567.
- Precios: Los precios se manejan en Pesos Colombianos (COP). El ticket promedio es de $85.000 COP.

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
): Promise<CustomerSupportChatbotOutput> {
  return customerSupportChatbotFlow(input);
}
