import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Search } from 'lucide-react';
import { salesOrderService } from '../../../services/salesOrderService';
import { financeService } from '../../../services/financeService';
import type { SalesOrder } from '../../../types/sales-orders';
import { format } from 'date-fns';

export function BillingForm() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await salesOrderService.getAll();
            // Filter only Shipped orders that are ready for billing
            const shippableOrders = data.filter(o => o.status === 'Shipped');
            setOrders(shippableOrders);
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInvoice = async (order: SalesOrder) => {
        if (!confirm(`Gerar Fatura para o Pedido ${order.number}?`)) return;

        setProcessingId(order.id);
        try {
            const today = new Date().toISOString();
            // Cast to any to handle potential PascalCase response
            const response = await financeService.createFromSalesOrder({
                salesOrderId: order.id,
                issueDate: today,
                dueDate: today
            }) as any;

            const invoiceId = response.id || response.Id;

            if (!invoiceId) {
                console.error('Invoice ID missing in response:', response);
                alert('Erro: ID da fatura não retornado pelo servidor.');
                return;
            }

            alert(`Fatura gerada com sucesso!`);
            navigate(`/finance/invoices`);
        } catch (error: any) {
            console.error('Failed to generate invoice', error);
            alert('Erro ao gerar fatura: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessingId(null);
        }
    };

    const filteredOrders = orders.filter(o =>
        o.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.businessPartnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/finance/invoices')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        Faturamento de Pedidos de Venda (SD)
                    </h1>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm border border-border-default mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por Número do Pedido ou Cliente..."
                        className="w-full pl-10 p-2 border border-border-input rounded focus:border-brand-primary outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 bg-white rounded shadow-sm border border-border-default overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-bg-header">
                            <tr>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Pedido</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Data</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Cliente</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Valor Total</th>
                                <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default">
                            {loading ? (
                                <tr><td colSpan={5} className="p-4 text-center">Carregando...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={5} className="p-4 text-center text-text-secondary">Nenhum pedido pendente de faturamento encontrado.</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-bg-main">
                                        <td className="p-3 text-sm font-medium text-text-primary">{order.number}</td>
                                        <td className="p-3 text-sm text-text-primary">
                                            {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy') : '-'}
                                        </td>
                                        <td className="p-3 text-sm text-text-primary">{order.businessPartnerName}</td>
                                        <td className="p-3 text-sm text-text-primary text-right font-mono">
                                            {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() => handleGenerateInvoice(order)}
                                                disabled={processingId === order.id}
                                                className={`flex items-center justify-end gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ml-auto
                                                    ${processingId === order.id
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}
                                            >
                                                {processingId === order.id ? (
                                                    'Gerando...'
                                                ) : (
                                                    <>
                                                        <FileText size={16} /> Gerar Fatura
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
