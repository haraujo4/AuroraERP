import api from './api';

export interface DashboardData {
    totalReceivable: number;
    totalPayable: number;
    monthlySales: number;
    monthlyExpenses: number;
    monthlyGrossProfit: number;
    grossMarginPercentage: number;
    recentActivities: {
        description: string;
        value: number;
        date: string;
        type: string;
    }[];
    salesTrend: {
        label: string;
        value: number;
    }[];
}

export const AnalyticsService = {
    getFinancialOverview: async (): Promise<DashboardData> => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    },
};

export default AnalyticsService;
