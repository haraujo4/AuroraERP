import React, { useState, useEffect } from 'react';
import { Save, ArrowRight, Calendar, Package, Truck, Info } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

interface Material {
    id: string;
    code: string;
    description: string;
    unitOfMeasure: string;
    isBatchManaged: boolean;
}

interface Deposito {
    id: string;
    descricao: string;
}

const MigoPage: React.FC = () => {
    const [operation, setOperation] = useState('A01'); // A01=Receipt, A07=Issue
    const [refDoc, setRefDoc] = useState('');
    const [materials, setMaterials] = useState<Material[]>([]);
    const [depositos, setDepositos] = useState<Deposito[]>([]);

    // Form State
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [quantity, setQuantity] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [selectedDepositoId, setSelectedDepositoId] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [manufDate, setManufDate] = useState('');
    const [expDate, setExpDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            const [matRes, depRes] = await Promise.all([
                api.get('/logistics/materials'),
                api.get('/organization/warehouses')
            ]);
            setMaterials(matRes.data);
            setDepositos(depRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar dados mestres');
        }
    };

    const getSelectedMaterial = () => materials.find(m => m.id === selectedMaterialId);

    const handlePost = async () => {
        try {
            const material = getSelectedMaterial();
            if (!material) return;

            setLoading(true);

            const payload = {
                materialId: selectedMaterialId,
                depositoId: selectedDepositoId,
                type: operation === 'A01' ? 'In' : 'Out',
                quantity: quantity,
                unitPrice: unitPrice,
                referenceDocument: refDoc,
                batchNumber: material.isBatchManaged ? batchNumber : null,
                manufacturingDate: material.isBatchManaged && operation === 'A01' && manufDate ? new Date(manufDate) : null,
                expirationDate: material.isBatchManaged && operation === 'A01' && expDate ? new Date(expDate) : null
            };

            await api.post('/logistics/inventory/movement', payload);
            toast.success('Movimento postado com sucesso!');

            // Clear form
            setQuantity(0);
            setBatchNumber('');
            setManufDate('');
            setExpDate('');
            setRefDoc('');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data || 'Erro ao postar movimento');
        } finally {
            setLoading(false);
        }
    };

    const selectedMat = getSelectedMaterial();
    const isBatchRequired = selectedMat?.isBatchManaged || false;
    const isReceipt = operation === 'A01';

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Header seguindo padrão do MaterialForm */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">MIGO - Movimentação de Mercadorias</h1>
                    <p className="text-sm text-text-secondary">Entradas de Mercadoria e Saídas de Estoque</p>
                </div>
                <button
                    onClick={handlePost}
                    disabled={loading || !selectedMaterialId || quantity <= 0 || !selectedDepositoId || (isBatchRequired && !batchNumber)}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Processando...' : 'Postar Movimento'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Header Data Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-border-default p-6">
                        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2 pb-2 border-b border-border-default">
                            <ArrowRight className="w-5 h-5 text-text-secondary" /> Cabeçalho do Documento
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Operação</label>
                                <select
                                    value={operation}
                                    onChange={(e) => setOperation(e.target.value)}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none bg-white text-text-primary"
                                >
                                    <option value="A01">A01 - Entrada de Mercadoria (Recebimento)</option>
                                    <option value="A07">A07 - Saída de Mercadoria (Baixa)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Documento de Referência</label>
                                <input
                                    type="text"
                                    value={refDoc}
                                    onChange={(e) => setRefDoc(e.target.value)}
                                    placeholder="Ex: PO-1234 ou NF-001"
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-text-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Item Detail Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-border-default p-6">
                        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2 pb-2 border-b border-border-default">
                            <Package className="w-5 h-5 text-text-secondary" /> Dados do Item
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Material</label>
                                <select
                                    value={selectedMaterialId}
                                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none bg-white text-text-primary"
                                >
                                    <option value="">Selecione o Material...</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.code} - {m.description}
                                        </option>
                                    ))}
                                </select>
                                {selectedMat && (
                                    <div className="mt-2 text-xs flex gap-2 items-center">
                                        <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${selectedMat.isBatchManaged ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {selectedMat.isBatchManaged ? <Truck className="w-3 h-3" /> : null}
                                            {selectedMat.isBatchManaged ? 'Controlado por Lote' : 'Sem Lote'}
                                        </span>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                            UM: {selectedMat.unitOfMeasure}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Local de Armazenagem (Depósito)</label>
                                <select
                                    value={selectedDepositoId}
                                    onChange={(e) => setSelectedDepositoId(e.target.value)}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none bg-white text-text-primary"
                                >
                                    <option value="">Selecione o Depósito...</option>
                                    {depositos.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.descricao}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Quantidade</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-text-primary"
                                />
                            </div>

                            {isReceipt && (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Preço Unitário</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-text-tertiary">R$</span>
                                        <input
                                            type="number"
                                            value={unitPrice}
                                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-text-primary"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BATCH MANAGEMENT SECTION */}
                        {isBatchRequired && (
                            <div className="bg-gray-50 rounded-lg p-5 border border-border-default mt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Truck className="w-4 h-4" /> Gestão de Lotes
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Lote <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={batchNumber}
                                            onChange={(e) => setBatchNumber(e.target.value)}
                                            placeholder="Ex: LOTE-001"
                                            className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    {isReceipt && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-gray-400" /> Data de Fabricação
                                                </label>
                                                <input
                                                    type="date"
                                                    value={manufDate}
                                                    onChange={(e) => setManufDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none bg-white text-text-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-gray-400" /> Data de Validade
                                                </label>
                                                <input
                                                    type="date"
                                                    value={expDate}
                                                    onChange={(e) => setExpDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none bg-white text-text-secondary"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                {isReceipt && (
                                    <div className="mt-3 flex items-start gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <p>
                                            Um novo registro de lote será criado automaticamente com estas datas.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MigoPage;
