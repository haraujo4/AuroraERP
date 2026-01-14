import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import { BASE_URL } from '../../../services/api';

import type { Invoice } from '../../../types/finance';
import { format } from 'date-fns';

export function InvoiceList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await financeService.getInvoices();
            setInvoices(data);
        } catch (error) {
            console.error('Failed to load invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (id: string) => {
        if (!confirm('Deseja realmente postar esta fatura? Isso gerará lançamentos contábeis.')) return;
        setProcessingId(id);
        try {
            await financeService.postInvoice(id);
            await loadInvoices();
        } catch (error) {
            console.error(error);
            alert('Erro ao postar fatura');
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancel = async (id: string, reason?: string) => {
        if (!confirm('Deseja realmente cancelar esta fatura?')) return;
        setProcessingId(id);
        try {
            await financeService.cancelInvoice(id, reason);
            await loadInvoices();
        } catch (error) {
            console.error(error);
            alert('Erro ao cancelar fatura');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir este rascunho?')) return;
        setProcessingId(id);
        try {
            await financeService.deleteInvoice(id);
            await loadInvoices();
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir rascunho');
        } finally {
            setProcessingId(null);
        }
    };



    const filteredInvoices = invoices.filter(inv =>
        searchTerm === '' ||
        inv.businessPartnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Faturas (MIRO)</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/finance/invoices/billing')}
                        className="flex items-center gap-2 bg-white border border-border-default text-text-primary px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm"
                    >
                        <Plus size={16} className="text-blue-500" />
                        Faturar Pedido (SD)
                    </button>
                    <button
                        onClick={() => navigate('/finance/invoices/miro')}
                        className="flex items-center gap-2 bg-white border border-border-default text-text-primary px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm"
                    >
                        <CheckCircle size={16} className="text-status-success" />
                        Verificar Pedido (MIRO)
                    </button>
                    <button
                        onClick={() => navigate('/finance/invoices/new')}
                        className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary shadow-sm"
                    >
                        <Plus size={16} />
                        Nova Fatura
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-border-default overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-bg-secondary border-b border-border-default">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Emissão</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Vencimento</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Parceiro</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Valor Original</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{invoice.number}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {format(new Date(invoice.issueDate), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${invoice.type === 'Outbound' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {invoice.type === 'Outbound' ? 'Receber' : 'Pagar'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{invoice.businessPartnerName}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${invoice.status === 'Posted' ? 'bg-green-100 text-green-700' :
                                                    invoice.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                                                        invoice.status === 'Paid' ? 'bg-teal-100 text-teal-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                {invoice.status === 'Posted' ? 'Postado' :
                                                    invoice.status === 'Draft' ? 'Rascunho' :
                                                        invoice.status === 'Paid' ? 'Pago' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-mono">
                                            {invoice.grossAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            {invoice.status === 'Draft' && (
                                                <>
                                                    <button
                                                        onClick={() => handlePost(invoice.id)}
                                                        disabled={processingId === invoice.id}
                                                        className="text-green-600 hover:text-green-700 p-1 disabled:opacity-50"
                                                        title="Postar"
                                                    >
                                                        {processingId === invoice.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(invoice.id)}
                                                        disabled={processingId === invoice.id}
                                                        className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                                                        title="Excluir Rascunho"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {invoice.status === 'Posted' && (
                                                <>
                                                    <button
                                                        onClick={() => window.open(`${BASE_URL}/fiscal/documents/invoice/${invoice.id}/pdf`, '_blank')}
                                                        className="text-blue-600 hover:text-blue-700 p-1"
                                                        title="Visualizar PDF"
                                                    >
                                                        <FileText size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt("Motivo do cancelamento:");
                                                            if (reason) handleCancel(invoice.id, reason);
                                                        }}
                                                        disabled={processingId === invoice.id}
                                                        className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                                                        title="Cancelar Nota"
                                                    >
                                                        {processingId === invoice.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                                    </button>
                                                </>
                                            )}
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
