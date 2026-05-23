'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSupportChatbotInputSchema = z.object({
  query: z.string().describe('Consulta del cliente.'),
});

const CustomerSupportChatbotOutputSchema = z.object({
  respuesta: z.string().describe('Respuesta detallada en español.'),
});

const prompt = ai.definePrompt({
  name: 'customerSupportChatbotPrompt',
  input: {schema: CustomerSupportChatbotInputSchema},
  output: {schema: CustomerSupportChatbotOutputSchema},
  prompt: `Eres un asistente de IA para "SmartRest AI" en Colombia.
Responde de forma concisa y amigable en español.

Menú: SmartBurger ($35k), Pizza ($32k), Salmón ($48k).
Horarios: L-V 11am-10pm, Fines 9am-11pm.

Consulta: {{{query}}}`,
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
  input: { query: string }
): Promise<string> {
  const result = await customerSupportChatbotFlow(input);
  return result.respuesta;
}