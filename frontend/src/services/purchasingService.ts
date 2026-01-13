import api from './api';
import type { PurchaseOrder, PurchaseRequisition } from '../types/purchasing';

const purchasingService = {
    // Requisitions
    getRequisitions: async () => {
        const response = await api.get<PurchaseRequisition[]>('/purchasing/requisitions');
        return response.data;
    },

    getRequisition: async (id: string) => {
        const response = await api.get<PurchaseRequisition>(`/purchasing/requisitions/${id}`);
        return response.data;
    },

    createRequisition: async (data: any) => {
        const response = await api.post<PurchaseRequisition>('/purchasing/requisitions', data);
        return response.data;
    },

    approveRequisition: async (id: string) => {
        await api.post(`/purchasing/requisitions/${id}/approve`);
    },

    // Orders
    getOrders: async () => {
        const response = await api.get<PurchaseOrder[]>('/purchasing/orders');
        return response.data;
    },

    getOrder: async (id: string) => {
        const response = await api.get<PurchaseOrder>(`/purchasing/orders/${id}`);
        return response.data;
    },

    createOrder: async (data: any) => {
        const response = await api.post<PurchaseOrder>('/purchasing/orders', data);
        return response.data;
    },

    approveOrder: async (id: string) => {
        await api.post(`/purchasing/orders/${id}/approve`);
    },

    receiveOrder: async (id: string) => {
        await api.post(`/purchasing/orders/${id}/receive`);
    }
};

export default purchasingService;
