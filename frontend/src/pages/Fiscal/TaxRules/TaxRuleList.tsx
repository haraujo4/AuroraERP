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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Regras Fiscais (Tax Engine)</h1>
                    <p className="text-sm text-gray-500">Configuração de taxas por Estado e NCM</p>
                </div>
                <button
                    onClick={() => navigate('/fiscal/tax-rules/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Nova Regra
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Origem</th>
                            <th className="px-6 py-4">Destino</th>
                            <th className="px-6 py-4">NCM</th>
                            <th className="px-6 py-4">Operação</th>
                            <th className="px-6 py-4">CFOP</th>
                            <th className="px-6 py-4">ICMS</th>
                            <th className="px-6 py-4">IPI</th>
                            <th className="px-6 py-4">PIS/COFINS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{rule.sourceState}</td>
                                <td className="px-6 py-4 font-medium">{rule.destState}</td>
                                <td className="px-6 py-4">{rule.ncmCode || 'Todos'}</td>
                                <td className="px-6 py-4">{rule.operationType}</td>
                                <td className="px-6 py-4">{rule.cfop}</td>
                                <td className="px-6 py-4 text-blue-600">{rule.icmsRate}%</td>
                                <td className="px-6 py-4">{rule.ipiRate}%</td>
                                <td className="px-6 py-4">{rule.pisRate}% / {rule.cofinsRate}%</td>
                            </tr>
                        ))}
                        {filteredRules.length === 0 && !loading && (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                                    Nenhuma regra fiscal configurada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaxRuleList;
