export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
export type AccountNature = 'Debit' | 'Credit';

export interface Account {
    id: string;
    code: string;
    name: string;
    type: AccountType;
    nature: AccountNature;
    level: number;
    isActive: boolean;
    parentId?: string;
    children?: Account[];
}

export interface CreateAccount {
    code: string;
    name: string;
    type: AccountType;
    nature: AccountNature;
    level: number;
    parentId?: string;
}

export type JournalEntryStatus = 'Draft' | 'Posted';

export interface JournalEntry {
    id: string;
    postingDate: string;
    documentDate: string;
    description: string;
    reference: string;
    status: JournalEntryStatus;
    lines: JournalEntryLine[];
}

export type JournalEntryLineType = 'Debit' | 'Credit';

export interface JournalEntryLine {
    id: string;
    accountId: string;
    amount: number;
    type: JournalEntryLineType;
    costCenterId?: string;
    accountName?: string; // Optional if needed for display
}

export interface CreateJournalEntry {
    postingDate: string;
    documentDate: string;
    description: string;
    reference?: string;
    lines: {
        accountId: string;
        amount: number;
        type: JournalEntryLineType;
        costCenterId?: string;
    }[];
}

// AR/AP Types
export type InvoiceType = 'Inbound' | 'Outbound';
export type InvoiceStatus = 'Draft' | 'Posted' | 'Paid' | 'Cancelled';

export interface InvoiceItem {
    id: string;
    description: string;
    materialId?: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    totalAmount: number;
    icmsRate: number;
    ipiRate: number;
    pisRate: number;
    cofinsRate: number;
    cfop?: number;
}

export interface Invoice {
    id: string;
    number: string;
    businessPartnerId: string;
    businessPartnerName: string;
    type: InvoiceType;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    grossAmount: number;
    taxAmount: number;
    netAmount: number;
    purchaseOrderId?: string;
    salesOrderId?: string;
    items: InvoiceItem[];
}

export interface CreateInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
}

export interface CreateInvoice {
    businessPartnerId: string;
    type: InvoiceType;
    issueDate: string;
    dueDate: string;
    items: CreateInvoiceItem[];
}

// Payment Types
export type PaymentMethod = 'Cash' | 'BankTransfer' | 'CreditCard' | 'Check' | 'Other';
export type PaymentStatus = 'Draft' | 'Posted' | 'Cancelled';

export interface Payment {
    id: string;
    businessPartnerId: string;
    businessPartnerName: string;
    amount: number;
    paymentDate: string;
    method: PaymentMethod;
    accountId: string;
    status: PaymentStatus;
    reference: string;
    invoiceId?: string;
}

export interface CreatePayment {
    businessPartnerId: string;
    amount: number;
    paymentDate: string;
    method: PaymentMethod;
    accountId: string;
    reference: string;
    invoiceId?: string;
}
