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
    },

    // Branch (Filial)
    getBranches: async () => {
        const response = await api.get('/organization/branches');
        return response.data;
    },
    getBranchesByCompany: async (companyId: string) => {
        const response = await api.get(`/organization/branches/by-company/${companyId}`);
        return response.data;
    },
    createBranch: async (data: any) => {
        const response = await api.post('/organization/branches', data);
        return response.data;
    },

    // Cost Centers
    getCostCentersByCompany: async (companyId: string) => {
        const response = await api.get(`/organization/cost-centers/by-company/${companyId}`);
        return response.data;
    },
    createCostCenter: async (data: any) => {
        const response = await api.post('/organization/cost-centers', data);
        return response.data;
    },

    // Profit Centers
    getProfitCentersByCompany: async (companyId: string) => {
        const response = await api.get(`/organization/profit-centers/by-company/${companyId}`);
        return response.data;
    },
    createProfitCenter: async (data: any) => {
        const response = await api.post('/organization/profit-centers', data);
        return response.data;
    },

    // Warehouses (Depósitos)
    getWarehousesByBranch: async (branchId: string) => {
        const response = await api.get(`/organization/warehouses/by-branch/${branchId}`);
        return response.data;
    },
    createWarehouse: async (data: any) => {
        const response = await api.post('/organization/warehouses', data);
        return response.data;
    },

    // Storage Locations (Locais de Estoque)
    getStorageLocationsByWarehouse: async (warehouseId: string) => {
        const response = await api.get(`/organization/storage-locations/by-warehouse/${warehouseId}`);
        return response.data;
    },
    createStorageLocation: async (data: any) => {
        const response = await api.post('/organization/storage-locations', data);
        return response.data;
    }
};
