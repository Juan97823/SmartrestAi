'use server';
/**
 * @fileOverview A Genkit flow for a customer support chatbot for the SmartRest AI restaurant.
 *
 * - customerSupportChatbot - A function that handles customer queries.
 * - CustomerSupportChatbotInput - The input type for the customerSupportChatbot function.
 * - CustomerSupportChatbotOutput - The return type for the customerSupportChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSupportChatbotInputSchema = z.object({
  query: z.string().describe('The customer\'s message or query for the chatbot.'),
});
export type CustomerSupportChatbotInput = z.infer<typeof CustomerSupportChatbotInputSchema>;

const CustomerSupportChatbotOutputSchema = z
  .string()
  .describe('The chatbot\'s response to the customer\'s query.');
export type CustomerSupportChatbotOutput = z.infer<typeof CustomerSupportChatbotOutputSchema>;

const prompt = ai.definePrompt({
  name: 'customerSupportChatbotPrompt',
  input: {schema: CustomerSupportChatbotInputSchema},
  output: {schema: CustomerSupportChatbotOutputSchema},
  prompt: `You are a friendly and helpful AI chatbot for SmartRest AI restaurant. Your purpose is to assist customers with their inquiries about the restaurant. Provide concise and accurate information based on the details below.

Restaurant Information:
- Menu: Our menu features a variety of delicious dishes, including our popular 'SmartBurger' (a gourmet beef burger with AI-recommended toppings), 'Veggie Delight Pizza', 'Grilled Salmon with Seasonal Vegetables', and a selection of local craft beers and fine wines. Desserts include 'AI-Sweet Chocolate Lava Cake'.
- Opening Hours: We are open Monday to Friday from 11:00 AM to 10:00 PM, and on weekends from 9:00 AM to 11:00 PM (brunch served until 2:00 PM).
- Reservations: To make a reservation, please visit our website and fill out the reservation form, or call us directly at (555) 123-4567 during business hours. We recommend booking in advance, especially for weekend evenings.

Customer Query: {{{query}}}
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
