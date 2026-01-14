import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Eye, Truck, RefreshCw, CheckCircle } from 'lucide-react';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';
import { salesOrderService } from '../../../services/salesOrderService';
import type { SalesOrder } from '../../../types/sales-orders';

export function SalesOrderList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [orders, setOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await salesOrderService.getAll();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load sales orders', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-gray-100 text-gray-800';
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const columns: Column<SalesOrder>[] = [
        { key: 'number', label: 'Número', sortable: true, width: '120px' },
        { key: 'businessPartnerName', label: 'Cliente', sortable: true },
        {
            key: 'orderDate',
            label: 'Data',
            width: '120px',
            render: (val) => new Date(val).toLocaleDateString()
        },
        {
            key: 'quoteNumber',
            label: 'Origem',
            width: '150px',
            render: (val) => val ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                    Quote: {val}
                </span>
            ) : '-'
        },
        {
            key: 'totalValue',
            label: 'Valor Total',
            width: '120px',
            align: 'right',
            render: (val) => `R$ ${val.toFixed(2)}`
        },
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
        {
            key: 'actions',
            label: 'Ações',
            width: '100px',
            align: 'right',
            render: (_, order) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/sales/orders/${order.id}`); }}
                        className="text-brand-primary hover:text-brand-secondary p-1 transition-colors"
                        title="Visualizar"
                    >
                        <Eye size={16} />
                    </button>
                    {order.status === 'Draft' && (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Confirmar este pedido?')) {
                                    try {
                                        await salesOrderService.updateStatus(order.id, 'Confirmed');
                                        loadOrders();
                                    } catch (err) {
                                        alert('Erro ao confirmar pedido');
                                        console.error(err);
                                    }
                                }
                            }}
                            className="text-green-600 hover:text-green-800 p-1 transition-colors"
                            title="Confirmar Pedido"
                        >
                            <CheckCircle size={16} />
                        </button>
                    )}
                    {order.status === 'Confirmed' && (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Gerar entrega para este pedido?')) {
                                    try {
                                        const service = await import('../../../services/deliveryService').then(m => m.deliveryService);
                                        await service.createFromOrder(order.id);
                                        alert('Entrega criada com sucesso!');
                                        navigate('/logistics/deliveries');
                                    } catch (err: any) {
                                        alert('Erro ao criar entrega: ' + (err.response?.data || err.message));
                                    }
                                }
                            }}
                            className="text-green-600 hover:text-green-800 p-1 transition-colors"
                            title="Gerar Entrega"
                        >
                            <Truck size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    if (loading) return <div>Carregando pedidos...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Pedidos de Venda</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">VA05</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadOrders} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/sales/orders/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO PEDIDO
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={orders}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(order) => navigate(`/sales/orders/${order.id}`)}
                />
            </div>
        </div>
    );
}
