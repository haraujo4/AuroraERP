import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, Package } from 'lucide-react';
import purchasingService from '../../../services/purchasingService';
import type { PurchaseOrder } from '../../../types/purchasing';
import { format } from 'date-fns';

const PurchaseOrderList: React.FC = () => {
    const navigate = useNavigate();
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

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Pedidos de Compra</h1>
                <button
                    onClick={() => navigate('/purchasing/orders/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Novo Pedido
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-border-default overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-bg-secondary border-b border-border-default">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Número</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Fornecedor</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Data Entrega</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((po) => (
                                    <tr key={po.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 text-sm font-mono">{po.orderNumber}</td>
                                        <td className="px-4 py-3 text-sm">{po.supplier?.name}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {format(new Date(po.deliveryDate), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(po.status)}`}>
                                                {po.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            {(po.status === 'Draft') && (
                                                <button
                                                    onClick={() => handleApprove(po.id)}
                                                    className="text-green-600 hover:text-green-700 p-1"
                                                    title="Aprovar"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            {(po.status === 'Approved' || po.status === 'Ordered') && (
                                                <button
                                                    onClick={() => handleReceive(po.id)}
                                                    className="text-blue-600 hover:text-blue-700 p-1"
                                                    title="Receber (MIGO)"
                                                >
                                                    <Package size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            Nenhum pedido encontrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseOrderList;
