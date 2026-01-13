export interface TaxRule {
    id: string;
    sourceState: string;
    destState: string;
    ncmCode?: string;
    operationType: OperationType;
    cfop: number;
    cstIcms: CstIcms;
    icmsRate: number;
    ipiRate: number;
    pisRate: number;
    cofinsRate: number;
}

export interface CreateTaxRuleDto {
    sourceState: string;
    destState: string;
    ncmCode?: string;
    operationType: OperationType;
    cfop: number;
    cstIcms: CstIcms;
    icmsRate: number;
    ipiRate: number;
    pisRate: number;
    cofinsRate: number;
}

export type OperationType = 'Sales' | 'Purchase' | 'Transfer' | 'Return';

export const OperationTypes: Record<string, OperationType> = {
    Sales: 'Sales',
    Purchase: 'Purchase',
    Transfer: 'Transfer',
    Return: 'Return'
};

export type CstIcms = 'Cst00' | 'Cst10' | 'Cst20' | 'Cst30' | 'Cst40' | 'Cst41' | 'Cst50' | 'Cst51' | 'Cst60' | 'Cst70' | 'Cst90';

export const CstIcmsValues: Record<string, CstIcms> = {
    Cst00: 'Cst00',
    Cst10: 'Cst10',
    Cst20: 'Cst20',
    Cst30: 'Cst30',
    Cst40: 'Cst40',
    Cst41: 'Cst41',
    Cst50: 'Cst50',
    Cst51: 'Cst51',
    Cst60: 'Cst60',
    Cst70: 'Cst70',
    Cst90: 'Cst90'
};

export const STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
