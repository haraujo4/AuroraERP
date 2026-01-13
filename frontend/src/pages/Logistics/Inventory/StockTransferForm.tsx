import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ArrowRightLeft, MapPin, PackagePlus } from 'lucide-react';
import { materialService } from '../../../services/materialService';
import { branchService } from '../../../services/branchService';
import { inventoryService } from '../../../services/inventoryService';
import type { Material } from '../../../types/materials';
import type { Branch, Deposito } from '../../../types/organization';
import type { TransferStock } from '../../../types/inventory';

export function StockTransferForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);

    // Source
    const [sourceDepositos, setSourceDepositos] = useState<Deposito[]>([]);
    const [availableStock, setAvailableStock] = useState<number | null>(null);

    // Destination
    const [destDepositos, setDestDepositos] = useState<Deposito[]>([]);

    const [formData, setFormData] = useState({
        materialId: '',
        sourceBranchId: '',
        sourceDepositoId: '',
        destBranchId: '',
        destDepositoId: '',
        quantity: 0,
        batchNumber: '',
        referenceDocument: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (formData.sourceBranchId) {
            loadSourceDepositos(formData.sourceBranchId);
        } else {
            setSourceDepositos([]);
        }
    }, [formData.sourceBranchId]);

    useEffect(() => {
        if (formData.destBranchId) {
            loadDestDepositos(formData.destBranchId);
        } else {
            setDestDepositos([]);
        }
    }, [formData.destBranchId]);

    useEffect(() => {
        if (formData.materialId && formData.sourceDepositoId) {
            checkStock();
        } else {
            setAvailableStock(null);
        }
    }, [formData.materialId, formData.sourceDepositoId, formData.batchNumber]);

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

    const loadSourceDepositos = async (branchId: string) => {
        const deps = await branchService.getDepositos(branchId);
        setSourceDepositos(deps);
    };

    const loadDestDepositos = async (branchId: string) => {
        const deps = await branchService.getDepositos(branchId);
        setDestDepositos(deps);
    };

    const checkStock = async () => {
        try {
            const response: any = await inventoryService.getAll();
            const stock = response.find((s: any) =>
                s.materialId === formData.materialId &&
                s.depositoId === formData.sourceDepositoId &&
                (!formData.batchNumber || s.batchNumber === formData.batchNumber)
            );
            setAvailableStock(stock?.quantity || 0);
        } catch (error) {
            console.error('Failed to check stock:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.sourceDepositoId === formData.destDepositoId) {
            alert('Origem e Destino não podem ser o mesmo depósito!');
            return;
        }

        if (availableStock !== null && formData.quantity > availableStock) {
            if (!confirm('Quantidade superior ao estoque disponível na origem. Deseja continuar?')) return;
        }

        setLoading(true);
        try {
            const transfer: TransferStock = {
                materialId: formData.materialId,
                sourceDepositoId: formData.sourceDepositoId,
                destinationDepositoId: formData.destDepositoId,
                quantity: formData.quantity,
                batchNumber: formData.batchNumber || undefined,
                referenceDocument: formData.referenceDocument
            };

            await inventoryService.transferStock(transfer);
            alert('Transferência concluída com sucesso!');
            navigate('/logistics/inventory');
        } catch (error: any) {
            console.error('Failed to transfer:', error);
            alert('Erro na transferência: ' + (error.response?.data || error.message));
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
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/logistics/inventory')} className="p-2 hover:bg-bg-secondary rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <ArrowRightLeft className="text-brand-primary" size={24} />
                            Transferência de Estoque (MB1B)
                        </h1>
                        <p className="text-sm text-text-secondary">Movimentação direta entre depósitos</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.materialId || !formData.sourceDepositoId || !formData.destDepositoId || formData.quantity <= 0}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary font-bold disabled:opacity-50"
                >
                    <Save size={16} />
                    {loading ? 'Processando...' : 'Efetivar Transferência'}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-xl shadow border p-6 flex flex-col gap-6">
                        <div className="font-bold text-text-secondary uppercase text-xs border-b pb-2 flex items-center gap-2">
                            <PackagePlus size={14} /> Material a ser Transferido
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Produto</label>
                                <select name="materialId" value={formData.materialId} onChange={handleChange} className="w-full p-2 border rounded-lg outline-none focus:ring-2">
                                    <option value="">Selecione...</option>
                                    {materials.map(m => <option key={m.id} value={m.id}>{m.code} - {m.description}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantidade</label>
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded-lg font-bold" min="0.001" step="0.001" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Source */}
                        <div className="bg-white rounded-xl shadow border p-6 space-y-6 border-l-4 border-l-red-500">
                            <div className="font-bold text-red-600 uppercase text-xs border-b pb-2 flex items-center gap-2">
                                <MapPin size={14} /> Origem (Saída)
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Filial</label>
                                    <select name="sourceBranchId" value={formData.sourceBranchId} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                        <option value="">Selecione...</option>
                                        {branches.map(b => <option key={b.id} value={b.id}>{b.descricao}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Depósito</label>
                                    <select name="sourceDepositoId" value={formData.sourceDepositoId} onChange={handleChange} className="w-full p-2 border rounded-lg disabled:bg-gray-100" disabled={!formData.sourceBranchId}>
                                        <option value="">Selecione...</option>
                                        {sourceDepositos.map(d => <option key={d.id} value={d.id}>{d.descricao}</option>)}
                                    </select>
                                </div>
                                {availableStock !== null && (
                                    <div className="p-3 bg-red-50 rounded border border-red-100 text-red-700 text-xs font-bold">
                                        Saldo disponível na origem: {availableStock} UN
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="bg-white rounded-xl shadow border p-6 space-y-6 border-l-4 border-l-green-500">
                            <div className="font-bold text-green-600 uppercase text-xs border-b pb-2 flex items-center gap-2">
                                <MapPin size={14} /> Destino (Entrada)
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Filial</label>
                                    <select name="destBranchId" value={formData.destBranchId} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                        <option value="">Selecione...</option>
                                        {branches.map(b => <option key={b.id} value={b.id}>{b.descricao}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Depósito</label>
                                    <select name="destDepositoId" value={formData.destDepositoId} onChange={handleChange} className="w-full p-2 border rounded-lg disabled:bg-gray-100" disabled={!formData.destBranchId}>
                                        <option value="">Selecione...</option>
                                        {destDepositos.map(d => <option key={d.id} value={d.id}>{d.descricao}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow border p-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-secondary">Lote / Série (para ambos)</label>
                            <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Opcional" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-secondary">Documento / Justificativa</label>
                            <input type="text" name="referenceDocument" value={formData.referenceDocument} onChange={handleChange} className="w-full p-2 border rounded-lg font-mono" required placeholder="Ex: TR-001" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
