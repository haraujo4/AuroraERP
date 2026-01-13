import api from './api';

export interface PricingResult {
    basePrice: number;
    effectivePrice: number;
    discountAmount: number;
    discountPercentage: number;
    appliedPriceList?: string;
    appliedDiscountRule?: string;
}

export const PricingService = {
    calculate: async (materialId: string, businessPartnerId: string, quantity: number): Promise<PricingResult> => {
        const response = await api.get('/sales/pricing/calculate', {
            params: { materialId, businessPartnerId, quantity }
        });
        return response.data;
    },
};

export default PricingService;
