import api from './api';
import type { SalesQuote, CreateSalesQuote } from '../types/sales-quotes';

export const salesQuoteService = {
    getAll: async (): Promise<SalesQuote[]> => {
        const response = await api.get('/sales/quotes');
        return response.data;
    },

    getById: async (id: string): Promise<SalesQuote> => {
        const response = await api.get(`/sales/quotes/${id}`);
        return response.data;
    },

    create: async (quote: CreateSalesQuote): Promise<SalesQuote> => {
        const response = await api.post('/sales/quotes', quote);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<void> => {
        await api.patch(`/sales/quotes/${id}/status`, { status });
    }
};
