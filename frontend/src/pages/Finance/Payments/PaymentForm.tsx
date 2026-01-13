import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Wallet } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import type { Account, Invoice, CreatePayment, PaymentMethod } from '../../../types/finance';
import type { BusinessPartner } from '../../../types/crm';

const PaymentForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const invoiceIdParam = searchParams.get('invoiceId');

    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const [formData, setFormData] = useState<CreatePayment>({
        businessPartnerId: '',
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'BankTransfer',
        accountId: '',
        reference: '',
        invoiceId: invoiceIdParam || undefined
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [bpData, accData, invData] = await Promise.all([
                BusinessPartnerService.getAll(),
                financeService.getAccounts(),
                financeService.getInvoices()
            ]);
            setPartners(bpData);
            setAccounts(accData);
            setInvoices(invData.filter((i: Invoice) => i.status === 'Posted'));

            if (invoiceIdParam) {
                const inv = invData.find((i: Invoice) => i.id === invoiceIdParam);
                if (inv) {
                    setFormData(prev => ({
                        ...prev,
                        businessPartnerId: inv.businessPartnerId,
                        amount: inv.grossAmount,
                        reference: `Pagto NF ${inv.id.substring(0, 8)}`
                    }));
                }
            }
        } catch (error) {
            console.error('Error loading initial data', error);
        }
    };

    const handleInvoiceChange = (id: string) => {
        const inv = invoices.find(i => i.id === id);
        if (inv) {
            setFormData(prev => ({
                ...prev,
                invoiceId: id,
                businessPartnerId: inv.businessPartnerId,
                amount: inv.grossAmount,
                reference: `Pagto NF ${inv.id.substring(0, 8)}`
            }));
        } else {
            setFormData(prev => ({ ...prev, invoiceId: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.businessPartnerId || !formData.accountId || formData.amount <= 0) {
            alert('Por favor, preencha os campos obrigatórios corretamente.');
            return;
        }

        setLoading(true);
        try {
            await financeService.createPayment(formData);
            navigate('/finance/payments');
        } catch (error) {
            console.error('Error creating payment', error);
            alert('Falha ao registrar pagamento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/finance/payments')}
                        className="text-text-secondary hover:text-text-primary"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Novo Pagamento/Recebimento</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50"
                >
                    <Save size={16} />
                    {loading ? 'Salvando...' : 'Salvar Pagamento'}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-border-default shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-brand-primary">
                            <Wallet size={20} />
                            <h2 className="text-lg font-semibold">Informações da Transação</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Vincular Fatura (Opcional)</label>
                                <select
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={formData.invoiceId || ''}
                                    onChange={(e) => handleInvoiceChange(e.target.value)}
                                >
                                    <option value="">Nenhuma (Pagamento Direto)</option>
                                    {invoices.map((i) => (
                                        <option key={i.id} value={i.id}>
                                            {i.type === 'Outbound' ? '[REC]' : '[PAG]'} - Ref: {i.id.substring(0, 8)} - {i.businessPartnerName} - {i.grossAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Parceiro de Negócios</label>
                                <select
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={formData.businessPartnerId}
                                    onChange={(e) => setFormData({ ...formData, businessPartnerId: e.target.value })}
                                    required
                                    disabled={!!formData.invoiceId}
                                >
                                    <option value="">Selecione um parceiro...</option>
                                    {partners.map((p) => (
                                        <option key={p.id} value={p.id}>{p.razaoSocial || p.nomeFantasia}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Valor</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Data do Pagamento</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        value={formData.paymentDate}
                                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Método</label>
                                    <select
                                        className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        value={formData.method}
                                        onChange={(e) => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
                                    >
                                        <option value="Cash">Dinheiro</option>
                                        <option value="BankTransfer">Transferência Bancária</option>
                                        <option value="CreditCard">Cartão de Crédito</option>
                                        <option value="Check">Cheque</option>
                                        <option value="Other">Outro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Conta Bancária / Caixa</label>
                                    <select
                                        className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        value={formData.accountId}
                                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                        required
                                    >
                                        <option value="">Selecione uma conta...</option>
                                        {accounts.map((a) => (
                                            <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Referência / Histórico</label>
                                <textarea
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    rows={2}
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    placeholder="Ex: Pagamento referente a fatura #123"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
