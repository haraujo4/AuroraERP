import { useState, useEffect } from 'react';
import { X, Calculator, ArrowRight } from 'lucide-react';
import type { DreData } from '../../../services/controladoriaService';

interface SimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
    baseData: DreData | null;
}

export function SimulationModal({ isOpen, onClose, baseData }: SimulationModalProps) {
    const [revenueChange, setRevenueChange] = useState(0);
    const [costChange, setCostChange] = useState(0);
    const [simulatedData, setSimulatedData] = useState<DreData | null>(null);

    useEffect(() => {
        if (isOpen && baseData) {
            calculateSimulation();
        }
    }, [isOpen, baseData, revenueChange, costChange]);

    const calculateSimulation = () => {
        if (!baseData) return;

        const revFactor = 1 + (revenueChange / 100);
        const costFactor = 1 + (costChange / 100);

        // Simple simulation logic
        // Revenue scales with revenueChange
        // COGS and Expenses scale with costChange (variable costs assumption) or mixed? 
        // For simplicity: COGS scales with costChange, Expenses scale with costChange.
        // Tax usually scales with Revenue.

        const newGrossRevenue = baseData.grossRevenue * revFactor;
        const newTaxes = baseData.taxes * revFactor; // Assuming taxes are % of revenue
        const newNetRevenue = newGrossRevenue - newTaxes;

        const newCogs = baseData.cogs * costFactor;
        const newGrossProfit = newNetRevenue - newCogs;

        const newOperatingExpenses = baseData.operatingExpenses * costFactor;

        // EBITDA = Gross Profit - Operating Expenses (excluding depreciation/amortization which we don't have separated here, assuming OpEx includes everything for now or follows EBITDA definition)
        // In our service, EBITDA is passed directly. Let's recalculate it.
        // Base Formula: EBITDA = Net Revenue - COGS - OpEx (Cash based) + Depreciation
        // Here we just have the aggregates. 
        const newEbitda = newGrossProfit - newOperatingExpenses;

        // Net Profit
        const newNetProfit = newEbitda; // Simplified, ignoring Interest/Tax on Profit for this quick sim

        setSimulatedData({
            ...baseData,
            grossRevenue: newGrossRevenue,
            taxes: newTaxes,
            netRevenue: newNetRevenue,
            cogs: newCogs,
            grossProfit: newGrossProfit,
            operatingExpenses: newOperatingExpenses,
            ebitda: newEbitda,
            netProfit: newNetProfit
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatPercent = (val: number) => {
        return val > 0 ? `+${val}%` : `${val}%`;
    };

    if (!isOpen || !baseData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Simulador de Resultados</h3>
                            <p className="text-sm text-gray-500">Projete cenários alterando premissas básicas</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                            <h4 className="font-semibold text-gray-900">Premissas</h4>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Variação de Receita</span>
                                    <span className="text-indigo-600 font-bold">{formatPercent(revenueChange)}</span>
                                </label>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    step="1"
                                    value={revenueChange}
                                    onChange={(e) => setRevenueChange(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>-50%</span>
                                    <span>0%</span>
                                    <span>+50%</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Variação de Custos/Despesas</span>
                                    <span className="text-red-500 font-bold">{formatPercent(costChange)}</span>
                                </label>
                                <input
                                    type="range"
                                    min="-50"
                                    max="50"
                                    step="1"
                                    value={costChange}
                                    onChange={(e) => setCostChange(Number(e.target.value))}
                                    className="w-full accent-red-500"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>-50%</span>
                                    <span>0%</span>
                                    <span>+50%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h5 className="font-bold text-blue-800 mb-2 text-sm">Resumo do Impacto</h5>
                            <p className="text-sm text-blue-600">
                                Uma variação de <strong>{revenueChange}%</strong> na receita combinada com <strong>{costChange}%</strong> nos custos resultaria em um impacto de:
                            </p>
                            <div className="mt-3 text-2xl font-bold text-blue-900">
                                {formatCurrency((simulatedData?.netProfit || 0) - baseData.netProfit)}
                            </div>
                            <p className="text-xs text-blue-500">no Resultado Líquido</p>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="lg:col-span-8">
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Indicador</th>
                                        <th className="px-4 py-3 text-right">Atual</th>
                                        <th className="px-4 py-3 text-right text-indigo-600 bg-indigo-50/50">Simulado</th>
                                        <th className="px-4 py-3 text-right">Variação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { label: 'Receita Bruta', base: baseData.grossRevenue, sim: simulatedData?.grossRevenue },
                                        { label: 'Impostos', base: baseData.taxes, sim: simulatedData?.taxes },
                                        { label: 'Receita Líquida', base: baseData.netRevenue, sim: simulatedData?.netRevenue, bold: true },
                                        { label: 'CMV / Custos', base: baseData.cogs, sim: simulatedData?.cogs },
                                        { label: 'Lucro Bruto', base: baseData.grossProfit, sim: simulatedData?.grossProfit, bold: true },
                                        { label: 'Despesas Operacionais', base: baseData.operatingExpenses, sim: simulatedData?.operatingExpenses },
                                        { label: 'EBITDA', base: baseData.ebitda, sim: simulatedData?.ebitda, highlight: true },
                                        { label: 'Lucro Líquido', base: baseData.netProfit, sim: simulatedData?.netProfit, highlight: true }
                                    ].map((row, idx) => {
                                        const baseVal = row.base || 0;
                                        const simVal = row.sim || 0;
                                        const diff = simVal - baseVal;
                                        const percentDiff = baseVal !== 0 ? (diff / Math.abs(baseVal)) * 100 : 0;

                                        return (
                                            <tr key={idx} className={row.highlight ? 'bg-gray-50 font-bold' : ''}>
                                                <td className={`px-4 py-3 ${row.bold ? 'font-bold' : ''}`}>{row.label}</td>
                                                <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(baseVal)}</td>
                                                <td className="px-4 py-3 text-right font-medium text-indigo-700 bg-indigo-50/30">{formatCurrency(simVal)}</td>
                                                <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                                                    {diff !== 0 && (
                                                        <>
                                                            <span className={diff > 0 ? 'text-emerald-600' : 'text-red-500'}>
                                                                {diff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                                                            </span>
                                                            <ArrowRight size={12} className={diff > 0 ? 'text-emerald-600 -rotate-45' : 'text-red-500 rotate-45'} />
                                                        </>
                                                    )}
                                                    {diff === 0 && <span className="text-gray-400">-</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
