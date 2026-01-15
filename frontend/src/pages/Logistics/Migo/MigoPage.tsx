import React, { useState, useEffect } from 'react';
import { Save, ArrowRight, Calendar, Package, Truck } from 'lucide-react';
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

    useEffect(() => {
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            const [matRes, depRes] = await Promise.all([
                api.get('/logistics/materials'),
                api.get('/organization/depositos')
            ]);
            setMaterials(matRes.data);
            setDepositos(depRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Error loading master data');
        }
    };

    const getSelectedMaterial = () => materials.find(m => m.id === selectedMaterialId);

    const handlePost = async () => {
        try {
            const material = getSelectedMaterial();
            if (!material) return;

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
            toast.success('Movement Posted Successfully');

            // Clear form
            setQuantity(0);
            setBatchNumber('');
            setManufDate('');
            setExpDate('');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data || 'Error posting movement');
        }
    };

    const selectedMat = getSelectedMaterial();
    const isBatchRequired = selectedMat?.isBatchManaged || false;
    const isReceipt = operation === 'A01';

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">MIGO - Movimentação de Mercadorias</h1>
                    <p className="text-gray-500">Receipts, Issues, and Transfers</p>
                </div>
                <button
                    onClick={handlePost}
                    disabled={!selectedMaterialId || quantity <= 0 || !selectedDepositoId || (isBatchRequired && !batchNumber)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Postar Movimento
                </button>
            </div>

            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-gray-400" /> Header Data
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                        <select
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <MenuItem value="A01">A01 - Goods Receipt (Entrada)</MenuItem>
                            <MenuItem value="A07">A07 - Goods Issue (Saída)</MenuItem>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Document</label>
                        <input
                            type="text"
                            value={refDoc}
                            onChange={(e) => setRefDoc(e.target.value)}
                            placeholder="e.g. PO-123 or INV-001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Item Detail Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" /> Item Detail
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                        <select
                            value={selectedMaterialId}
                            onChange={(e) => setSelectedMaterialId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <MenuItem value="">Select Material...</MenuItem>
                            {materials.map(m => (
                                <MenuItem key={m.id} value={m.id}>
                                    {m.code} - {m.description}
                                </MenuItem>
                            ))}
                        </select>
                        {selectedMat && (
                            <div className="mt-2 text-xs flex gap-2">
                                <span className={`px-2 py-0.5 rounded-full ${selectedMat.isBatchManaged ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {selectedMat.isBatchManaged ? 'Batch Managed' : 'No Batch'}
                                </span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    Unit: {selectedMat.unitOfMeasure}
                                </span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location (Deposito)</label>
                        <select
                            value={selectedDepositoId}
                            onChange={(e) => setSelectedDepositoId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <MenuItem value="">Select Deposito...</MenuItem>
                            {depositos.map(d => (
                                <MenuItem key={d.id} value={d.id}>
                                    {d.descricao}
                                </MenuItem>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {isReceipt && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                <input
                                    type="number"
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* BATCH MANAGEMENT SECTION */}
                {isBatchRequired && (
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Truck className="w-4 h-4" /> Batch Management
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={batchNumber}
                                    onChange={(e) => setBatchNumber(e.target.value)}
                                    placeholder="LOT-XXXX"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                            {isReceipt && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-gray-400" /> Manufacturing Date
                                        </label>
                                        <input
                                            type="date"
                                            value={manufDate}
                                            onChange={(e) => setManufDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-gray-400" /> Expiration Date (SLED)
                                        </label>
                                        <input
                                            type="date"
                                            value={expDate}
                                            onChange={(e) => setExpDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        {isReceipt && (
                            <p className="mt-2 text-xs text-gray-500">
                                * New batch will be created automatically with these dates.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple helper component for select options instead of MUI MenuItem
const MenuItem = ({ value, children }: { value: string | number, children: React.ReactNode }) => (
    <option value={value}>{children}</option>
);

export default MigoPage;
