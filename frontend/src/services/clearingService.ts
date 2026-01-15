import api from './api';

export interface OpenItem {
    lineId: string;
    journalEntryId: string;
    businessPartnerId: string;
    description: string;
    postingDate: string;
    reference: string;
    amount: number;
    type: 'Debit' | 'Credit';
    journalEntryType: string;
    accountName: string;
}

export interface ManualClearingRequest {
    lineIds: string[];
}

export const clearingService = {
    getOpenItems: async (partnerId: string): Promise<OpenItem[]> => {
        const response = await api.get<OpenItem[]>(`/finance/clearing/open-items/${partnerId}`);
        return response.data;
    },

    clearManual: async (request: ManualClearingRequest): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/finance/clearing/clear', request);
        return response.data;
    }
};
