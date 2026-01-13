import api from './api';
import type { SalesContract, CreateSalesContractDto } from '../types/sales-contracts';

export const salesContractService = {
    getAll: async (): Promise<SalesContract[]> => {
        const response = await api.get('/sales/contracts');
        return response.data;
    },

    getById: async (id: string): Promise<SalesContract> => {
        const response = await api.get(`/sales/contracts/${id}`);
        return response.data;
    },

    create: async (contract: CreateSalesContractDto): Promise<SalesContract> => {
        const response = await api.post('/sales/contracts', contract);
        return response.data;
    },

    update: async (id: string, contract: CreateSalesContractDto): Promise<SalesContract> => {
        const response = await api.put(`/sales/contracts/${id}`, contract);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<SalesContract> => {
        const response = await api.patch(`/sales/contracts/${id}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/sales/contracts/${id}`);
    }
};
