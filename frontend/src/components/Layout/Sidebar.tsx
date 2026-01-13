import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ChevronRight, ChevronDown, LayoutGrid, DollarSign, Package, ShoppingCart, Users, Truck,
    Factory,
    Percent
} from 'lucide-react';
import { cn } from '../../utils';

interface SubItem {
    id: string;
    label: string;
    path: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: any;
    subItems?: SubItem[];
}

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'favorites',
        label: 'Favoritos',
        icon: LayoutGrid
    },
    {
        id: 'organization',
        label: 'Base Organizacional',
        icon: LayoutGrid,
        subItems: [
            { id: 'groups', label: 'Grupos Empresariais', path: '/admin/groups' },
            { id: 'companies', label: 'Empresas', path: '/admin/companies' },
            { id: 'branches', label: 'Filiais', path: '/admin/branches' },
        ]
    },
    {
        id: 'crm',
        label: 'CRM',
        icon: Users,
        subItems: [
            { id: 'bp', label: 'Business Partners', path: '/crm/bp' },
            { id: 'leads', label: 'Leads', path: '/crm/leads' },
            { id: 'opportunities', label: 'Oportunidades', path: '/crm/opportunities' },
        ]
    },
    {
        id: 'sales',
        label: 'Vendas',
        icon: ShoppingCart,
        subItems: [
            { id: 'quotes', label: 'Cotações', path: '/sales/quotes' },
            { id: 'orders', label: 'Pedidos de Venda', path: '/sales/orders' },
            { id: 'contracts', label: 'Contratos', path: '/sales/contracts' },
        ]
    },
    {
        id: 'logistics',
        label: 'Logística',
        icon: Package,
        subItems: [
            { id: 'materials', label: 'Gestão de Materiais', path: '/logistics/materials' },
            { id: 'inventory', label: 'Gestão de Estoques', path: '/logistics/inventory' },
            { id: 'inventory-in', label: 'Entrada (MIGO)', path: '/logistics/inventory/in' },
            { id: 'inventory-out', label: 'Saída de Estoque', path: '/logistics/inventory/out' },
            { id: 'inventory-transfer', label: 'Transferência', path: '/logistics/inventory/transfer' },
        ]
    },
    {
        id: 'finance',
        label: 'Financeiro (FI)',
        icon: DollarSign,
        subItems: [
            { id: 'accounts', label: 'Plano de Contas', path: '/finance/accounts' },
            { id: 'journal-entries', label: 'Lançamentos', path: '/finance/journal-entries' },
            { id: 'invoices', label: 'Faturas (AR/AP)', path: '/finance/invoices' },
            { id: 'payments', label: 'Pagamentos', path: '/finance/payments' },
            { id: 'reports', label: 'Relatórios Analíticos (DRE)', path: '/finance/reports' },
        ]
    },
    {
        id: 'production',
        label: 'Produção (PP)',
        icon: Factory,
        subItems: [
            { id: 'work-centers', label: 'Centros de Trabalho', path: '/production/work-centers' },
            { id: 'boms', label: 'Listas de Materiais', path: '/production/boms' },
            { id: 'orders', label: 'Ordens de Produção', path: '/production/orders' },
        ]
    },
    {
        id: 'purchasing',
        label: 'Compras (MM)',
        icon: ShoppingCart,
        subItems: [
            { id: 'requisitions', label: 'Requisições de Compra', path: '/purchasing/requisitions' },
            { id: 'orders', label: 'Pedidos de Compra', path: '/purchasing/orders' },
        ]
    },
    {
        id: 'fiscal',
        label: 'Fiscal',
        icon: Percent,
        subItems: [
            { id: 'tax-rules', label: 'Regras Fiscais', path: '/fiscal/tax-rules' }
        ]
    },
    { id: 'expedition', label: 'Expedição', icon: Truck, subItems: [{ id: 'deliveries', label: 'Entregas', path: '/logistics/deliveries' }] },
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const location = useLocation();
    const [openModules, setOpenModules] = useState<string[]>(['organization', 'production']);
    const toggleModule = (id: string) => {
        setOpenModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    return (
        <aside className={cn(
            "bg-bg-sidebar border-r border-border-default flex flex-col transition-all duration-300",
            isOpen ? "w-64" : "w-0 overflow-hidden"
        )}>
            {/* Menu Header */}
            <div className="h-12 flex items-center px-4 font-bold text-xs text-text-muted uppercase tracking-wider border-b border-border-default/50">
                Navegação
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
                {MENU_ITEMS.map((item) => {
                    const isActive = openModules.includes(item.id);
                    const hasChildren = item.subItems && item.subItems.length > 0;
                    const Icon = item.icon;

                    return (
                        <div key={item.id}>
                            <div
                                onClick={() => hasChildren && toggleModule(item.id)}
                                className={cn(
                                    "flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors border-l-2 border-transparent select-none",
                                    isActive && !hasChildren ? "bg-white border-brand-primary text-brand-primary font-medium" : "text-text-secondary hover:bg-white/50 hover:text-text-primary",
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} />
                                    <span>{item.label}</span>
                                </div>
                                {hasChildren && (
                                    isActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                )}
                            </div>

                            {/* Submenu */}
                            {hasChildren && isActive && (
                                <div className="bg-bg-subtle/30">
                                    {item.subItems?.map(sub => (
                                        <Link
                                            key={sub.id}
                                            to={sub.path}
                                            className={cn(
                                                "block py-2 pl-11 pr-4 text-xs hover:text-brand-primary transition-colors",
                                                location.pathname === sub.path ? "text-brand-primary font-bold bg-white/50" : "text-text-secondary"
                                            )}
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer with Version Only */}
            <div className="p-4 border-t border-border-default">
                <div className="text-[10px] text-text-muted text-center">
                    Aurora ERP v1.0.0
                </div>
            </div>
        </aside>
    );
}
