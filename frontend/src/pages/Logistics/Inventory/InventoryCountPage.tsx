import React, { useState } from 'react';
import { Save, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data Types
interface InventoryItem {
    id: string;
    materialCode: string;
    materialName: string;
    batch?: string;
    unit: string;
    countedQuantity: number | '';
    isZeroCount: boolean;
}

const InventoryCountPage: React.FC = () => {
    const [docId, setDocId] = useState('');
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [docLoaded, setDocLoaded] = useState(false);

    const handleSearch = async () => {
        if (!docId) return;
        setLoading(true);
        // Simulate fetching items
        setTimeout(() => {
            setItems([
                { id: '1', materialCode: 'MAT-001', materialName: 'Parafuso Sextavado', unit: 'UN', countedQuantity: '', isZeroCount: false },
                { id: '2', materialCode: 'MAT-002', materialName: 'Chapa de Aço', batch: 'LOTE-55', unit: 'KG', countedQuantity: '', isZeroCount: false },
            ]);
            setDocLoaded(true);
            setLoading(false);
        }, 800);
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate save
        setTimeout(() => {
            toast.success('Contagem salva com sucesso!');
            setLoading(false);
            setItems([]);
            setDocLoaded(false);
            setDocId('');
        }, 1000);
    };

    const updateItem = (id: string, field: keyof InventoryItem, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                if (field === 'isZeroCount' && value === true) {
                    return { ...item, [field]: value, countedQuantity: 0 };
                }
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Inserir Contagem (MI04)</h1>
                    <p className="text-sm text-text-secondary">Digite as quantidades contadas fisicamente</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!docLoaded || loading}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    Salvar Contagem
                </button>
            </div>

            <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-border-default flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Número do Documento de Inventário</label>
                        <input
                            type="text"
                            value={docId}
                            onChange={(e) => setDocId(e.target.value)}
                            placeholder="Ex: INV-2026-001"
                            className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={!docId || loading}
                        className="bg-gray-100 text-text-primary px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-200"
                    >
                        <Search className="w-4 h-4" /> Buscar
                    </button>
                </div>

                {/* Items Table */}
                {docLoaded && (
                    <div className="bg-white rounded-xl shadow-sm border border-border-default overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-border-default text-xs uppercase text-text-secondary font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Item</th>
                                    <th className="px-6 py-3">Material</th>
                                    <th className="px-6 py-3">Lote</th>
                                    <th className="px-6 py-3 text-center">Contagem Zero</th>
                                    <th className="px-6 py-3 text-right">Qtd. Contada</th>
                                    <th className="px-6 py-3">UM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default">
                                {items.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-text-secondary">{idx + 1}</td>
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-text-primary">{item.materialCode}</div>
                                            <div className="text-xs text-text-secondary">{item.materialName}</div>
                                        </td>
                                        <td className="px-6 py-3 text-text-secondary">{item.batch || '-'}</td>
                                        <td className="px-6 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={item.isZeroCount}
                                                onChange={(e) => updateItem(item.id, 'isZeroCount', e.target.checked)}
                                                className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <input
                                                type="number"
                                                disabled={item.isZeroCount}
                                                value={item.countedQuantity}
                                                onChange={(e) => updateItem(item.id, 'countedQuantity', Number(e.target.value))}
                                                className="w-32 text-right px-2 py-1 border border-border-default rounded focus:ring-2 focus:ring-brand-primary outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                                placeholder={item.isZeroCount ? "0" : "..."}
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-text-secondary text-sm">{item.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryCountPage;
