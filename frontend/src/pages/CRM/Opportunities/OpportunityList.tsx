import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OpportunityService } from '../../../services/opportunityService';
import type { Opportunity } from '../../../types/crm-opportunities';
import { Plus, RefreshCw } from 'lucide-react';

export function OpportunityList() {
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOpportunities();
    }, []);

    const loadOpportunities = async () => {
        setLoading(true);
        try {
            const data = await OpportunityService.getAll();
            setOpportunities(data);
        } catch (error) {
            console.error("Failed to load opportunities", error);
        } finally {
            setLoading(false);
        }
    };

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Prospecting': return 'bg-blue-100 text-blue-800';
            case 'Qualification': return 'bg-indigo-100 text-indigo-800';
            case 'Proposal': return 'bg-yellow-100 text-yellow-800';
            case 'Negotiation': return 'bg-orange-100 text-orange-800';
            case 'ClosedWon': return 'bg-green-100 text-green-800';
            case 'ClosedLost': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-text-primary">Oportunidades</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={loadOpportunities} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/crm/opportunities/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Nova Oportunidade
                    </button>
                </div>
            </div>

            {/* Content / Table */}
            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Título</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Cliente / Lead</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Valor Est.</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Fechamento</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Probabilidade</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Etapa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : opportunities.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">Nenhuma oportunidade encontrada.</td>
                            </tr>
                        ) : (
                            opportunities.map((op) => (
                                <tr key={op.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-medium">{op.title}</td>
                                    <td className="p-3">
                                        {op.businessPartnerName ? (
                                            <div className="font-medium">{op.businessPartnerName} (BP)</div>
                                        ) : (
                                            <div className="text-text-secondary">{op.leadName} (Lead)</div>
                                        )}
                                    </td>
                                    <td className="p-3 font-mono">
                                        R$ {op.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-3">{new Date(op.closeDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-[100px]">
                                            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${op.probability}%` }}></div>
                                        </div>
                                        <span className="text-xs text-text-secondary mt-1 block">{op.probability}%</span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStageColor(op.stage)}`}>
                                            {op.stage}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
