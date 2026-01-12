import api from './api';
import type { StockLevel, CreateStockMovement } from '../types/inventory';

export const inventoryService = {
    getAll: async (): Promise<StockLevel[]> => {
        const response = await api.get<StockLevel[]>('/logistics/inventory');
        return response.data;
    },

    getStockByMaterial: async (materialId: string): Promise<StockLevel[]> => {
        const response = await api.get<StockLevel[]>(`/logistics/inventory/material/${materialId}`);
        return response.data;
    },

    createMovement: async (data: CreateStockMovement): Promise<void> => {
        await api.post('/logistics/inventory/movement', data);
    }
};
