export interface SalesOrderItem {
    id: string;
    materialId: string;
    materialName: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    totalValue: number;
}

export interface SalesOrder {
    id: string;
    number: string;
    businessPartnerId: string;
    businessPartnerName: string;
    quoteId?: string;
    quoteNumber?: string;
    orderDate: string;
    status: 'Draft' | 'Confirmed' | 'Processing' | 'Shipped' | 'Invoiced' | 'Cancelled';
    totalValue: number;
    items: SalesOrderItem[];
}

export interface CreateSalesOrderItem {
    materialId: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
}

export interface CreateSalesOrder {
    businessPartnerId: string;
    quoteId?: string;
    orderDate: string;
    items: CreateSalesOrderItem[];
}
