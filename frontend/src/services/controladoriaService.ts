import api from './api';

export interface DreLine {
    accountCode: string;
    accountName: string;
    amount: number;
    isNegative: boolean;
}

export interface DreData {
    grossRevenue: number;
    taxes: number;
    netRevenue: number;
    cogs: number;
    grossProfit: number;
    operatingExpenses: number;
    ebitda: number;
    netProfit: number;
    lines: DreLine[];
}

export interface PerformanceData {
    id: string;
    name: string;
    budget: number;
    actual: number;
    variance: number;
}

export const controladoriaService = {
    async getDre(startDate: string, endDate: string, costCenterId?: string, profitCenterId?: string): Promise<DreData> {
        const response = await api.get('/controladoria/dre', {
            params: { startDate, endDate, costCenterId, profitCenterId }
        });
        return response.data;
    },

    async getCostCenterPerformance(startDate: string, endDate: string): Promise<PerformanceData[]> {
        const response = await api.get('/controladoria/performance/cost-center', {
            params: { startDate, endDate }
        });
        return response.data;
    }
};
