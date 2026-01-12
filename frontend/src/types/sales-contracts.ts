import { BusinessPartner } from "../crm";

export interface SalesContract {
    id: string;
    contractNumber: string;
    businessPartnerId: string;
    businessPartnerName: string;
    startDate: string;
    endDate: string;
    billingDay: number;
    billingFrequency: 'Monthly' | 'Quarterly' | 'Annually';
    status: 'Draft' | 'Active' | 'Suspended' | 'Cancelled' | 'Expired';
    totalMonthlyValue: number;
    items?: SalesContractItem[];
}

export interface SalesContractItem {
    id: string;
    materialId: string;
    materialName: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    totalValue: number;
}

export interface CreateSalesContractDto {
    businessPartnerId: string;
    startDate: string;
    endDate: string;
    billingDay: number;
    billingFrequency: string;
    items: CreateSalesContractItemDto[];
}

export interface CreateSalesContractItemDto {
    materialId: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
}
