import { api } from './api';

export interface Role {
    id: string;
    name: string;
    description: string;
}

export const RoleService = {
    getAll: async (): Promise<Role[]> => {
        const response = await api.get<Role[]>('/security/roles');
        return response.data;
    },

    getById: async (id: string): Promise<Role> => {
        const response = await api.get<Role>(`/security/roles/${id}`);
        return response.data;
    }
};
