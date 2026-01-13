import api from './api';
import type { Material, CreateMaterial } from '../types/materials';

export const materialService = {
    getAll: async (): Promise<Material[]> => {
        const response = await api.get('/logistics/materials');
        return response.data;
    },

    getById: async (id: string): Promise<Material> => {
        const response = await api.get(`/logistics/materials/${id}`);
        return response.data;
    },

    create: async (material: CreateMaterial): Promise<Material> => {
        const response = await api.post('/logistics/materials', material);
        return response.data;
    },

    update: async (id: string, material: CreateMaterial): Promise<Material> => {
        const response = await api.put(`/logistics/materials/${id}`, material);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/logistics/materials/${id}`);
    }
};
