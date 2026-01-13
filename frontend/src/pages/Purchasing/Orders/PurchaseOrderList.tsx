import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, CheckCircle, Package, RefreshCw } from 'lucide-react';
import purchasingService from '../../../services/purchasingService';
import type { PurchaseOrder } from '../../../types/purchasing';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';
import { format } from 'date-fns';

const PurchaseOrderList: React.FC = () => {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await purchasingService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (window.confirm('Aprovar este pedido?')) {
            try {
                await purchasingService.approveOrder(id);
                loadOrders();
            } catch (error) {
                console.error('Error approving order', error);
            }
        }
    };

    const handleReceive = async (id: string) => {
        if (window.confirm('Receber este pedido? (Simula Entrada de Mercadoria)')) {
            try {
                await purchasingService.receiveOrder(id);
                loadOrders();
            } catch (error) {
                console.error('Error receiving order', error);
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-gray-100 text-gray-800';
            case 'Ordered': return 'bg-blue-100 text-blue-800';
            case 'Approved': return 'bg-indigo-100 text-indigo-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const columns: Column<PurchaseOrder>[] = [
        { key: 'orderNumber', label: 'Número', sortable: true, width: '120px' },
        {
            key: 'supplier',
            label: 'Fornecedor',
            sortable: true,
            render: (val) => val?.name || '-'
        },
        {
            key: 'deliveryDate',
            label: 'Data Entrega',
            width: '120px',
            render: (val) => format(new Date(val), 'dd/MM/yyyy')
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
            render: (_, po) => (
                <div className="flex justify-end gap-2">
                    {po.status === 'Draft' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleApprove(po.id); }}
                            className="text-green-600 hover:text-green-700 p-1 transition-colors"
                            title="Aprovar"
                        >
                            <CheckCircle size={14} />
                        </button>
                    )}
                    {(po.status === 'Approved' || po.status === 'Ordered') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleReceive(po.id); }}
                            className="text-blue-600 hover:text-blue-700 p-1 transition-colors"
                            title="Receber (MIGO)"
                        >
                            <Package size={14} />
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
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Pedidos de Compra</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">ME2L</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadOrders} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/purchasing/orders/new')}
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
                    onRowClick={(po) => navigate(`/purchasing/orders/${po.id}`)}
                />
            </div>
        </div>
    );
};

export default PurchaseOrderList;
