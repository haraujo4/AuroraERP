import axios from 'axios';
import type { SalesOrder, CreateSalesOrder } from '../types/sales-orders';

const API_URL = `${import.meta.env.VITE_API_URL || 'https://auroraerp.softnexus.com.br/api'}/sales/orders`;

export const salesOrderService = {
    getAll: async (): Promise<SalesOrder[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id: string): Promise<SalesOrder> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (order: CreateSalesOrder): Promise<SalesOrder> => {
        const response = await axios.post(API_URL, order);
        return response.data;
    },

    createFromQuote: async (quoteId: string): Promise<SalesOrder> => {
        const response = await axios.post(`${API_URL}/from-quote/${quoteId}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<void> => {
        await axios.patch(`${API_URL}/${id}/status`, { status });
    }
};
