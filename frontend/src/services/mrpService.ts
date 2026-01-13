import axios from 'axios';

const API_URL = 'http://localhost:5000/api/mrp';

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
