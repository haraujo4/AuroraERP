export interface Transaction {
    code: string;
    label: string;
    path: string;
}

export const TRANSACTION_REGISTRY: Transaction[] = [
    // Organization
    { code: 'ORG01', label: 'Grupos Empresariais', path: '/admin/groups' },
    { code: 'ORG02', label: 'Empresas', path: '/admin/companies' },
    { code: 'ORG03', label: 'Filiais', path: '/admin/branches' },
    { code: 'KS01', label: 'Centros de Custo', path: '/admin/cost-centers' },
    { code: 'KE51', label: 'Centros de Lucro', path: '/admin/profit-centers' },

    // CRM
    { code: 'BP01', label: 'Gestão de Business Partners', path: '/crm/bp' },
    { code: 'BP02', label: 'Novo Business Partner', path: '/crm/bp/new' },
    { code: 'CRM01', label: 'Leads', path: '/crm/leads' },
    { code: 'CRM02', label: 'Oportunidades', path: '/crm/opportunities' },

    // Sales
    { code: 'VA21', label: 'Criar Cotação', path: '/sales/quotes/new' },
    { code: 'VA22', label: 'Listar Cotações', path: '/sales/quotes' },
    { code: 'VA01', label: 'Criar Pedido de Venda', path: '/sales/orders/new' },
    { code: 'VA02', label: 'Listar Pedidos de Venda', path: '/sales/orders' },
    { code: 'VA41', label: 'Gestão de Contratos', path: '/sales/contracts' },

    // Logistics
    { code: 'MM01', label: 'Criar Material', path: '/logistics/materials/new' },
    { code: 'MM02', label: 'Listar Materiais', path: '/logistics/materials' },
    { code: 'MMBE', label: 'Visão Geral de Estoque', path: '/logistics/inventory' },
    { code: 'MB01', label: 'Entrada de Mercadorias', path: '/logistics/inventory/in' },
    { code: 'MB1A', label: 'Saída de Estoque', path: '/logistics/inventory/out' },
    { code: 'MB1B', label: 'Transferência de Estoque', path: '/logistics/inventory/transfer' },
    { code: 'WR01', label: 'Depósitos (Warehouses)', path: '/logistics/warehouses' },
    { code: 'SL01', label: 'Locais de Estoque', path: '/logistics/storage-locations' },
    { code: 'VL01N', label: 'Criar Entrega (Expedição)', path: '/logistics/deliveries' },

    // Finance
    { code: 'FI01', label: 'Plano de Contas', path: '/finance/accounts' },
    { code: 'FB50', label: 'Lançamento Contábil', path: '/finance/journal-entries' },
    { code: 'MIRO', label: 'Revisão de Faturas', path: '/finance/invoices' },
    { code: 'F110', label: 'Pagamentos', path: '/finance/payments' },
    { code: 'F-32', label: 'Compensação de Clientes', path: '/finance/clearing' },
    { code: 'F-44', label: 'Compensação de Fornecedores', path: '/finance/clearing' },
    { code: 'FB08', label: 'Estorno de Documento', path: '/finance/reversal' },
    { code: 'KE30', label: 'Relatórios Analíticos (DRE)', path: '/finance/reports' },

    // Production
    { code: 'CR01', label: 'Centros de Trabalho', path: '/production/work-centers' },
    { code: 'CS01', label: 'Listas de Materiais (BOM)', path: '/production/boms' },
    { code: 'CO01', label: 'Criar Ordem de Produção', path: '/production/orders/new' },
    { code: 'CO02', label: 'Listar Ordens de Produção', path: '/production/orders' },

    // Purchasing
    { code: 'ME51N', label: 'Criar Requisição de Compra', path: '/purchasing/requisitions/new' },
    { code: 'ME52N', label: 'Listar Requisições', path: '/purchasing/requisitions' },
    { code: 'ME21N', label: 'Criar Pedido de Compra', path: '/purchasing/orders/new' },
    { code: 'ME22N', label: 'Listar Pedidos de Compra', path: '/purchasing/orders' },

    // Planning
    { code: 'MD01', label: 'Execução do MRP', path: '/planning/mrp' },
];

export const findTransaction = (query: string): Transaction | undefined => {
    const q = query.toUpperCase().trim();
    return TRANSACTION_REGISTRY.find(t => t.code === q || t.label.toUpperCase().includes(q));
};
