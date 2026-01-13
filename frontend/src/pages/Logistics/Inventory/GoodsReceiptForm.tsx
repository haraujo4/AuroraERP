import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, PackagePlus } from 'lucide-react';
import { materialService } from '../../../services/materialService';
import { branchService } from '../../../services/branchService';
import { inventoryService } from '../../../services/inventoryService';
import type { Material } from '../../../types/materials';
import type { Branch, Deposito } from '../../../types/organization';
import { StockMovementTypes, type CreateStockMovement } from '../../../types/inventory';

export function GoodsReceiptForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [depositos, setDepositos] = useState<Deposito[]>([]);

    const [formData, setFormData] = useState({
        materialId: '',
        branchId: '',
        depositoId: '',
        quantity: 0,
        batchNumber: '',
        referenceDocument: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (formData.branchId) {
            loadDepositos(formData.branchId);
        } else {
            setDepositos([]);
        }
    }, [formData.branchId]);

    const loadData = async () => {
        try {
            const [mats, brs] = await Promise.all([
                materialService.getAll(),
                branchService.getAll()
            ]);
            setMaterials(mats);
            setBranches(brs);
        } catch (error) {
            console.error('Failed to load initial data:', error);
            alert('Erro ao carregar dados iniciais');
        }
    };

    const loadDepositos = async (branchId: string) => {
        try {
            const deps = await branchService.getDepositos(branchId);
            setDepositos(deps);
        } catch (error) {
            console.error('Failed to load warehouses:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const movement: CreateStockMovement = {
                materialId: formData.materialId,
                depositoId: formData.depositoId,
                type: StockMovementTypes.In,
                quantity: formData.quantity,
                batchNumber: formData.batchNumber || undefined,
                referenceDocument: formData.referenceDocument
            };

            await inventoryService.createMovement(movement);
            alert('Entrada de mercadoria registrada com sucesso!');
            navigate('/logistics/inventory');
        } catch (error: any) {
            console.error('Failed to create receipt:', error);
            alert('Falha ao registrar entrada: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/logistics/inventory')}
                        className="p-2 hover:bg-bg-secondary rounded-full text-text-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <PackagePlus className="text-green-600" size={24} />
                            Entrada de Mercadoria (MB01)
                        </h1>
                        <p className="text-sm text-text-secondary">Recebimento de materiais no estoque</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.materialId || !formData.depositoId || formData.quantity <= 0}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 font-bold"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Processando...' : 'Registrar Entrada'}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-border-default overflow-hidden">
                    <div className="bg-bg-secondary p-4 border-b border-border-default font-bold text-text-primary uppercase text-xs tracking-wider">
                        Detalhes do Recebimento
                    </div>
                    <div className="p-8 space-y-8">
                        {/* Section 1: Origins */}
                        <div className="grid grid-cols-2 gap-8 border-b border-border-default pb-8">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Filial Destino</label>
                                <select
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                                    required
                                >
                                    <option value="">Selecione a filial...</option>
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.codigo} - {b.descricao}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Depósito Destino</label>
                                <select
                                    name="depositoId"
                                    value={formData.depositoId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all disabled:bg-bg-secondary"
                                    required
                                    disabled={!formData.branchId}
                                >
                                    <option value="">Selecione o depósito...</option>
                                    {depositos.map(d => (
                                        <option key={d.id} value={d.id}>{d.codigo} - {d.descricao}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Section 2: Material and Quantity */}
                        <div className="grid grid-cols-3 gap-8 pb-8">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Material</label>
                                <select
                                    name="materialId"
                                    value={formData.materialId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                                    required
                                >
                                    <option value="">Buscar material...</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.code} - {m.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Quantidade</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                        required
                                        min="0.0001"
                                        step="0.0001"
                                    />
                                    <span className="absolute right-3 top-2 text-text-tertiary font-bold text-xs uppercase">UN</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Traceability */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Lote / Série (Opcional)</label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={formData.batchNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                    placeholder="Ex: LOTE-2024-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Nota Fiscal / Doc. Ref</label>
                                <input
                                    type="text"
                                    name="referenceDocument"
                                    value={formData.referenceDocument}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none font-mono"
                                    required
                                    placeholder="NF-000123"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
