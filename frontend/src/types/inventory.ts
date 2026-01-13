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

export type StockMovementType = 'In' | 'Out' | 'Transfer' | 'Adjustment' | 'InitialBalance';

export const StockMovementTypes = {
    In: 'In' as StockMovementType,
    Out: 'Out' as StockMovementType,
    Transfer: 'Transfer' as StockMovementType,
    Adjustment: 'Adjustment' as StockMovementType,
    InitialBalance: 'InitialBalance' as StockMovementType
};

export interface CreateStockMovement {
    materialId: string;
    depositoId: string;
    type: StockMovementType;
    quantity: number;
    batchNumber?: string;
    referenceDocument: string;
}
export interface TransferStock {
    materialId: string;
    sourceDepositoId: string;
    destinationDepositoId: string;
    quantity: number;
    batchNumber?: string;
    referenceDocument: string;
}
