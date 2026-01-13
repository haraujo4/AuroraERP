import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import purchasingService from '../../../services/purchasingService';
import type { PurchaseOrder } from '../../../types/purchasing';

const MiroForm: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await purchasingService.getOrders();
            // Filter for orders that are contextually relevant for invoicing if status was solid
            // For now, list all.
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder || !issueDate || !dueDate) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            await financeService.createFromPurchaseOrder({
                purchaseOrderId: selectedOrder,
                issueDate: new Date(issueDate).toISOString(),
                dueDate: new Date(dueDate).toISOString()
            });
            navigate('/finance/invoices');
        } catch (error) {
            console.error('Error creating invoice from PO', error);
            alert('Falha ao processar verificação de fatura.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/finance/invoices')}
                        className="text-text-secondary hover:text-text-primary"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Verificação de Fatura (MIRO)</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !selectedOrder || !issueDate || !dueDate}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50"
                >
                    <Save size={16} />
                    {loading ? 'Processando...' : 'Lançar Fatura'}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-border-default shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-brand-primary">
                            <FileText size={20} />
                            <h2 className="text-lg font-semibold">Dados do Documento</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Pedido de Compra</label>
                                <select
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={selectedOrder}
                                    onChange={(e) => setSelectedOrder(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione um Pedido...</option>
                                    {orders.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.orderNumber} - ID Fornecedor: {o.supplierId.substring(0, 8)}...
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-text-secondary">Selecione o pedido de compra que deseja faturar.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Data de Emissão (NF)</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Data de Vencimento</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-inner">
                        <p className="text-sm text-blue-800">
                            <strong>Dica ERP Aurora:</strong> Este processo realiza o "Three-Way Match" (Pedido vs Fatura vs Recebimento). Certifique-se de que o pedido foi devidamente aprovado antes de faturar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiroForm;
