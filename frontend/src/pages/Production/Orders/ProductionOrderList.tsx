import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Play, CheckCircle, RefreshCw } from 'lucide-react';
import { productionService } from '../../../services/productionService';
import type { ProductionOrder } from '../../../types/production';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';

export function ProductionOrderList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await productionService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async (id: string) => {
        if (!confirm('Deseja liberar esta ordem para produção?')) return;
        try {
            await productionService.releaseOrder(id);
            await loadData();
        } catch (error) {
            alert('Erro ao liberar ordem');
        }
    };

    const handleConfirm = async (id: string) => {
        if (!confirm('Confirmar produção? Isso irá consumir os materiais e dar entrada no produto final.')) return;
        try {
            await productionService.confirmOrder(id);
            await loadData();
        } catch (error) {
            alert('Erro ao confirmar produção: ' + (error as any).response?.data?.message || 'Erro desconhecido');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Created': return 'bg-gray-100 text-gray-700';
            case 'Released': return 'bg-blue-100 text-blue-700';
            case 'InProgress': return 'bg-yellow-100 text-yellow-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-gray-200 text-gray-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    const columns: Column<ProductionOrder>[] = [
        { key: 'orderNumber', label: 'Número', sortable: true, width: '120px' },
        { key: 'productName', label: 'Produto', sortable: true },
        { key: 'quantity', label: 'Qtd Plan', width: '100px', align: 'right' },
        {
            key: 'status',
            label: 'Status',
            width: '120px',
            render: (val) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(val)}`}>
                    {val.toUpperCase()}
                </span>
            )
        },
        { key: 'workCenterName', label: 'Centro de Trabalho', width: '200px' },
        {
            key: 'actions',
            label: 'Ações',
            width: '100px',
            align: 'right',
            render: (_, order) => (
                <div className="flex justify-end gap-2">
                    {order.status === 'Created' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleRelease(order.id); }}
                            className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                            title="Liberar"
                        >
                            <Play size={16} />
                        </button>
                    )}
                    {(order.status === 'Released' || order.status === 'InProgress') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleConfirm(order.id); }}
                            className="text-green-600 hover:text-green-800 p-1 transition-colors"
                            title="Confirmar Produção"
                        >
                            <CheckCircle size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Ordens de Produção</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">COOIS</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadData} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/production/orders/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVA ORDEM
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={orders}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(order) => navigate(`/production/orders/${order.id}`)}
                />
            </div>
        </div>
    );
}
