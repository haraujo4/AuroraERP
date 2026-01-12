import api from './api';

export interface DeliveryItemDto {
    id: string;
    materialId: string;
    materialName: string;
    quantity: number;
    salesOrderItemId: string;
}

export interface DeliveryDto {
    id: string;
    number: string;
    salesOrderId: string;
    salesOrderNumber: string;
    status: string;
    deliveryDate: string;
    postingDate?: string;
    items: DeliveryItemDto[];
}

export const deliveryService = {
    getAll: async (): Promise<DeliveryDto[]> => {
        const response = await api.get<DeliveryDto[]>('/logistics/deliveries');
        return response.data;
    },

    getById: async (id: string): Promise<DeliveryDto> => {
        const response = await api.get<DeliveryDto>(`/logistics/deliveries/${id}`);
        return response.data;
    },

    createFromOrder: async (orderId: string): Promise<DeliveryDto> => {
        const response = await api.post<DeliveryDto>(`/logistics/deliveries/from-order/${orderId}`);
        return response.data;
    },

    postDelivery: async (id: string): Promise<void> => {
        await api.post(`/logistics/deliveries/${id}/post`);
    }
};
