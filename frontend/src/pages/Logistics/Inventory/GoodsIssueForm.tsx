import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, PackageMinus, AlertCircle } from 'lucide-react';
import { materialService } from '../../../services/materialService';
import { branchService } from '../../../services/branchService';
import { inventoryService } from '../../../services/inventoryService';
import type { Material } from '../../../types/materials';
import type { Branch, Deposito } from '../../../types/organization';
import { StockMovementTypes, type CreateStockMovement } from '../../../types/inventory';

export function GoodsIssueForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [depositos, setDepositos] = useState<Deposito[]>([]);
    const [availableStock, setAvailableStock] = useState<number | null>(null);

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

    useEffect(() => {
        if (formData.materialId && formData.depositoId) {
            checkStock();
        } else {
            setAvailableStock(null);
        }
    }, [formData.materialId, formData.depositoId, formData.batchNumber]);

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

    const checkStock = async () => {
        try {
            const response: any = await inventoryService.getAll(); // Simplified, ideally we have a getStock(mat, dep)
            const stock = response.find((s: any) =>
                s.materialId === formData.materialId &&
                s.depositoId === formData.depositoId &&
                (!formData.batchNumber || s.batchNumber === formData.batchNumber)
            );
            setAvailableStock(stock?.quantity || 0);
        } catch (error) {
            console.error('Failed to check stock:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (availableStock !== null && formData.quantity > availableStock) {
            if (!confirm('Quantidade superior ao estoque disponível. Deseja continuar mesmo assim?')) return;
        }

        setLoading(true);
        try {
            const movement: CreateStockMovement = {
                materialId: formData.materialId,
                depositoId: formData.depositoId,
                type: StockMovementTypes.Out,
                quantity: formData.quantity,
                batchNumber: formData.batchNumber || undefined,
                referenceDocument: formData.referenceDocument
            };

            await inventoryService.createMovement(movement);
            alert('Saída de estoque registrada com sucesso!');
            navigate('/logistics/inventory');
        } catch (error: any) {
            console.error('Failed to create issue:', error);
            alert('Falha ao registrar saída: ' + (error.response?.data || error.message));
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
                            <PackageMinus className="text-red-600" size={24} />
                            Saída de Estoque
                        </h1>
                        <p className="text-sm text-text-secondary">Baixa de materiais por consumo ou avaria</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.materialId || !formData.depositoId || formData.quantity <= 0}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 font-bold"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Processando...' : 'Confirmar Saída'}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-border-default overflow-hidden">
                    <div className="bg-bg-secondary p-4 border-b border-border-default font-bold text-text-primary uppercase text-xs tracking-wider">
                        Detalhes da Baixa
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-2 gap-8 border-b border-border-default pb-8">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Filial Origem</label>
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
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Depósito Origem</label>
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
                                {availableStock !== null && (
                                    <div className={`mt-2 text-xs font-bold flex items-center gap-1 ${availableStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        <AlertCircle size={14} />
                                        Saldo Disponível: {availableStock} UN
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Quantidade a Baixar</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none font-bold ${availableStock !== null && formData.quantity > availableStock ? 'border-red-500 bg-red-50' : 'border-border-default'}`}
                                        required
                                        min="0.0001"
                                        step="0.0001"
                                    />
                                    <span className="absolute right-3 top-2 text-text-tertiary font-bold text-xs uppercase">UN</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Lote / Série</label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={formData.batchNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                    placeholder="Opcional"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-tighter">Motivo / Documento</label>
                                <input
                                    type="text"
                                    name="referenceDocument"
                                    value={formData.referenceDocument}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none font-mono"
                                    required
                                    placeholder="Ex: CONSUMO-INTERNO"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
