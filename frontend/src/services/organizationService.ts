import api from './api';
import type { GrupoEmpresarial, CreateGrupoEmpresarialDto, Empresa } from '../types/organization';

export const OrganizationService = {
    // Groups
    getGroups: async () => {
        const response = await api.get<GrupoEmpresarial[]>('/organization/groups');
        return response.data;
    },

    getGroupById: async (id: string) => {
        const response = await api.get<GrupoEmpresarial>(`/organization/groups/${id}`);
        return response.data;
    },

    createGroup: async (data: CreateGrupoEmpresarialDto) => {
        const response = await api.post<GrupoEmpresarial>('/organization/groups', data);
        return response.data;
    },

    // Companies
    getCompaniesByGroup: async (grupoId: string) => {
        const response = await api.get<Empresa[]>(`/organization/companies/by-group/${grupoId}`);
        return response.data;
    },

    createCompany: async (data: any) => {
        const response = await api.post<Empresa>('/organization/companies', data);
        return response.data;
    }
};
