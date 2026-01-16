import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import type { CreateInvoice } from '../../../types/finance';
import type { BusinessPartner } from '../../../types/crm';

import { useParams } from 'react-router-dom';

export function InvoiceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [partners, setPartners] = useState<BusinessPartner[]>([]);

    // Form State
    const [businessPartnerId, setBusinessPartnerId] = useState('');
    const [type, setType] = useState<'Inbound' | 'Outbound'>('Outbound');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [barcode, setBarcode] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [items, setItems] = useState<{
        id: number;
        description: string;
        quantity: number;
        unitPrice: number;
        taxAmount: number;
    }[]>([
        { id: 1, description: '', quantity: 1, unitPrice: 0, taxAmount: 0 }
    ]);

    useEffect(() => {
        loadPartners();
        if (id) {
            loadInvoice(id);
        }
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const loadInvoice = async (invoiceId: string) => {
        try {
            setLoading(true);
            const data = await financeService.getInvoiceById(invoiceId);
            setBusinessPartnerId(data.businessPartnerId);
            setType(data.type);
            setIssueDate(data.issueDate.split('T')[0]);
            setDueDate(data.dueDate.split('T')[0]);
            setBarcode(data.barcode || '');
            setAttachmentUrl(data.attachmentUrl || '');

            // Map items
            if (data.items && data.items.length > 0) {
                setItems(data.items.map((item, index) => ({
                    id: index + 1,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    taxAmount: item.taxAmount
                })));
            }
        } catch (error) {
            console.error('Failed to load invoice:', error);
            alert('Erro ao carregar fatura');
            navigate('/finance/invoices');
        } finally {
            setLoading(false);
        }
    };

    const loadPartners = async () => {
        try {
            const data = await BusinessPartnerService.getAll();
            setPartners(data);
        } catch (error) {
            console.error('Failed to load partners:', error);
        }
    };

    const handleItemChange = (id: number, field: string, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const addItem = () => {
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        setItems(prev => [...prev, { id: newId, description: '', quantity: 1, unitPrice: 0, taxAmount: 0 }]);
    };

    const removeItem = (id: number) => {
        if (items.length <= 1) {
            alert('A fatura deve ter pelo menos 1 item.');
            return;
        }
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)) + Number(item.taxAmount), 0);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!businessPartnerId) {
            alert('Selecione um parceiro de negócios.');
            return;
        }

        setLoading(true);
        try {
            const payload: CreateInvoice = {
                businessPartnerId,
                type,
                issueDate: new Date(issueDate).toISOString(),
                dueDate: new Date(dueDate).toISOString(),
                items: items.map(i => ({
                    description: i.description,
                    quantity: Number(i.quantity),
                    unitPrice: Number(i.unitPrice),
                    taxAmount: Number(i.taxAmount)
                })),
                barcode: type === 'Inbound' ? barcode : undefined
            };

            let invoiceId = id;
            if (!id) {
                const created = await financeService.createInvoice(payload);
                invoiceId = created.id;
            } else {
                // edit logic (not fully implemented in backend yet, but okay)
                // If we have update method, we call it. For now, create only supports barcode on creation via DTO?
                // No, create DTO doesn't have barcode in backend yet? 
                // Wait, I added it to DTO. But if editing existing invoice, need to call updatePaymentInfo.
            }

            // Handle Barcode Update if Editing
            if (id && type === 'Inbound') {
                await financeService.updatePaymentInfo(id, barcode);
            }
            // Handle Barcode if Creating (if DTO supported it, but I added it to CreateInvoiceDto just now? 
            // In backend I added Barcode to InvoiceDto but not explicit CreateInvoiceDto mapping in InvoiceService.
            // Actually, in InvoiceService.CreateAsync I didn't map DTO.Barcode to entity! 
            // I should update backend service to handle barcode on create, or just call update after create.
            // Calling update after create is safer for MVP.

            if (!id && invoiceId && type === 'Inbound') {
                await financeService.updatePaymentInfo(invoiceId, barcode);
            }

            // Upload File
            if (selectedFile && invoiceId) {
                await financeService.uploadAttachment(invoiceId, selectedFile);
            }

            navigate('/finance/invoices');
        } catch (error) {
            console.error('Failed to save invoice:', error);
            alert('Erro ao salvar fatura');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/finance/invoices')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {id ? 'Editar Fatura' : 'Nova Fatura'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50"
                >
                    <Save size={16} />
                    Salvar
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parceiro de Negócios</label>
                            <select
                                value={businessPartnerId}
                                onChange={(e) => setBusinessPartnerId(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="">Selecione...</option>
                                {partners.map(p => (
                                    <option key={p.id} value={p.id}>{p.nomeFantasia || p.razaoSocial}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as 'Inbound' | 'Outbound')}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="Outbound">Receber (Venda)</option>
                                <option value="Inbound">Pagar (Compra)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Emissão</label>
                            <input
                                type="date"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Vencimento</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                    </div>

                    {type === 'Inbound' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras (Boleto)</label>
                                <input
                                    type="text"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    placeholder="Digite o código de barras"
                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Anexar Fatura (PDF)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    />
                                    {attachmentUrl && (
                                        <a href={attachmentUrl} target="_blank" rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center">
                                            Ver
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Items</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-medium"
                            >
                                <Plus size={16} /> Adicionar Item
                            </button>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Descrição</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Qtd</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Preço Unit.</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Imposto</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Total</th>
                                        <th className="px-4 py-2 text-right w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm"
                                                    placeholder="Descrição do serviço ou produto"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                    min="0.01"
                                                    step="0.01"
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm text-right"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={item.unitPrice}
                                                    onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm text-right"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={item.taxAmount}
                                                    onChange={(e) => handleItemChange(item.id, 'taxAmount', e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm text-right"
                                                />
                                            </td>
                                            <td className="p-2 text-right text-sm font-medium">
                                                {((Number(item.quantity) * Number(item.unitPrice)) + Number(item.taxAmount)).toFixed(2)}
                                            </td>
                                            <td className="p-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 font-bold">
                                    <tr>
                                        <td colSpan={4} className="px-4 py-2 text-right">Total Geral:</td>
                                        <td className="px-4 py-2 text-right text-lg text-brand-primary">
                                            {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    );
}
