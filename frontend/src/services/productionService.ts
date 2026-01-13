import api from './api';
import type {
    WorkCenter, CreateWorkCenter,
    BillOfMaterial, CreateBillOfMaterial,
    ProductionOrder, CreateProductionOrder
} from '../types/production';

export const productionService = {
    // Work Centers
    getWorkCenters: async (): Promise<WorkCenter[]> => {
        const response = await api.get('/production/work-centers');
        return response.data;
    },
    getWorkCenterById: async (id: string): Promise<WorkCenter> => {
        const response = await api.get(`/production/work-centers/${id}`);
        return response.data;
    },
    createWorkCenter: async (data: CreateWorkCenter): Promise<WorkCenter> => {
        const response = await api.post('/production/work-centers', data);
        return response.data;
    },

    // BOMs
    getBOMs: async (): Promise<BillOfMaterial[]> => {
        const response = await api.get('/production/boms');
        return response.data;
    },
    getBOMById: async (id: string): Promise<BillOfMaterial> => {
        const response = await api.get(`/production/boms/${id}`);
        return response.data;
    },
    createBOM: async (data: CreateBillOfMaterial): Promise<BillOfMaterial> => {
        const response = await api.post('/production/boms', data);
        return response.data;
    },

    // Orders
    getOrders: async (): Promise<ProductionOrder[]> => {
        const response = await api.get('/production/orders');
        return response.data;
    },
    getOrderById: async (id: string): Promise<ProductionOrder> => {
        const response = await api.get(`/production/orders/${id}`);
        return response.data;
    },
    createOrder: async (data: CreateProductionOrder): Promise<ProductionOrder> => {
        const response = await api.post('/production/orders', data);
        return response.data;
    },
    releaseOrder: async (id: string): Promise<void> => {
        await api.post(`/production/orders/${id}/release`, {});
    },
    confirmOrder: async (id: string): Promise<void> => {
        await api.post(`/production/orders/${id}/confirm`, {});
    }
};
