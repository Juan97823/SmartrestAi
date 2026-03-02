import { config } from 'dotenv';
config();

import '@/ai/flows/predictive-inventory-alerts.ts';
import '@/ai/flows/ai-demand-prediction-flow.ts';
import '@/ai/flows/ai-dish-recommendation.ts';
import '@/ai/flows/customer-support-chatbot-flow.ts';