import axios from 'axios';
import type { Material, CreateMaterial } from '../types/materials';

const API_URL = 'http://localhost:5000/api/logistics/materials';

export const materialService = {
    getAll: async (): Promise<Material[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id: string): Promise<Material> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (material: CreateMaterial): Promise<Material> => {
        const response = await axios.post(API_URL, material);
        return response.data;
    },

    update: async (id: string, material: CreateMaterial): Promise<Material> => {
        const response = await axios.put(`${API_URL}/${id}`, material);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
