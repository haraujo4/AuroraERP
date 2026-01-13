import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://31.97.168.147:5000/api'}/mrp`;

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
        const response = await axios.post(`${API_URL}/run`);
        return response.data;
    }
};
