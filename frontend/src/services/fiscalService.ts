import api from './api';
import type { TaxRule, CreateTaxRuleDto } from '../types/fiscal';

export const fiscalService = {
    getAllRules: async () => {
        const response = await api.get<TaxRule[]>('/fiscal/tax-rules');
        return response.data;
    },

    createRule: async (data: CreateTaxRuleDto) => {
        const response = await api.post<TaxRule>('/fiscal/tax-rules', data);
        return response.data;
    },

    getRuleById: async (id: string) => {
        const response = await api.get<TaxRule>(`/fiscal/tax-rules/${id}`);
        return response.data;
    },

    updateRule: async (id: string, data: CreateTaxRuleDto) => {
        const response = await api.put<TaxRule>(`/fiscal/tax-rules/${id}`, data);
        return response.data;
    },

    calculate: async (data: {
        sourceState: string;
        destState: string;
        ncmCode?: string;
        operationType: string;
        itemValue: number;
    }) => {
        const response = await api.post('/fiscal/calculate', data);
        return response.data;
    },

    getDocuments: async () => {
        const response = await api.get('/fiscal/documents');
        return response.data;
    },

    getDocByInvoiceId: async (invoiceId: string) => {
        const response = await api.get(`/fiscal/documents/invoice/${invoiceId}`);
        return response.data;
    },

    generateNfe: async (invoiceId: string) => {
        const response = await api.post(`/fiscal/documents/${invoiceId}/generate`);
        return response.data;
    },

    cancelNfe: async (id: string) => {
        await api.post(`/fiscal/documents/${id}/cancel`);
    }
};

export default fiscalService;
