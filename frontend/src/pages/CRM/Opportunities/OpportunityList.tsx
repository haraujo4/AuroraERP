import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OpportunityService } from '../../../services/opportunityService';
import type { Opportunity } from '../../../types/crm-opportunities';
import { Plus, RefreshCw } from 'lucide-react';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';

export function OpportunityList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
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

    const columns: Column<Opportunity>[] = [
        { key: 'title', label: 'Título', sortable: true },
        {
            key: 'businessPartnerName',
            label: 'Cliente / Lead',
            sortable: true,
            render: (_, op) => (
                op.businessPartnerName ? (
                    <div className="font-medium">{op.businessPartnerName} (BP)</div>
                ) : (
                    <div className="text-text-secondary">{op.leadName} (Lead)</div>
                )
            )
        },
        {
            key: 'estimatedValue',
            label: 'Valor Est.',
            width: '120px',
            align: 'right',
            render: (val) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        },
        {
            key: 'closeDate',
            label: 'Fechamento',
            width: '120px',
            render: (val) => new Date(val).toLocaleDateString('pt-BR')
        },
        {
            key: 'probability',
            label: 'Probabilidade',
            width: '150px',
            render: (val) => (
                <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                        <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${val}%` }}></div>
                    </div>
                    <span className="text-[10px] text-text-secondary font-mono">{val}%</span>
                </div>
            )
        },
        {
            key: 'stage',
            label: 'Etapa',
            width: '120px',
            render: (value) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStageColor(value)}`}>
                    {value.toUpperCase()}
                </span>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Oportunidades</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">CRM02</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadOpportunities} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/crm/opportunities/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVA OPORTUNIDADE
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={opportunities}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(op) => navigate(`/crm/opportunities/${op.id}`)}
                />
            </div>
        </div>
    );
}
