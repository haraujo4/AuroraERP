import { useEffect, useState } from 'react';
import type { SalesOrder } from '../../../types/sales-orders';
import { salesOrderService } from '../../../services/salesOrderService';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Eye, Truck } from 'lucide-react';

export function SalesOrderList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [orders, setOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await salesOrderService.getAll();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load sales orders', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        searchTerm === '' ||
        order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.businessPartnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Carregando pedidos...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Listar Pedidos de Venda (VA02)</h1>
                </div>
                <Link
                    to="/sales/orders/new"
                    className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                >
                    <Plus size={16} className="mr-2" />
                    Novo Pedido
                </Link>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Número</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Cliente</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Data</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Origem</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Valor Total</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                <td className="p-3 font-mono">{order.number}</td>
                                <td className="p-3">{order.businessPartnerName}</td>
                                <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="p-3">
                                    {order.quoteNumber ? (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            Quote: {order.quoteNumber}
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="p-3 font-bold">R$ {order.totalValue.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${order.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                            order.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 text-right flex items-center justify-end space-x-2">
                                    <Link to={`/sales/orders/${order.id}`} className="text-brand-primary hover:text-brand-secondary" title="Visualizar">
                                        <Eye size={18} />
                                    </Link>
                                    {order.status === 'Confirmed' && (
                                        <button
                                            onClick={async (e) => {
                                                e.preventDefault();
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
                                            className="text-green-600 hover:text-green-800"
                                            title="Gerar Entrega"
                                        >
                                            <Truck size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">
                        Nenhum pedido encontrado.
                    </div>
                )}
            </div>
            <div className="mt-2 text-xs text-text-secondary text-right">
                Registros: {orders.length}
            </div>
        </div>
    );
}
