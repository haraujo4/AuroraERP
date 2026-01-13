import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { materialService } from '../../../services/materialService';
import { branchService } from '../../../services/branchService';
import { inventoryService } from '../../../services/inventoryService';
import type { Material } from '../../../types/materials';
import type { Branch, Deposito } from '../../../types/organization';
import { StockMovementTypes, type StockMovementType, type CreateStockMovement } from '../../../types/inventory';

export function StockAdjustmentForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [depositos, setDepositos] = useState<Deposito[]>([]);

    const [formData, setFormData] = useState<{
        materialId: string;
        branchId: string;
        depositoId: string;
        type: StockMovementType;
        quantity: number;
        batchNumber: string;
        referenceDocument: string;
    }>({
        materialId: '',
        branchId: '',
        depositoId: '',
        type: StockMovementTypes.In,
        quantity: 0,
        batchNumber: '',
        referenceDocument: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const matId = searchParams.get('materialId');
        if (matId) {
            setFormData(prev => ({ ...prev, materialId: matId }));
        }
    }, [searchParams]);

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
                type: formData.type,
                quantity: formData.quantity,
                batchNumber: formData.batchNumber || undefined,
                referenceDocument: formData.referenceDocument
            };

            await inventoryService.createMovement(movement);
            navigate('/logistics/inventory');
        } catch (error) {
            console.error('Failed to create movement:', error);
            alert('Falha ao registrar movimentação');
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
                        <h1 className="text-xl font-bold text-text-primary">
                            Nova Movimentação
                        </h1>
                        <p className="text-sm text-text-secondary">Registrar entrada, saída ou ajuste de estoque</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Processando...' : 'Confirmar Movimento'}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-border-default p-6">
                    <div className="grid grid-cols-1 gap-6">

                        {/* Material Selection */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Material</label>
                            <select
                                name="materialId"
                                value={formData.materialId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                required
                            >
                                <option value="">Selecione um material...</option>
                                {materials.map(m => (
                                    <option key={m.id} value={m.id}>{m.code} - {m.description}</option>
                                ))}
                            </select>
                        </div>

                        {/* Branch Selection */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Filial</label>
                            <select
                                name="branchId"
                                value={formData.branchId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                required
                            >
                                <option value="">Selecione uma filial...</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.codigo} - {b.descricao}</option>
                                ))}
                            </select>
                        </div>

                        {/* Warehouse Selection */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Depósito</label>
                            <select
                                name="depositoId"
                                value={formData.depositoId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                required
                                disabled={!formData.branchId}
                            >
                                <option value="">Selecione um depósito...</option>
                                {depositos.map(d => (
                                    <option key={d.id} value={d.id}>{d.codigo} - {d.descricao}</option>
                                ))}
                            </select>
                        </div>

                        <div className="border-t border-border-default my-2"></div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Tipo de Movimento</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                    required
                                >
                                    <option value={StockMovementTypes.In}>Entrada (In)</option>
                                    <option value={StockMovementTypes.Out}>Saída (Out)</option>
                                    <option value={StockMovementTypes.Transfer}>Transferência</option>
                                    <option value={StockMovementTypes.Adjustment}>Ajuste</option>
                                    <option value={StockMovementTypes.InitialBalance}>Saldo Inicial</option>
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Quantidade</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                    required
                                    min="0.0001"
                                    step="0.0001"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Batch */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Lote / Série (Opcional)</label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={formData.batchNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                    placeholder="Ex: LOTE-001"
                                />
                            </div>

                            {/* Reference Doc */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Documento de Referência</label>
                                <input
                                    type="text"
                                    name="referenceDocument"
                                    value={formData.referenceDocument}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                    required
                                    placeholder="Ex: INV-2023-10"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
