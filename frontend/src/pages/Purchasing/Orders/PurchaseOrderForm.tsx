import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import purchasingService from '../../../services/purchasingService';
import { materialService } from '../../../services/materialService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import type { Material } from '../../../types/materials';
import type { BusinessPartner } from '../../../types/crm';

const PurchaseOrderForm: React.FC = () => {
    const navigate = useNavigate();
    const [deliveryDate, setDeliveryDate] = useState('');
    const [suppliers, setSuppliers] = useState<BusinessPartner[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');

    const [items, setItems] = useState<any[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // Item form state
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);

    useEffect(() => {
        loadMaterials();
        loadSuppliers();
    }, []);

    const loadMaterials = async () => {
        try {
            const data = await materialService.getAll();
            setMaterials(data);
        } catch (error) {
            console.error('Error loading materials', error);
        }
    };

    const loadSuppliers = async () => {
        try {
            const data = await BusinessPartnerService.getAll();
            setSuppliers(data);
        } catch (error) {
            console.error('Error loading suppliers', error);
        }
    };

    const addItem = () => {
        if (!selectedMaterial) return;
        const material = materials.find(m => m.id === selectedMaterial);

        setItems([...items, {
            materialId: selectedMaterial,
            materialName: material?.description,
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
            total: Number(quantity) * Number(unitPrice)
        }]);

        setSelectedMaterial('');
        setQuantity(1);
        setUnitPrice(0);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await purchasingService.createOrder({
                supplierId: selectedSupplier,
                deliveryDate,
                items: items.map(i => ({
                    materialId: i.materialId,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice
                }))
            });
            navigate('/purchasing/orders');
        } catch (error) {
            console.error('Error creating order', error);
            alert('Failed to create order');
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/purchasing/orders')}
                        className="text-text-secondary hover:text-text-primary"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Novo Pedido de Compra</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={items.length === 0 || !selectedSupplier || !deliveryDate}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50"
                >
                    <Save size={16} />
                    Salvar
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 gap-6">
                    {/* Header Info */}
                    <div className="bg-white p-6 rounded-lg border border-border-default shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Fornecedor</label>
                                <select
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={selectedSupplier}
                                    onChange={(e) => setSelectedSupplier(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.razaoSocial || s.nomeFantasia}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Data Entrega</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white p-6 rounded-lg border border-border-default shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-text-primary">Itens</h2>

                        <div className="flex gap-4 items-end mb-4 bg-bg-subtle p-4 rounded-lg">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Material</label>
                                <select
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={selectedMaterial}
                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {materials.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.code} - {m.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Qtd</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Preço Un.</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addItem}
                                className="bg-white border border-border-default text-text-primary px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Adicionar
                            </button>
                        </div>

                        <table className="w-full">
                            <thead className="bg-bg-secondary border-b border-border-default">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Material</th>
                                    <th className="px-4 py-2 text-right text-xs font-bold uppercase">Qtd</th>
                                    <th className="px-4 py-2 text-right text-xs font-bold uppercase">Preço Un.</th>
                                    <th className="px-4 py-2 text-right text-xs font-bold uppercase">Total</th>
                                    <th className="px-4 py-2 text-right text-xs font-bold uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-2 text-sm">{item.materialName}</td>
                                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                                        <td className="px-4 py-2 text-sm text-right">{item.unitPrice.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-sm text-right">{item.total.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                                            Nenhum item adicionado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderForm;
