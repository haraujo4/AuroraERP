import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { productionService } from '../../../services/productionService';
import { materialService } from '../../../services/materialService';
import type { CreateBillOfMaterial, CreateBillOfMaterialItem } from '../../../types/production';
import type { Material } from '../../../types/materials';

export function BillOfMaterialForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<Material[]>([]);

    // Form State
    const [productId, setProductId] = useState('');
    const [description, setDescription] = useState('');
    const [baseQuantity, setBaseQuantity] = useState(1);

    const [items, setItems] = useState<{
        id: number; // temp UI id
        componentId: string;
        quantity: number;
    }[]>([
        { id: 1, componentId: '', quantity: 1 }
    ]);

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        try {
            const data = await materialService.getAll();
            setMaterials(data);
        } catch (error) {
            console.error('Failed to load materials:', error);
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
        setItems(prev => [...prev, { id: newId, componentId: '', quantity: 1 }]);
    };

    const removeItem = (id: number) => {
        if (items.length <= 1) return;
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) {
            alert('Selecione um Produto Acabado.');
            return;
        }

        setLoading(true);
        try {
            const payload: CreateBillOfMaterial = {
                productId,
                description,
                baseQuantity: Number(baseQuantity),
                items: items.map(i => ({
                    componentId: i.componentId,
                    quantity: Number(i.quantity)
                }))
            };

            await productionService.createBOM(payload);
            navigate('/production/boms');
        } catch (error) {
            console.error('Failed to save BOM:', error);
            alert('Erro ao salvar Lista de Materiais');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/production/boms')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Nova Lista de Materiais (BOM)</h1>
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
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Produto Acabado</label>
                            <select
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="">Selecione...</option>
                                {materials.filter(m => m.type === 'FinishedProduct').map(m => (
                                    <option key={m.id} value={m.id}>{m.code} - {m.description}</option>
                                ))}
                                {/* Fallback if no type filter match or show all? Let's assume filter works. If not, show all */}
                                {materials.length > 0 && materials.filter(m => m.type === 'FinishedProduct').length === 0 && (
                                    materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.code} - {m.description}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Variante</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                placeholder="Ex: Bicicleta Modelo X - Versão 2024"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Base</label>
                            <input
                                type="number"
                                value={baseQuantity}
                                onChange={(e) => setBaseQuantity(Number(e.target.value))}
                                min="1"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                            <p className="text-xs text-gray-500 mt-1">Quantidade produzida por esta receita (ex: 1 UN)</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Componentes</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-medium"
                            >
                                <Plus size={16} /> Adicionar Componente
                            </button>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material / Componente</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Quantidade</th>
                                        <th className="px-4 py-2 text-right w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="p-2">
                                                <select
                                                    value={item.componentId}
                                                    onChange={(e) => handleItemChange(item.id, 'componentId', e.target.value)}
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm"
                                                >
                                                    <option value="">Selecione...</option>
                                                    {materials.map(m => (
                                                        <option key={m.id} value={m.id}>{m.code} - {m.description}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                    min="0.0001"
                                                    step="0.0001"
                                                    required
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm text-right"
                                                />
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
                            </table>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
