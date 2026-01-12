import React, { useEffect, useState } from 'react';
import type { SalesQuote } from '../../../types/sales-quotes';
import { salesQuoteService } from '../../../services/salesQuoteService';
import { Link } from 'react-router-dom';
import { Plus, Eye, FileText, ShoppingCart } from 'lucide-react';

export function SalesQuoteList() {
    const [quotes, setQuotes] = useState<SalesQuote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuotes();
    }, []);

    const loadQuotes = async () => {
        try {
            const data = await salesQuoteService.getAll();
            setQuotes(data);
        } catch (error) {
            console.error('Failed to load sales quotes', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Carregando cotações...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Cotações de Venda</h1>
                </div>

                <Link
                    to="/sales/quotes/new"
                    className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                >
                    <Plus size={16} className="mr-2" />
                    Nova Cotação
                </Link>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Número</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Cliente</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Validade</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Valor Total</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                <td className="p-3 font-mono">{quote.number}</td>
                                <td className="p-3">{quote.businessPartnerName}</td>
                                <td className="p-3">{new Date(quote.validUntil).toLocaleDateString()}</td>
                                <td className="p-3 font-bold">R$ {quote.totalValue.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${quote.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                            quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                                quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                    quote.status === 'Converted' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="p-3 text-right flex justify-end items-center space-x-2">
                                    <Link to={`/sales/quotes/${quote.id}`} className="text-brand-primary hover:text-brand-secondary" title="Visualizar">
                                        <Eye size={18} />
                                    </Link>
                                    {quote.status !== 'Converted' && (
                                        <button
                                            onClick={async () => {
                                                if (confirm('Gerar Pedido a partir desta Cotação?')) {
                                                    try {
                                                        const { salesOrderService } = await import('../../../services/salesOrderService');
                                                        await salesOrderService.createFromQuote(quote.id);
                                                        alert('Pedido gerado com sucesso!');
                                                        loadQuotes();
                                                        // Using require or simple reload might be better in real app but this works for now
                                                    } catch (e) {
                                                        alert('Erro ao gerar pedido');
                                                    }
                                                }
                                            }}
                                            className="text-green-600 hover:text-green-800"
                                            title="Gerar Pedido"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {quotes.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">
                        Nenhuma cotação encontrada. Clique em "Nova Cotação" para começar.
                    </div>
                )}
            </div>
            <div className="mt-2 text-xs text-text-secondary text-right">
                Registros: {quotes.length}
            </div>
        </div>
    );
}
