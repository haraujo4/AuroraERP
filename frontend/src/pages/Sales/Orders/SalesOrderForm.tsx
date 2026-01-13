import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { salesOrderService } from '../../../services/salesOrderService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import { materialService } from '../../../services/materialService';
import { ArrowLeft, Save, Printer, CheckCircle, Truck } from 'lucide-react';
import type { BusinessPartner } from '../../../types/crm';
import type { Material } from '../../../types/materials';
import type { CreateSalesOrder, CreateSalesOrderItem, SalesOrder } from '../../../types/sales-orders';

export function SalesOrderForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    // For view mode
    const [order, setOrder] = useState<SalesOrder | null>(null);

    const [formData, setFormData] = useState<CreateSalesOrder>({
        businessPartnerId: '',
        orderDate: new Date().toISOString().split('T')[0],
        items: []
    });

    useEffect(() => {
        const loadJava = async () => {
            try {
                const [partnersData, materialsData] = await Promise.all([
                    BusinessPartnerService.getAll(),
                    materialService.getAll()
                ]);
                setPartners(partnersData);
                setMaterials(materialsData);

                if (id) {
                    const orderData = await salesOrderService.getById(id);
                    setOrder(orderData);
                    // If we were to support editing, we'd map this back to formData
                }
            } catch (error) {
                console.error('Error loading data', error);
            } finally {
                setLoading(false);
            }
        };
        loadJava();
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

    const handleItemChange = (index: number, field: keyof CreateSalesOrderItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index], [field]: value };

        if (field === 'materialId') {
            const material = materials.find(m => m.id === value);
            if (material) {
                item.unitPrice = material.basePrice;
            }
        }

        newItems[index] = item;
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = (items: any[]) => {
        return items.reduce((acc, item) => {
            const gross = item.quantity * item.unitPrice;
            const discount = gross * (item.discountPercentage / 100);
            return acc + (gross - discount);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await salesOrderService.create(formData);
            navigate('/sales/orders');
        } catch (error) {
            console.error('Failed to save sales order', error);
            alert('Failed to save sales order');
        }
    };

    if (loading) return <div>Carregando...</div>;

    // View Mode (for converted orders)
    if (isEditing && order) {
        return (
            <div className="flex flex-col h-full bg-bg-main p-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => navigate('/sales/orders')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-text-primary">
                            Pedido {order.number} (VA02)
                        </h1>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                                    ${order.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                order.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'}`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {order.status === 'Draft' && (
                            <button
                                onClick={async () => {
                                    if (confirm('Confirmar este pedido? Isso permitirá a expedição.')) {
                                        try {
                                            await salesOrderService.updateStatus(order.id, 'Confirmed');
                                            const updated = await salesOrderService.getById(order.id);
                                            setOrder(updated);
                                        } catch (e) {
                                            alert('Erro ao confirmar pedido');
                                            console.error(e);
                                        }
                                    }
                                }}
                                className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                <CheckCircle size={16} className="mr-2" /> Confirmar
                            </button>
                        )}
                        {order.status === 'Confirmed' && (
                            <button
                                onClick={async () => {
                                    if (confirm('Gerar entrega para este pedido?')) {
                                        try {
                                            const service = await import('../../../services/deliveryService').then(m => m.deliveryService);
                                            await service.createFromOrder(order.id);
                                            alert('Entrega criada com sucesso!');
                                            navigate('/logistics/deliveries');
                                        } catch (err: any) {
                                            alert('Erro ao criar entrega: ' + (err.response?.data || err.message));
                                        }
                                    }
                                }}
                                className="flex items-center px-3 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                            >
                                <Truck size={16} className="mr-2" /> Gerar Entrega
                            </button>
                        )}
                        <button
                            className="flex items-center px-3 py-2 bg-text-secondary text-white rounded hover:bg-text-primary transition-colors text-sm font-medium"
                        >
                            <Printer size={16} className="mr-2" /> Imprimir
                        </button>
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
                            <div className="text-base text-text-primary">{order.businessPartnerName}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Data do Pedido</label>
                            <div className="text-base text-text-primary">{new Date(order.orderDate).toLocaleDateString()}</div>
                        </div>
                        {order.quoteNumber && (
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-text-secondary">Origem</label>
                                <div className="text-base text-text-primary">Cotação {order.quoteNumber}</div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm border border-border-default">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-default">
                            <h2 className="text-lg font-bold text-text-primary">Itens do Pedido</h2>
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
                                    {order.items?.map((item, index) => (
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
                            <span className="text-2xl font-bold text-brand-primary">R$ {order.totalValue.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Create Mode
    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/sales/orders')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        Novo Pedido de Venda (VA01)
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Save size={16} className="mr-2" />
                        Salvar Pedido
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
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Cliente</label>
                        <select
                            required
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                            value={formData.businessPartnerId}
                            onChange={(e) => setFormData({ ...formData, businessPartnerId: e.target.value })}
                        >
                            <option value="">Selecione...</option>
                            {partners.map(p => (
                                <option key={p.id} value={p.id}>{p.razaoSocial}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Data</label>
                        <input
                            type="date"
                            required
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            value={formData.orderDate}
                            onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                        />
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-border-default">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-default">
                        <h2 className="text-lg font-bold text-text-primary">Itens</h2>
                        <button type="button" onClick={handleAddItem} className="text-brand-primary hover:text-brand-secondary text-sm font-medium">
                            + Adicionar Item
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-bg-header">
                                <tr>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Produto</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right w-24">Qtd</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right w-32">Preço</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right w-24">Desc %</th>
                                    <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right w-32">Total</th>
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
                                                    <option key={m.id} value={m.id}>{m.description}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <input type="number" className="w-full text-right p-1 border border-border-input rounded focus:border-brand-primary outline-none" required min="1"
                                                value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))} />
                                        </td>
                                        <td className="p-3">
                                            <input type="number" className="w-full text-right p-1 border border-border-input rounded focus:border-brand-primary outline-none" required min="0"
                                                value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} />
                                        </td>
                                        <td className="p-3">
                                            <input type="number" className="w-full text-right p-1 border border-border-input rounded focus:border-brand-primary outline-none" min="0" max="100"
                                                value={item.discountPercentage} onChange={(e) => handleItemChange(index, 'discountPercentage', parseFloat(e.target.value))} />
                                        </td>
                                        <td className="p-3 text-right font-medium text-text-primary">
                                            R$ {((item.quantity * item.unitPrice) * (1 - item.discountPercentage / 100)).toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-end items-center border-t border-border-default pt-4">
                        <span className="text-lg font-bold text-text-secondary mr-4">Total:</span>
                        <span className="text-2xl font-bold text-brand-primary">R$ {calculateTotal(formData.items).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
