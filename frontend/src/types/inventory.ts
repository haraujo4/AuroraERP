export interface StockLevel {
    id: string;
    materialId: string;
    materialName: string;
    depositoId: string;
    depositoName: string;
    batchNumber?: string;
    quantity: number;
    lastUpdated: string;
}

export enum StockMovementType {
    In = 'In',
    Out = 'Out',
    Transfer = 'Transfer',
    Adjustment = 'Adjustment',
    InitialBalance = 'InitialBalance'
}

export interface CreateStockMovement {
    materialId: string;
    depositoId: string;
    type: StockMovementType;
    quantity: number;
    batchNumber?: string;
    referenceDocument: string;
}
