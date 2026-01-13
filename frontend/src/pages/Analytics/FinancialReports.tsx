import React, { useState, useEffect } from 'react';
import {
    FileText, TrendingUp, DollarSign, PieChart,
    Calendar, Filter, Download, ArrowUpRight,
    BarChart3
} from 'lucide-react';
import { controladoriaService } from '../../services/controladoriaService';
import type { DreData, PerformanceData } from '../../services/controladoriaService';
import { cn } from '../../utils';

const FinancialReports: React.FC = () => {
    const [dre, setDre] = useState<DreData | null>(null);
    const [performance, setPerformance] = useState<PerformanceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [dreData, perfData] = await Promise.all([
                controladoriaService.getDre(dateRange.start, dateRange.end),
                controladoriaService.getCostCenterPerformance(dateRange.start, dateRange.end)
            ]);
            setDre(dreData);
            setPerformance(perfData);
        } catch (error) {
            console.error('Error fetching financial reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="p-6 space-y-8 bg-[#f8fafc] min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Relatórios Analíticos (KE30)</h1>
                    <p className="text-slate-500">Gestão financeira estratégica e análise de resultados</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                        <Calendar size={16} className="text-slate-400" />
                        <input
                            type="date"
                            className="bg-transparent border-none text-sm font-medium focus:ring-0"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-slate-300">|</span>
                        <input
                            type="date"
                            className="bg-transparent border-none text-sm font-medium focus:ring-0"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                    <button onClick={fetchData} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Filter size={18} />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Receita Líquida', value: dre?.netRevenue || 0, icon: TrendingUp, color: 'emerald' },
                    { label: 'Gross Profit', value: dre?.grossProfit || 0, icon: DollarSign, color: 'indigo' },
                    { label: 'EBITDA', value: dre?.ebitda || 0, icon: BarChart3, color: 'blue' },
                    { label: 'Lucro Líquido', value: dre?.netProfit || 0, icon: FileText, color: 'teal' }
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2.5 rounded-xl", `bg-${kpi.color}-50 text-${kpi.color}-600`)}>
                                <kpi.icon size={22} />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight size={12} />
                                <span>12%</span>
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</h3>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(kpi.value)}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* DRE - Statement of Income */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-200">
                                    <FileText size={18} className="text-indigo-600" />
                                </div>
                                <h2 className="font-bold text-slate-800">DRE - Demonstrativo de Resultados</h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Conta Contábil</th>
                                        <th className="px-6 py-3">Descrição</th>
                                        <th className="px-6 py-3 text-right">Saldo</th>
                                        <th className="px-6 py-3 text-right">% Rec.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 italic">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">Carregando dados...</td></tr>
                                    ) : dre?.lines.map((line, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 group transition-colors">
                                            <td className="px-6 py-3 text-sm font-mono text-slate-500">{line.accountCode}</td>
                                            <td className="px-6 py-3 text-sm font-medium text-slate-700">{line.accountName}</td>
                                            <td className={cn("px-6 py-3 text-sm font-bold text-right", line.isNegative ? "text-red-500" : "text-emerald-600")}>
                                                {formatCurrency(line.amount)}
                                            </td>
                                            <td className="px-6 py-3 text-xs text-right text-slate-400">
                                                {dre.netRevenue > 0 ? ((line.amount / dre.netRevenue) * 100).toFixed(1) + '%' : '0.0%'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-900 text-white font-bold">
                                    <tr>
                                        <td className="px-6 py-4" colSpan={2}>LUCRO LÍQUIDO DO PERÍODO</td>
                                        <td className="px-6 py-4 text-right text-emerald-400">{formatCurrency(dre?.netProfit || 0)}</td>
                                        <td className="px-6 py-4 text-right">100%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Side Panels - Performance */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Cost Center Analysis */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-800">Despesas por Centro de Custo</h2>
                            <PieChart size={18} className="text-slate-400" />
                        </div>

                        <div className="space-y-5">
                            {performance.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700">{item.name}</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(item.actual)}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((item.actual / (item.budget || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                        <span>Orçado: {formatCurrency(item.budget)}</span>
                                        <span className={cn(item.variance < 0 ? "text-red-500" : "text-emerald-500")}>
                                            Var: {formatCurrency(item.variance)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
                        <h2 className="font-bold text-lg mb-2">Simulador de Resultado</h2>
                        <p className="text-indigo-100 text-xs mb-6 opacity-80">
                            Simule o impacto de cortes de gastos ou aumento de volume de vendas na margem líquida.
                        </p>
                        <button className="w-full py-2.5 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                            Iniciar Simulação
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReports;
