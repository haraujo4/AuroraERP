import React, { useState } from 'react';
import {
    Play, ShieldAlert, Factory,
    ShoppingCart, Calendar, Info,
    ChevronRight, Download
} from 'lucide-react';
import { mrpService } from '../../services/mrpService';
import type { MRPResult } from '../../services/mrpService';
import { cn } from '../../utils';

const MRPRun: React.FC = () => {
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

    return (
        <div className="p-6 space-y-8 bg-[#f8fafc] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Execução do MRP (MD01)</h1>
                    <p className="text-slate-500">Cálculo de necessidades e recomendações de suprimento</p>
                </div>

                <div className="flex items-center gap-3">
                    {lastRun && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 font-medium">
                            <Calendar size={14} />
                            Última execução: {lastRun}
                        </div>
                    )}
                    <button
                        onClick={handleRunMRP}
                        disabled={isLoading}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
                            isLoading
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95"
                        )}
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                        ) : <Play size={18} fill="currentColor" />}
                        {isLoading ? "Processando..." : "Rodar MRP Agora"}
                    </button>
                </div>
            </div>

            {!result && !isLoading && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
                    <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                        <ShieldAlert size={40} className="text-slate-300" />
                    </div>
                    <div className="max-w-sm mx-auto">
                        <h2 className="text-xl font-bold text-slate-800">Pronto para Planejar?</h2>
                        <p className="text-slate-500 mt-2">Clique no botão acima para rodar o motor de cálculo e gerar recomendações baseadas no seu estoque e demanda.</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Recomendações</span>
                                <Info size={16} className="text-slate-300" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">{result.recommendations.length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordens de Compra</span>
                                <ShoppingCart size={16} className="text-amber-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {result.recommendations.filter(r => r.actionType === 'PurchaseRequisition').length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordens de Produção</span>
                                <Factory size={16} className="text-indigo-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900">
                                {result.recommendations.filter(r => r.actionType === 'ProductionOrder').length}
                            </div>
                        </div>
                    </div>

                    {/* Recommendations Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800">Ações Recomendadas</h2>
                            <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                                <Download size={14} />
                                Exportar Plano
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Material</th>
                                        <th className="px-6 py-3">Quantidade</th>
                                        <th className="px-6 py-3">Data Necessária</th>
                                        <th className="px-6 py-3">Tipo de Ação</th>
                                        <th className="px-6 py-3">Motivo</th>
                                        <th className="px-6 py-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {result.recommendations.map((rec, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 group transition-colors italic">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all text-[10px] font-bold">
                                                        MAT
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{rec.materialCode}</div>
                                                        <div className="text-[10px] text-slate-400 font-medium">{rec.materialDescription}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-700">{rec.quantity} UN</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {new Date(rec.requiredDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                    getActionColor(rec.actionType)
                                                )}>
                                                    {getActionIcon(rec.actionType)}
                                                    {rec.actionType === 'ProductionOrder' ? 'Produzir' : 'Comprar'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-slate-500 max-w-xs truncate" title={rec.reason}>
                                                    {rec.reason}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group-hover:translate-x-1">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MRPRun;
