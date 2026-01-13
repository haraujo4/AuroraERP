export interface PurchaseRequisition {
    id: string;
    requisitionNumber: string;
    requestDate: string;
    requiredDate: string;
    requester: string;
    status: PurchasingStatus;
    notes?: string;
    items: PurchaseRequisitionItem[];
}

export interface PurchaseRequisitionItem {
    id: string;
    requisitionId: string;
    materialId: string;
    material?: {
        name: string;
        description: string;
    };
    quantity: number;
    costCenterId?: string;
    costCenter?: {
        name: string;
    };
}

export interface PurchaseOrder {
    id: string;
    orderNumber: string;
    orderDate: string;
    deliveryDate: string;
    supplierId: string;
    supplier?: {
        name: string;
    };
    status: PurchasingStatus;
    type: PurchaseType;
    totalAmount: number;
    items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
    id: string;
    orderId: string;
    materialId: string;
    material?: {
        name: string;
        description: string;
    };
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    receivedQuantity: number;
}

export enum PurchasingStatus {
    Draft = 'Draft',
    PendingApproval = 'PendingApproval',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Ordered = 'Ordered',
    Partial = 'Partial',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export enum PurchaseType {
    Standard = 'Standard',
    Service = 'Service',
    Consignment = 'Consignment',
    Subcontracting = 'Subcontracting'
}
