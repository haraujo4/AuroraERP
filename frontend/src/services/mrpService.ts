import api from './api';

export interface MRPRecommendation {
    materialId: string;
    materialCode: string;
    materialDescription: string;
    quantity: number;
    requiredDate: string;
    actionType: 'PurchaseRequisition' | 'ProductionOrder';
    reason: string;
}

export interface MRPResult {
    executionTime: string;
    recommendations: MRPRecommendation[];
}

export const mrpService = {
    async runMRP(): Promise<MRPResult> {
        const response = await api.post('/mrp/run');
        return response.data;
    }
};
