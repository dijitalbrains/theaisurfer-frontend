import api from "./api";
import type { WaxDetails, UpdateAutoReloadDto } from "../types/wax.types";

export const waxService = {
  getDetails: async () => {
    const response = await api.get<WaxDetails>("/wax");
    return response.data;
  },

  purchase: async (amount: number) => {
    const response = await api.post("/wax/purchase", { amount });
    return response.data;
  },

  updateAutoReload: async (payload: UpdateAutoReloadDto) => {
    const response = await api.post("/wax/auto-reload", payload);
    return response.data;
  },

  addCard: async (paymentMethodId: string) => {
    const response = await api.post("/wax/add-card", { paymentMethodId });
    return response.data;
  },
};
