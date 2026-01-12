import axios from 'axios';
import type { SalesQuote, CreateSalesQuote } from '../types/sales-quotes';

const API_URL = 'http://localhost:5000/api/sales/quotes';

export const salesQuoteService = {
    getAll: async (): Promise<SalesQuote[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id: string): Promise<SalesQuote> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (quote: CreateSalesQuote): Promise<SalesQuote> => {
        const response = await axios.post(API_URL, quote);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<void> => {
        await axios.patch(`${API_URL}/${id}/status`, { status });
    }
};
