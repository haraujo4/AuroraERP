export interface Material {
    id: string;
    code: string;
    description: string;
    type: string;
    group: string;
    unitOfMeasure: string;

    // Logistics
    netWeight?: number;
    grossWeight?: number;
    weightUnit?: string;
    width?: number;
    height?: number;
    length?: number;
    dimensionUnit?: string;
    minStock: number;
    maxStock: number;

    // Sales
    basePrice: number;
    salesUnit?: string;
    taxClassification?: string;

    // Purchasing
    standardCost?: number;
    purchasingUnit?: string;

    // Control
    isBatchManaged: boolean;
    isSerialManaged: boolean;
}

export interface CreateMaterial {
    code: string;
    description: string;
    type: string;
    group: string;
    unitOfMeasure: string;

    // Logistics
    netWeight?: number;
    grossWeight?: number;
    weightUnit?: string;
    width?: number;
    height?: number;
    length?: number;
    dimensionUnit?: string;
    minStock: number;
    maxStock: number;

    // Sales
    basePrice: number;
    salesUnit?: string;
    taxClassification?: string;

    // Purchasing
    standardCost?: number;
    purchasingUnit?: string;

    // Control
    isBatchManaged: boolean;
    isSerialManaged: boolean;
}
