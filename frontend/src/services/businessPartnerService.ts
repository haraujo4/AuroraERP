import api from './api';
import type { BusinessPartner, CreateBusinessPartnerDto } from '../types/crm';

export const BusinessPartnerService = {
    getAll: async () => {
        const response = await api.get<BusinessPartner[]>('/crm/business-partners');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<BusinessPartner>(`/crm/business-partners/${id}`);
        return response.data;
    },

    create: async (data: CreateBusinessPartnerDto) => {
        const response = await api.post<BusinessPartner>('/crm/business-partners', data);
        return response.data;
    }
};
