import { api } from './api';

export interface Permission {
    id: string;
    code: string;
    name: string;
    module: string;
    transaction: string;
    description: string;
}

export const PermissionService = {
    getAll: async (): Promise<Permission[]> => {
        const response = await api.get<Permission[]>('/permissions');
        return response.data;
    }
};
