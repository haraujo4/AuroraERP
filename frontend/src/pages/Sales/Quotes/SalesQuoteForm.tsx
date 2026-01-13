import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesQuoteService } from '../../../services/salesQuoteService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import { materialService } from '../../../services/materialService';
import type { BusinessPartner } from '../../../types/crm';
import type { Material } from '../../../types/materials';
import type { SalesQuote, CreateSalesQuote, CreateSalesQuoteItem } from '../../../types/sales-quotes';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function SalesQuoteForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // View Mode
    const [quote, setQuote] = useState<SalesQuote | null>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState<CreateSalesQuote>({
        businessPartnerId: '',
        validUntil: new Date().toISOString().split('T')[0],
        items: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [partnersData, materialsData] = await Promise.all([
                    BusinessPartnerService.getAll(),
                    materialService.getAll()
                ]);
                setPartners(partnersData);
                setMaterials(materialsData);

                if (id) {
                    const quoteData = await salesQuoteService.getById(id);
                    setQuote(quoteData);
                }
            } catch (error) {
                console.error('Error loading data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                { materialId: '', quantity: 1, unitPrice: 0, discountPercentage: 0 }
            ]
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index: number, field: keyof CreateSalesQuoteItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index], [field]: value };

        // Auto-fill price on material selection
        if (field === 'materialId') {
            const material = materials.find(m => m.id === value);
            if (material) {
                item.unitPrice = material.basePrice;
            }
        }

        newItems[index] = item;
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => {
        return formData.items.reduce((acc, item) => {
            const gross = item.quantity * item.unitPrice;
            const discount = gross * (item.discountPercentage / 100);
            return acc + (gross - discount);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await salesQuoteService.create(formData);
            navigate('/sales/quotes');
        } catch (error) {
            console.error('Failed to save sales quote', error);
            alert('Failed to save sales quote');
        }
    };

    if (loading) return <div>Carregando...</div>;

    // View Mode
    if (isEditing && quote) {
        return (
            <div className="flex flex-col h-full bg-bg-main p-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => navigate('/sales/quotes')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-text-primary">
                            Cotação {quote.number} (VA22)
                        </h1>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                                    ${quote.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                    quote.status === 'Converted' ? 'bg-purple-100 text-purple-800' :
                                        'bg-red-100 text-red-800'}`}>
                            {quote.status}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto space-y-4">
                    <div className="bg-white p-6 rounded shadow-sm border border-border-default grid grid-cols-2 gap-6">
                        <div className="col-span-2 border-b border-border-default pb-2 mb-2 font-bold text-text-primary flex items-center">
                            Informações Gerais
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Cliente</label>
                            <div className="text-base text-text-primary">{quote.businessPartnerName}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Validade</label>
                            <div className="text-base text-text-primary">{new Date(quote.validUntil).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm border border-border-default">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-default">
                            <h2 className="text-lg font-bold text-text-primary">Itens da Cotação</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-bg-header">
                                    <tr>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Produto</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Qtd</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Preço Unit.</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Desc %</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default">
                                    {quote.items?.map((item, index) => (
                                        <tr key={index} className="hover:bg-bg-main">
                                            <td className="p-3 text-sm text-text-primary">{item.materialName}</td>
                                            <td className="p-3 text-sm text-text-primary text-right">{item.quantity}</td>
                                            <td className="p-3 text-sm text-text-primary text-right">R$ {item.unitPrice.toFixed(2)}</td>
                                            <td className="p-3 text-sm text-text-primary text-right">{item.discountPercentage}%</td>
                                            <td className="p-3 text-sm font-medium text-text-primary text-right">R$ {item.totalValue.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex justify-end items-center border-t border-border-default pt-4">
                            <span className="text-lg font-bold text-text-secondary mr-4">Total:</span>
                            <span className="text-2xl font-bold text-brand-primary">R$ {quote.totalValue.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/sales/quotes')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        Nova Cotação de Venda (VA21)
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Save size={16} className="mr-2" />
                        Salvar Cotação
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-auto space-y-4">
                {/* Header */}
                <div className="bg-white p-6 rounded shadow-sm border border-border-default grid grid-cols-2 gap-6">
                    <div className="col-span-2 border-b border-border-default pb-2 mb-2 font-bold text-text-primary flex items-center">
                        Informações Gerais
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Cliente (Business Partner)</label>
                        <select
                            required
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                            value={formData.businessPartnerId}
                            onChange={(e) => setFormData({ ...formData, businessPartnerId: e.target.value })}
                        >
                            <option value="">Selecione um Cliente</option>
                            {partners.map(p => (
                                <option key={p.id} value={p.id}>{p.razaoSocial}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Data de Validade</label>
                        <input
                            type="date"
                            required
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            value={formData.validUntil}
                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        />
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white p-6 rounded shadow-sm border border-border-default">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-default">
                        <h2 className="text-lg font-bold text-text-primary">Itens</h2>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="flex items-center px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 text-sm font-medium"
                        >
                            <Plus size={16} className="mr-1" /> Adicionar Item
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-bg-header">
                                <tr>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Produto</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default w-24 text-right">Qtd</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default w-32 text-right">Preço Unit.</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default w-24 text-right">Desc %</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default w-32 text-right">Total</th>
                                    <th className="p-3 border-b border-border-default w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default">
                                {formData.items.map((item, index) => (
                                    <tr key={index} className="hover:bg-bg-main">
                                        <td className="p-3">
                                            <select
                                                required
                                                className="w-full p-1 border border-border-input rounded focus:border-brand-primary outline-none bg-white"
                                                value={item.materialId}
                                                onChange={(e) => handleItemChange(index, 'materialId', e.target.value)}
                                            >
                                                <option value="">Selecione...</option>
                                                {materials.map(m => (
                                                    <option key={m.id} value={m.id}>{m.description} ({m.code})</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                required
                                                min="0.01"
                                                step="0.01"
                                                className="w-full p-1 border border-border-input rounded text-right focus:border-brand-primary outline-none"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full p-1 border border-border-input rounded text-right focus:border-brand-primary outline-none"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className="w-full p-1 border border-border-input rounded text-right focus:border-brand-primary outline-none"
                                                value={item.discountPercentage}
                                                onChange={(e) => handleItemChange(index, 'discountPercentage', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td className="p-3 text-right font-medium text-text-primary">
                                            R$ {((item.quantity * item.unitPrice) * (1 - item.discountPercentage / 100)).toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-end items-center border-t border-border-default pt-4">
                        <span className="text-lg font-bold text-text-secondary mr-4">Total da Cotação:</span>
                        <span className="text-2xl font-bold text-brand-primary">R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
