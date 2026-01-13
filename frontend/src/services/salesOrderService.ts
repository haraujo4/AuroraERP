import api from './api';
import type { SalesOrder, CreateSalesOrder } from '../types/sales-orders';

export const salesOrderService = {
    getAll: async (): Promise<SalesOrder[]> => {
        const response = await api.get('/sales/orders');
        return response.data;
    },

    getById: async (id: string): Promise<SalesOrder> => {
        const response = await api.get(`/sales/orders/${id}`);
        return response.data;
    },

    create: async (order: CreateSalesOrder): Promise<SalesOrder> => {
        const response = await api.post('/sales/orders', order);
        return response.data;
    },

    createFromQuote: async (quoteId: string): Promise<SalesOrder> => {
        const response = await api.post(`/sales/orders/from-quote/${quoteId}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<void> => {
        await api.patch(`/sales/orders/${id}/status`, { status });
    }
};
