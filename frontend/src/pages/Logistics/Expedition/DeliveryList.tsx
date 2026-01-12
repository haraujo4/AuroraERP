import React, { useEffect, useState } from 'react';
import { deliveryService, type DeliveryDto } from '../../../services/deliveryService';
import { Package, Truck, CheckCircle } from 'lucide-react';

export function DeliveryList() {
    const [deliveries, setDeliveries] = useState<DeliveryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeliveries();
    }, []);

    const loadDeliveries = async () => {
        try {
            const data = await deliveryService.getAll();
            setDeliveries(data);
        } catch (error) {
            console.error('Failed to load deliveries', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (id: string) => {
        if (!confirm('Confirmar expedição e baixar estoque?')) return;
        try {
            await deliveryService.postDelivery(id);
            alert('Entrega postada com sucesso!');
            loadDeliveries();
        } catch (error: any) {
            const msg = error.response?.data || error.message;
            alert('Erro ao postar: ' + msg);
        }
    };

    if (loading) return <div className="p-8 text-center text-text-secondary">Carregando expedições...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <Truck size={20} className="text-brand-primary" />
                    <h1 className="text-xl font-bold text-text-primary">Expedição de Vendas</h1>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b">Número</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b">Pedido</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b">Data</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b">Status</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {deliveries.map((delivery) => (
                            <tr key={delivery.id} className="hover:bg-bg-main">
                                <td className="p-3 font-mono text-sm">{delivery.number}</td>
                                <td className="p-3 text-sm">{delivery.salesOrderNumber}</td>
                                <td className="p-3 text-sm">{new Date(delivery.deliveryDate).toLocaleDateString()}</td>
                                <td className="p-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${delivery.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                            delivery.status === 'Posted' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {delivery.status}
                                    </span>
                                </td>
                                <td className="p-3 text-right">
                                    {delivery.status === 'Draft' && (
                                        <button
                                            onClick={() => handlePost(delivery.id)}
                                            className="ml-2 text-green-600 hover:text-green-800 flex items-center justify-end gap-1 float-right"
                                            title="Postar Saída (Baixar Estoque)"
                                        >
                                            <Package size={16} />
                                            <span className="text-xs font-bold">Postar</span>
                                        </button>
                                    )}
                                    {delivery.status === 'Posted' && (
                                        <span className="text-green-600 flex items-center justify-end gap-1">
                                            <CheckCircle size={16} />
                                            <span className="text-xs">Concluído</span>
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {deliveries.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">
                        Nenhuma entrega encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}
