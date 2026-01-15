import api from './api';
import type { Account, CreateAccount, JournalEntry, CreateJournalEntry, Invoice, CreateInvoice, Payment, CreatePayment } from '../types/finance';

export const financeService = {

    // Accounts
    getAccounts: async (): Promise<Account[]> => {
        const response = await api.get('/finance/account');
        return response.data;
    },
    getAccountById: async (id: string): Promise<Account> => {
        const response = await api.get(`/finance/account/${id}`);
        return response.data;
    },
    createAccount: async (data: CreateAccount): Promise<Account> => {
        const response = await api.post('/finance/account', data);
        return response.data;
    },
    updateAccount: async (id: string, data: Partial<Account>): Promise<void> => {
        await api.put(`/finance/account/${id}`, data);
    },
    deleteAccount: async (id: string): Promise<void> => {
        await api.delete(`/finance/account/${id}`);
    },

    // Journal Entries
    getJournalEntries: async (): Promise<JournalEntry[]> => {
        const response = await api.get('/finance/journalentry');
        return response.data;
    },
    getJournalEntry: async (id: string): Promise<JournalEntry> => {
        const response = await api.get(`/finance/journalentry/${id}`);
        return response.data;
    },
    getJournalEntryById: async (id: string): Promise<JournalEntry> => {
        const response = await api.get(`/finance/journalentry/${id}`);
        return response.data;
    },
    createJournalEntry: async (data: CreateJournalEntry): Promise<JournalEntry> => {
        const response = await api.post('/finance/journalentry', data);
        return response.data;
    },
    postJournalEntry: async (id: string): Promise<void> => {
        await api.post(`/finance/journalentry/${id}/post`);
    },

    // Invoices (AR/AP)
    getInvoices: async (): Promise<Invoice[]> => {
        const response = await api.get('/finance/invoices');
        return response.data;
    },
    getInvoiceById: async (id: string): Promise<Invoice> => {
        const response = await api.get(`/finance/invoices/${id}`);
        return response.data;
    },
    createInvoice: async (data: CreateInvoice): Promise<Invoice> => {
        const response = await api.post('/finance/invoices', data);
        return response.data;
    },
    postInvoice: async (id: string): Promise<void> => {
        await api.post(`/finance/invoices/${id}/post`);
    },
    cancelInvoice: async (id: string): Promise<void> => {
        await api.post(`/finance/invoices/${id}/cancel`);
    },
    reverseInvoice: async (id: string, reason: string): Promise<void> => {
        await api.post(`/finance/invoices/${id}/reverse`, { reason });
    },
    reverseJournalEntry: async (id: string, reason: string): Promise<void> => {
        await api.post(`/finance/journalentry/${id}/reverse`, { reason });
    },
    deleteInvoice: async (id: string): Promise<void> => {
        await api.delete(`/finance/invoices/${id}`);
    },
    createFromPurchaseOrder: async (data: { purchaseOrderId: string; issueDate: string; dueDate: string }): Promise<Invoice> => {
        const response = await api.post('/finance/invoices/from-purchase-order', data);
        return response.data;
    },
    createFromSalesOrder: async (data: { salesOrderId: string; issueDate: string; dueDate: string }): Promise<Invoice> => {
        const response = await api.post('/finance/invoices/from-sales-order', data);
        return response.data;
    },

    // Payments
    getPayments: async (): Promise<Payment[]> => {
        const response = await api.get('/finance/payments');
        return response.data;
    },
    getPaymentById: async (id: string): Promise<Payment> => {
        const response = await api.get(`/finance/payments/${id}`);
        return response.data;
    },
    createPayment: async (data: CreatePayment): Promise<Payment> => {
        const response = await api.post('/finance/payments', data);
        return response.data;
    },
    postPayment: async (id: string): Promise<void> => {
        await api.post(`/finance/payments/${id}/post`);
    },
    cancelPayment: async (id: string): Promise<void> => {
        await api.post(`/finance/payments/${id}/cancel`);
    }
};
