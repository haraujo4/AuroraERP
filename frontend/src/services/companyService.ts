import axios from 'axios';
import type { Empresa, CreateEmpresaDto } from '../types/organization';

const API_URL = 'http://localhost:5000/api/organization/companies';

export const companyService = {
    getAll: async (): Promise<Empresa[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id: string): Promise<Empresa> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (company: CreateEmpresaDto): Promise<Empresa> => {
        const response = await axios.post(API_URL, company);
        return response.data;
    }
};
