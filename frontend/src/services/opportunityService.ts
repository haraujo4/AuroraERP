import api from './api';
import type { Opportunity, CreateOpportunityDto } from '../types/crm-opportunities';

export const OpportunityService = {
    getAll: async () => {
        const response = await api.get<Opportunity[]>('/crm/opportunities');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Opportunity>(`/crm/opportunities/${id}`);
        return response.data;
    },

    create: async (data: CreateOpportunityDto) => {
        const response = await api.post<Opportunity>('/crm/opportunities', data);
        return response.data;
    },

    updateStage: async (id: string, stage: string, probability: number) => {
        const response = await api.patch(`/crm/opportunities/${id}/stage`, { stage, probability });
        return response.data;
    }
};
