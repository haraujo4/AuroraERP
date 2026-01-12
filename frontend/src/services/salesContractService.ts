import axios from 'axios';
import type { SalesContract, CreateSalesContractDto } from '../types/sales-contracts';

const API_URL = 'http://localhost:5000/api/sales/contracts';

export const salesContractService = {
    getAll: async (): Promise<SalesContract[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id: string): Promise<SalesContract> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (contract: CreateSalesContractDto): Promise<SalesContract> => {
        const response = await axios.post(API_URL, contract);
        return response.data;
    },

    update: async (id: string, contract: CreateSalesContractDto): Promise<SalesContract> => {
        const response = await axios.put(`${API_URL}/${id}`, contract);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<SalesContract> => {
        const response = await axios.patch(`${API_URL}/${id}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
