import React, { useState } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface DiffItem {
    id: string;
    materialCode: string;
    materialName: string;
    bookQuantity: number;
    countedQuantity: number;
    difference: number;
    valueDiff: number;
    unit: string;
}

const InventoryPostPage: React.FC = () => {
    const [docId, setDocId] = useState('');
    const [items, setItems] = useState<DiffItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [docLoaded, setDocLoaded] = useState(false);

    const handleSearch = async () => {
        if (!docId) return;
        setLoading(true);
        // Simulate fetching differences
        setTimeout(() => {
            setItems([
                { id: '1', materialCode: 'MAT-001', materialName: 'Parafuso Sextavado', bookQuantity: 100, countedQuantity: 98, difference: -2, valueDiff: -1.50, unit: 'UN' },
                { id: '2', materialCode: 'MAT-002', materialName: 'Chapa de Aço', bookQuantity: 50, countedQuantity: 50, difference: 0, valueDiff: 0, unit: 'KG' },
                { id: '3', materialCode: 'MAT-003', materialName: 'Cola Industrial', bookQuantity: 10, countedQuantity: 12, difference: 2, valueDiff: 45.00, unit: 'L' },
            ]);
            setDocLoaded(true);
            setLoading(false);
        }, 800);
    };

    const handlePost = async () => {
        setLoading(true);
        setTimeout(() => {
            toast.success('Diferenças lançadas com sucesso!');
            setLoading(false);
            setItems([]);
            setDocLoaded(false);
            setDocId('');
        }, 1000);
    };

    const totalValueDiff = items.reduce((acc, curr) => acc + curr.valueDiff, 0);

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Lançar Diferenças (MI07)</h1>
                    <p className="text-sm text-text-secondary">Análise e contabilização de perdas/ganhos</p>
                </div>
                <button
                    onClick={handlePost}
                    disabled={!docLoaded || loading}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    <CheckCircle className="w-4 h-4" />
                    Aprovar e Lançar
                </button>
            </div>

            <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-border-default flex gap-4 items-center">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Número do Documento</label>
                        <input
                            type="text"
                            value={docId}
                            onChange={(e) => setDocId(e.target.value)}
                            placeholder="Ex: INV-2026-001"
                            className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                    <div className="flex self-end">
                        <button
                            onClick={handleSearch}
                            disabled={!docId || loading}
                            className="bg-gray-100 text-text-primary px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-200 h-[42px]" // aligned height
                        >
                            <Search className="w-4 h-4" /> Buscar
                        </button>
                    </div>
                </div>

                {docLoaded && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-border-default shadow-sm">
                                <p className="text-sm text-text-secondary">Total Itens</p>
                                <p className="text-2xl font-bold text-text-primary">{items.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-border-default shadow-sm">
                                <p className="text-sm text-text-secondary">Itens com Divergência</p>
                                <p className="text-2xl font-bold text-orange-500">{items.filter(i => i.difference !== 0).length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-border-default shadow-sm">
                                <p className="text-sm text-text-secondary">Impacto Financeiro</p>
                                <p className={`text-2xl font-bold ${totalValueDiff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    R$ {totalValueDiff.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Analysis Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-border-default overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-border-default text-xs uppercase text-text-secondary font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Item</th>
                                        <th className="px-6 py-3">Material</th>
                                        <th className="px-6 py-3 text-right">Saldo Contábil</th>
                                        <th className="px-6 py-3 text-right">Contagem</th>
                                        <th className="px-6 py-3 text-right">Diferença</th>
                                        <th className="px-6 py-3 text-right">Valor Est.</th>
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
                                            <td className="px-6 py-3 text-right text-text-secondary">{item.bookQuantity} {item.unit}</td>
                                            <td className="px-6 py-3 text-right font-medium">{item.countedQuantity} {item.unit}</td>
                                            <td className="px-6 py-3 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.difference === 0 ? 'bg-gray-100 text-gray-800' :
                                                    item.difference > 0 ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.difference > 0 ? '+' : ''}{item.difference} {item.unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right text-sm">
                                                R$ {Math.abs(item.valueDiff).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InventoryPostPage;
