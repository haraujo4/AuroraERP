export interface SalesQuoteItem {
    id: string;
    materialId: string;
    materialName: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    totalValue: number;
}

export interface SalesQuote {
    id: string;
    number: string;
    businessPartnerId: string;
    businessPartnerName: string;
    opportunityId?: string;
    opportunityTitle?: string;
    validUntil: string;
    status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Converted';
    totalValue: number;
    items: SalesQuoteItem[];
}

export interface CreateSalesQuoteItem {
    materialId: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
}

export interface CreateSalesQuote {
    businessPartnerId: string;
    opportunityId?: string;
    validUntil: string;
    items: CreateSalesQuoteItem[];
}
