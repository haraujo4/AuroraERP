import api from './api';
import type { Lead, CreateLeadDto } from '../types/crm-leads';

export const LeadService = {
    getAll: async () => {
        const response = await api.get<Lead[]>('/crm/leads');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Lead>(`/crm/leads/${id}`);
        return response.data;
    },

    create: async (data: CreateLeadDto) => {
        const response = await api.post<Lead>('/crm/leads', data);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        await api.patch(`/crm/leads/${id}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    addInteraction: async (id: string, body: string, type: string) => {
        await api.post(`/crm/leads/${id}/interactions`, { body, type });
    }
};
