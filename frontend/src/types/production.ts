export interface WorkCenter {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    costCenterId?: string;
}

export interface CreateWorkCenter {
    name: string;
    code: string;
    costCenterId?: string;
}

export interface BillOfMaterialItem {
    id: string;
    componentId: string;
    componentName: string;
    quantity: number;
}

export interface BillOfMaterial {
    id: string;
    productId: string;
    productName: string;
    description: string;
    baseQuantity: number;
    items: BillOfMaterialItem[];
}

export interface CreateBillOfMaterialItem {
    componentId: string;
    quantity: number;
}

export interface CreateBillOfMaterial {
    productId: string;
    description: string;
    baseQuantity: number;
    items: CreateBillOfMaterialItem[];
}

export type ProductionOrderStatus = 'Created' | 'Released' | 'InProgress' | 'Completed' | 'Closed' | 'Cancelled';

export interface ProductionOrder {
    id: string;
    orderNumber: string;
    productId: string;
    productName: string;
    quantity: number;
    status: ProductionOrderStatus;
    startDate: string;
    endDate: string;
    workCenterId?: string;
    workCenterName?: string;
}

export interface CreateProductionOrder {
    productId: string;
    quantity: number;
    startDate: string;
    endDate: string;
    workCenterId?: string;
}
