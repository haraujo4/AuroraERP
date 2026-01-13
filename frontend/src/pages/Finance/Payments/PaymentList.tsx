import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import type { Payment } from '../../../types/finance';
import { format } from 'date-fns';

export function PaymentList() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const data = await financeService.getPayments();
            setPayments(data);
        } catch (error) {
            console.error('Failed to load payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (id: string) => {
        if (!confirm('Deseja realmente postar este pagamento? Isso gerará lançamentos bancários e contábeis.')) return;
        try {
            await financeService.postPayment(id);
            loadPayments();
        } catch (error) {
            alert('Erro ao postar pagamento');
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Deseja realmente cancelar este pagamento?')) return;
        try {
            await financeService.cancelPayment(id);
            loadPayments();
        } catch (error) {
            alert('Erro ao cancelar pagamento');
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Pagamentos e Recebimentos</h1>
                <button
                    onClick={() => navigate('/finance/payments/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Novo Pagamento
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
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Data</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Parceiro</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Método</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Referência</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Valor</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 text-sm">
                                            {format(new Date(p.paymentDate), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">{p.businessPartnerName}</td>
                                        <td className="px-4 py-3 text-sm">{p.method}</td>
                                        <td className="px-4 py-3 text-sm">{p.reference}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${p.status === 'Posted' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {p.status === 'Posted' ? 'Postado' :
                                                    p.status === 'Draft' ? 'Rascunho' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-mono">
                                            {p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            {p.status === 'Draft' && (
                                                <>
                                                    <button
                                                        onClick={() => handlePost(p.id)}
                                                        className="text-green-600 hover:text-green-700 p-1"
                                                        title="Postar"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(p.id)}
                                                        className="text-red-600 hover:text-red-700 p-1"
                                                        title="Cancelar"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-text-secondary">Nenhum pagamento registrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
