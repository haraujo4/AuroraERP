import axios from 'axios';
import type { Branch, CreateBranchDto, CreateDepositoDto } from '../types/organization';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://31.97.168.147:5000/api'}/organization/branches`;

export const branchService = {
    getAll: async (): Promise<Branch[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id: string): Promise<Branch> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (branch: CreateBranchDto): Promise<Branch> => {
        const response = await axios.post(API_URL, branch);
        return response.data;
    },

    update: async (id: string, branch: CreateBranchDto): Promise<void> => {
        await axios.put(`${API_URL}/${id}`, branch);
    },

    getDepositos: async (id: string): Promise<any[]> => {
        const response = await axios.get(`${API_URL}/${id}/depositos`);
        return response.data;
    },

    createDeposito: async (id: string, data: CreateDepositoDto): Promise<void> => {
        await axios.post(`${API_URL}/${id}/depositos`, data);
    }
};
