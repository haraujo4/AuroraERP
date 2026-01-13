import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { productionService } from '../../../services/productionService';
import { materialService } from '../../../services/materialService';
import type { CreateProductionOrder, WorkCenter } from '../../../types/production';
import type { Material } from '../../../types/materials';

export function ProductionOrderForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);

    const [formData, setFormData] = useState<CreateProductionOrder>({
        productId: '',
        quantity: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        workCenterId: undefined
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [mats, wcs] = await Promise.all([
                materialService.getAll(),
                productionService.getWorkCenters()
            ]);
            setMaterials(mats);
            setWorkCenters(wcs);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await productionService.createOrder(formData);
            navigate('/production/orders');
        } catch (error) {
            console.error('Failed to save order:', error);
            alert('Erro ao criar ordem de produção');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/production/orders')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Nova Ordem de Produção (CO01)</h1>
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
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                        <select
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        >
                            <option value="">Selecione...</option>
                            {materials.filter(m => m.type === 'FinishedProduct').map(m => (
                                <option key={m.id} value={m.id}>{m.code} - {m.description}</option>
                            ))}
                            {/* Fallback */}
                            {materials.length > 0 && materials.filter(m => m.type === 'FinishedProduct').length === 0 && (
                                materials.map(m => (
                                    <option key={m.id} value={m.id}>{m.code} - {m.description}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Planejada</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                min="0.0001"
                                step="0.0001"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabalho</label>
                            <select
                                value={formData.workCenterId || ''}
                                onChange={(e) => setFormData({ ...formData, workCenterId: e.target.value || undefined })}
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="">Selecione (Opcional)...</option>
                                {workCenters.map(w => (
                                    <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início (Plan)</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim (Plan)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
