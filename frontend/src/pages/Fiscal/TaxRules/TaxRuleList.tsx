import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import fiscalService from '../../../services/fiscalService';
import type { TaxRule } from '../../../types/fiscal';

const TaxRuleList: React.FC = () => {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [rules, setRules] = useState<TaxRule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const data = await fiscalService.getAllRules();
            setRules(data);
        } catch (error) {
            console.error('Error loading tax rules', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRules = rules.filter(rule =>
        searchTerm === '' ||
        rule.sourceState.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.destState.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rule.ncmCode && rule.ncmCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        rule.operationType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Regras Fiscais (Tax Engine)</h1>
                    <p className="text-xs text-text-secondary">Configuração de taxas por Estado e NCM</p>
                </div>
                <button
                    onClick={() => navigate('/fiscal/tax-rules/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary shadow-sm"
                >
                    <Plus size={16} />
                    Nova Regra
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-border-default overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-bg-secondary border-b border-border-default">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Origem</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Destino</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">NCM</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Operação</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">CFOP</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">ICMS</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">IPI</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">PIS/COFINS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRules.map((rule) => (
                                    <tr key={rule.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 font-medium text-sm">{rule.sourceState}</td>
                                        <td className="px-4 py-3 font-medium text-sm">{rule.destState}</td>
                                        <td className="px-4 py-3 text-sm">{rule.ncmCode || 'Todos'}</td>
                                        <td className="px-4 py-3 text-sm">{rule.operationType}</td>
                                        <td className="px-4 py-3 text-sm">{rule.cfop}</td>
                                        <td className="px-4 py-3 text-blue-600 text-sm font-bold">{rule.icmsRate}%</td>
                                        <td className="px-4 py-3 text-sm">{rule.ipiRate}%</td>
                                        <td className="px-4 py-3 text-sm">{rule.pisRate}% / {rule.cofinsRate}%</td>
                                    </tr>
                                ))}
                                {filteredRules.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-text-secondary">
                                            Nenhuma regra fiscal encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaxRuleList;
