import api from './api';
import type { Empresa, CreateEmpresaDto } from '../types/organization';

export const companyService = {
    getAll: async (): Promise<Empresa[]> => {
        const response = await api.get('/organization/companies');
        return response.data;
    },

    getById: async (id: string): Promise<Empresa> => {
        const response = await api.get(`/organization/companies/${id}`);
        return response.data;
    },

    create: async (company: CreateEmpresaDto): Promise<Empresa> => {
        const response = await api.post('/organization/companies', company);
        return response.data;
    }
};
