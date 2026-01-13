import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { deliveryService, type DeliveryDto } from '../../../services/deliveryService';
import { Package, Truck, CheckCircle } from 'lucide-react';

export function DeliveryList() {
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedRows(newSet);
    };

    const handlePost = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
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

    const filteredDeliveries = deliveries.filter(d =>
        searchTerm === '' ||
        d.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-text-secondary">Carregando expedições...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <Truck size={20} className="text-brand-primary" />
                    <h1 className="text-xl font-bold text-text-primary">Entregas (VL01N)</h1>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b w-10"></th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b">Número</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b">Pedido</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b text-right">Data</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b text-center">Status</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase border-b text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {filteredDeliveries.map((delivery) => (
                            <React.Fragment key={delivery.id}>
                                <tr
                                    className="hover:bg-bg-main cursor-pointer"
                                    onClick={() => toggleRow(delivery.id)}
                                >
                                    <td className="p-3 text-text-secondary">
                                        {expandedRows.has(delivery.id) ? '▼' : '▶'}
                                    </td>
                                    <td className="p-3 font-mono text-sm font-bold text-brand-primary">{delivery.number}</td>
                                    <td className="p-3 text-sm text-text-secondary">Pedido: {delivery.salesOrderNumber}</td>
                                    <td className="p-3 text-sm text-right">{new Date(delivery.deliveryDate).toLocaleDateString()}</td>
                                    <td className="p-3 text-center">
                                        <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                            ${delivery.status === 'Draft' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                delivery.status === 'Posted' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                    'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                                            {delivery.status === 'Draft' ? 'Rascunho' :
                                                delivery.status === 'Posted' ? 'Enviado' : delivery.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end items-center space-x-2">
                                            {delivery.status === 'Draft' && (
                                                <button
                                                    onClick={(e) => handlePost(e, delivery.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-bold"
                                                    title="Postar Saída (Baixar Estoque)"
                                                >
                                                    <Package size={14} />
                                                    Postar
                                                </button>
                                            )}
                                            {delivery.status === 'Posted' && (
                                                <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                                    <CheckCircle size={14} />
                                                    Concluído
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.has(delivery.id) && (
                                    <tr className="bg-bg-main/50">
                                        <td colSpan={6} className="p-0">
                                            <div className="px-12 py-4">
                                                <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Itens da Entrega</h4>
                                                <div className="bg-white border border-border-default rounded overflow-hidden">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="bg-bg-header border-b">
                                                            <tr>
                                                                <th className="p-2 font-bold text-text-secondary">Material</th>
                                                                <th className="p-2 font-bold text-text-secondary text-right">Quantidade</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y">
                                                            {delivery.items?.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td className="p-2 text-text-primary">{item.materialName}</td>
                                                                    <td className="p-2 text-text-primary text-right font-mono font-bold">{item.quantity} UN</td>
                                                                </tr>
                                                            ))}
                                                            {(!delivery.items || delivery.items.length === 0) && (
                                                                <tr>
                                                                    <td colSpan={2} className="p-4 text-center text-text-muted italic">Nenhum item encontrado.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {filteredDeliveries.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">
                        Nenhuma entrega encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}
