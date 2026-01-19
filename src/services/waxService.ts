import api from './api';
import type { WaxDetails, UpdateAutoReloadDto } from '../types/wax.types';

export const waxService = {
  getDetails: async (): Promise<WaxDetails> => {
    const response = await api.get<WaxDetails>('/wax');
    return response.data;
  },

  purchaseWax: async (amountInDollars: number): Promise<{ message: string }> => {
    const response = await api.post('/wax/purchase', { amount: amountInDollars });
    return response.data;
  },

  updateAutoReloadSettings: async (
    settings: UpdateAutoReloadDto,
  ): Promise<{ message: string }> => {
    const response = await api.post('/wax/auto-reload', settings);
    return response.data;
  },

  addPaymentMethod: async (paymentMethodId: string): Promise<{ message: string }> => {
    const response = await api.post('/wax/payment-method', { paymentMethodId });
    return response.data;
  },
};
