import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Play, ShieldAlert, Factory,
    ShoppingCart, Calendar, Info,
    ChevronRight, Download
} from 'lucide-react';
import { mrpService } from '../../services/mrpService';
import type { MRPResult } from '../../services/mrpService';
import { cn } from '../../utils';

const MRPRun: React.FC = () => {
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [result, setResult] = useState<MRPResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastRun, setLastRun] = useState<string | null>(null);

    const handleRunMRP = async () => {
        setIsLoading(true);
        try {
            const data = await mrpService.runMRP();
            setResult(data);
            setLastRun(new Date().toLocaleString());
        } catch (error) {
            console.error('Error running MRP:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActionIcon = (type: string) => {
        return type === 'ProductionOrder' ? <Factory size={16} /> : <ShoppingCart size={16} />;
    };

    const getActionColor = (type: string) => {
        return type === 'ProductionOrder' ? 'text-indigo-600 bg-indigo-50' : 'text-amber-600 bg-amber-50';
    };

    // Filter recommendations based on global search term
    const filteredRecommendations = result?.recommendations.filter(rec =>
        searchTerm === '' ||
        rec.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.materialDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Standard Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Execução do MRP (MD01)</h1>
                    <p className="text-xs text-text-secondary">Cálculo de necessidades e recomendações de suprimento</p>
                </div>

                <div className="flex items-center gap-3">
                    {lastRun && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border-default rounded-lg text-xs text-text-secondary font-medium">
                            <Calendar size={14} />
                            Última: {lastRun}
                        </div>
                    )}
                    <button
                        onClick={handleRunMRP}
                        disabled={isLoading}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-sm",
                            isLoading
                                ? "bg-bg-subtle text-text-disabled cursor-not-allowed border border-border-default"
                                : "bg-brand-primary text-white hover:bg-brand-secondary"
                        )}
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                        ) : <Play size={16} fill="currentColor" />}
                        {isLoading ? "Processando..." : "Rodar MRP"}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {!result && !isLoading && (
                    <div className="bg-white border-2 border-dashed border-border-default rounded-lg p-12 text-center space-y-4 h-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center">
                            <ShieldAlert size={32} className="text-text-secondary" />
                        </div>
                        <div className="max-w-sm mx-auto">
                            <h2 className="text-lg font-bold text-text-primary">Pronto para Planejar?</h2>
                            <p className="text-text-secondary mt-1 text-sm">Clique no botão "Rodar MRP" para gerar recomendações baseadas no seu estoque e demanda.</p>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="space-y-6">
                        {/* Summary Cards - Keeping original helpful visualization but standardizing styles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-border-default shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total</span>
                                    <Info size={16} className="text-text-disabled" />
                                </div>
                                <div className="text-2xl font-bold text-text-primary">{result.recommendations.length}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-border-default shadow-sm border-l-4 border-l-amber-500">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Ordens de Compra</span>
                                    <ShoppingCart size={16} className="text-amber-500" />
                                </div>
                                <div className="text-2xl font-bold text-text-primary">
                                    {result.recommendations.filter(r => r.actionType === 'PurchaseRequisition').length}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-border-default shadow-sm border-l-4 border-l-indigo-500">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Ordens de Produção</span>
                                    <Factory size={16} className="text-indigo-500" />
                                </div>
                                <div className="text-2xl font-bold text-text-primary">
                                    {result.recommendations.filter(r => r.actionType === 'ProductionOrder').length}
                                </div>
                            </div>
                        </div>

                        {/* Recommendations Table */}
                        <div className="bg-white rounded-lg border border-border-default shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-border-default flex items-center justify-between bg-bg-secondary">
                                <h2 className="font-bold text-text-primary text-sm">Ações Recomendadas</h2>
                                <button className="flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-secondary">
                                    <Download size={14} />
                                    Exportar
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-bg-subtle border-b border-border-default text-xs text-text-secondary font-bold uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Material</th>
                                            <th className="px-4 py-3">Quantidade</th>
                                            <th className="px-4 py-3">Data Necessária</th>
                                            <th className="px-4 py-3">Tipo de Ação</th>
                                            <th className="px-4 py-3">Motivo</th>
                                            <th className="px-4 py-3 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-default">
                                        {filteredRecommendations?.map((rec, idx) => (
                                            <tr key={idx} className="hover:bg-bg-subtle group transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="text-sm font-medium text-text-primary">{rec.materialCode}</div>
                                                            <div className="text-xs text-text-secondary">{rec.materialDescription}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold text-text-primary">
                                                    {rec.quantity} UN
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                        <Calendar size={14} className="text-text-disabled" />
                                                        {new Date(rec.requiredDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                        getActionColor(rec.actionType)
                                                    )}>
                                                        {getActionIcon(rec.actionType)}
                                                        {rec.actionType === 'ProductionOrder' ? 'Produzir' : 'Comprar'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs text-text-secondary max-w-xs truncate" title={rec.reason}>
                                                        {rec.reason}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button className="p-1 text-text-disabled hover:text-brand-primary transition-colors">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredRecommendations?.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-text-secondary text-sm">
                                                    Nenhuma recomendação encontrada para os filtros aplicados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MRPRun;
