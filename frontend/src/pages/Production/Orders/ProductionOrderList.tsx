import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Play, CheckCircle } from 'lucide-react';
import { productionService } from '../../../services/productionService';
import type { ProductionOrder } from '../../../types/production';

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

    const filteredOrders = orders.filter(order =>
        searchTerm === '' ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.workCenterName && order.workCenterName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Ordens de Produção (CO02)</h1>
                <button
                    onClick={() => navigate('/production/orders/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Nova Ordem
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
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase w-32">Número</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Produto</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase w-24">Qtd Plan</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase w-32 pl-8">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Centro de Trabalho</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase w-24">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 text-sm font-mono font-medium">{order.orderNumber}</td>
                                        <td className="px-4 py-3 text-sm">{order.productName}</td>
                                        <td className="px-4 py-3 text-sm text-right">{order.quantity}</td>
                                        <td className="px-4 py-3 text-sm pl-8">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{order.workCenterName || '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {order.status === 'Created' && (
                                                    <button
                                                        onClick={() => handleRelease(order.id)}
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                        title="Liberar"
                                                    >
                                                        <Play size={16} />
                                                    </button>
                                                )}
                                                {(order.status === 'Released' || order.status === 'InProgress') && (
                                                    <button
                                                        onClick={() => handleConfirm(order.id)}
                                                        className="text-green-600 hover:text-green-800 p-1"
                                                        title="Confirmar Produção"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
