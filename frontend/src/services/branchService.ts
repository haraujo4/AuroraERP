import api from './api';
import type { Branch, CreateBranchDto, CreateDepositoDto } from '../types/organization';

export const branchService = {
    getAll: async (): Promise<Branch[]> => {
        const response = await api.get('/organization/branches');
        return response.data;
    },

    getById: async (id: string): Promise<Branch> => {
        const response = await api.get(`/organization/branches/${id}`);
        return response.data;
    },

    create: async (branch: CreateBranchDto): Promise<Branch> => {
        const response = await api.post('/organization/branches', branch);
        return response.data;
    },

    update: async (id: string, branch: CreateBranchDto): Promise<void> => {
        await api.put(`/organization/branches/${id}`, branch);
    },

    getDepositos: async (id: string): Promise<any[]> => {
        const response = await api.get(`/organization/branches/${id}/depositos`);
        return response.data;
    },

    createDeposito: async (id: string, data: CreateDepositoDto): Promise<void> => {
        await api.post(`/organization/branches/${id}/depositos`, data);
    }
};
