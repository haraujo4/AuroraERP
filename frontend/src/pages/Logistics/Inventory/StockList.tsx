import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Plus, Filter, ArrowRightLeft } from 'lucide-react';
import { inventoryService } from '../../../services/inventoryService';
import type { StockLevel } from '../../../types/inventory';
import { formatDate } from '../../../utils';

export function StockList() {
    const navigate = useNavigate();
    const [stocks, setStocks] = useState<StockLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        try {
            const data = await inventoryService.getAll();
            setStocks(data);
        } catch (error) {
            console.error('Failed to load stock levels:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStocks = stocks.filter(stock =>
        stock.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.depositoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stock.batchNumber && stock.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Header */}
            <div className="p-4 bg-white border-b border-border-secondary flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Package className="w-6 h-6 text-brand-primary" />
                        Gestão de Estoques
                    </h1>
                    <p className="text-text-secondary text-sm">Visualize o saldo de materiais por depósito e lote</p>
                </div>
                <button
                    onClick={() => navigate('/logistics/inventory/movement')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm"
                >
                    <ArrowRightLeft className="w-4 h-4" />
                    Novo Movimento
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-border-secondary bg-white/50 backdrop-blur-sm">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por material, depósito ou lote..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white shadow-sm transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-border-default rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors bg-white shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                            <p className="text-text-secondary animate-pulse">Carregando estoques...</p>
                        </div>
                    </div>
                ) : filteredStocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Nenhum registro de estoque encontrado</p>
                        <p className="text-sm">Realize uma movimentação de entrada para iniciar.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-border-default overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-secondary border-b border-border-default text-text-secondary text-xs uppercase font-semibold tracking-wider">
                                    <th className="p-4 w-16">#</th>
                                    <th className="p-4">Material</th>
                                    <th className="p-4">Depósito</th>
                                    <th className="p-4">Lote / Série</th>
                                    <th className="p-4 text-right">Quantidade</th>
                                    <th className="p-4">Última Atualização</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default">
                                {filteredStocks.map((stock, index) => (
                                    <tr key={stock.id} className="hover:bg-bg-primary/50 transition-colors group">
                                        <td className="p-4 text-text-tertiary text-sm font-mono">{index + 1}</td>
                                        <td className="p-4 font-medium text-text-primary">
                                            {stock.materialName}
                                        </td>
                                        <td className="p-4 text-text-secondary">
                                            {stock.depositoName}
                                        </td>
                                        <td className="p-4 text-text-secondary">
                                            {stock.batchNumber ? (
                                                <span className="bg-brand-secondary/10 text-brand-secondary px-2 py-1 rounded-md text-xs font-mono">
                                                    {stock.batchNumber}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4 text-right font-semibold text-text-primary">
                                            {stock.quantity}
                                        </td>
                                        <td className="p-4 text-text-tertiary text-sm">
                                            {formatDate(stock.lastUpdated)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
