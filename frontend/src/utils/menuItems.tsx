import {
    LayoutGrid, DollarSign, Package, ShoppingCart, Users, Truck,
    Factory, Percent, Star
} from 'lucide-react';

export interface SubItem {
    id: string;
    label: string;
    path: string;
}

export interface MenuItem {
    id: string;
    label: string;
    icon: any;
    subItems?: SubItem[];
}

export const MENU_ITEMS: MenuItem[] = [
    {
        id: 'favorites',
        label: 'Favoritos',
        icon: Star
    },
    {
        id: 'organization',
        label: 'Base Organizacional',
        icon: LayoutGrid,
        subItems: [
            { id: 'groups', label: 'Grupos Empresariais (ORG01)', path: '/admin/groups' },
            { id: 'companies', label: 'Empresas (ORG02)', path: '/admin/companies' },
            { id: 'branches', label: 'Filiais (ORG03)', path: '/admin/branches' },
        ]
    },
    {
        id: 'crm',
        label: 'CRM',
        icon: Users,
        subItems: [
            { id: 'bp', label: 'Business Partners (BP01)', path: '/crm/bp' },
            { id: 'leads', label: 'Leads (CRM01)', path: '/crm/leads' },
            { id: 'opportunities', label: 'Oportunidades (CRM02)', path: '/crm/opportunities' },
        ]
    },
    {
        id: 'sales',
        label: 'Vendas',
        icon: ShoppingCart,
        subItems: [
            { id: 'quotes', label: 'Cotações (VA21)', path: '/sales/quotes' },
            { id: 'orders', label: 'Pedidos de Venda (VA01)', path: '/sales/orders' },
            { id: 'contracts', label: 'Contratos (VA41)', path: '/sales/contracts' },
        ]
    },
    {
        id: 'logistics',
        label: 'Logística',
        icon: Package,
        subItems: [
            { id: 'materials', label: 'Gestão de Materiais (MM01)', path: '/logistics/materials' },
            { id: 'inventory', label: 'Gestão de Estoques (MMBE)', path: '/logistics/inventory' },
            { id: 'inventory-in', label: 'Entrada (MB01)', path: '/logistics/inventory/in' },
            { id: 'inventory-out', label: 'Saída de Estoque (MB1A)', path: '/logistics/inventory/out' },
            { id: 'inventory-transfer', label: 'Transferência (MB1B)', path: '/logistics/inventory/transfer' },
        ]
    },
    {
        id: 'finance',
        label: 'Financeiro (FI)',
        icon: DollarSign,
        subItems: [
            { id: 'accounts', label: 'Plano de Contas (FI01)', path: '/finance/accounts' },
            { id: 'journal-entries', label: 'Lançamentos (FB50)', path: '/finance/journal-entries' },
            { id: 'invoices', label: 'Faturas (MIRO)', path: '/finance/invoices' },
            { id: 'payments', label: 'Pagamentos (F110)', path: '/finance/payments' },
            { id: 'reports', label: 'Relatórios Analíticos (KE30)', path: '/finance/reports' },
        ]
    },
    {
        id: 'production',
        label: 'Produção (PP)',
        icon: Factory,
        subItems: [
            { id: 'work-centers', label: 'Centros de Trabalho (CR01)', path: '/production/work-centers' },
            { id: 'boms', label: 'Listas de Materiais (CS01)', path: '/production/boms' },
            { id: 'orders', label: 'Ordens de Produção (CO01)', path: '/production/orders' },
        ]
    },
    {
        id: 'purchasing',
        label: 'Compras (MM)',
        icon: ShoppingCart,
        subItems: [
            { id: 'requisitions', label: 'Requisições de Compra (ME51N)', path: '/purchasing/requisitions' },
            { id: 'orders', label: 'Pedidos de Compra (ME21N)', path: '/purchasing/orders' },
        ]
    },
    {
        id: 'fiscal',
        label: 'Fiscal',
        icon: Percent,
        subItems: [
            { id: 'tax-rules', label: 'Regras Fiscais (FIS01)', path: '/fiscal/tax-rules' }
        ]
    },
    {
        id: 'planning',
        label: 'Planejamento (PP/DS)',
        icon: Factory,
        subItems: [
            { id: 'mrp', label: 'Execução MRP (MD01)', path: '/planning/mrp' },
        ]
    },
    {
        id: 'hr',
        label: 'Recursos Humanos',
        icon: Users,
        subItems: [
            { id: 'employees', label: 'Colaboradores (PA30)', path: '/hr/employees' },
        ]
    },
    { id: 'expedition', label: 'Expedição', icon: Truck, subItems: [{ id: 'deliveries', label: 'Entregas (VL01N)', path: '/logistics/deliveries' }] },
];
