import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LeadService } from '../../../services/leadService';
import type { Lead } from '../../../types/crm-leads';
import { Plus, RefreshCw } from 'lucide-react';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';

export function LeadList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        setLoading(true);
        try {
            const data = await LeadService.getAll();
            setLeads(data);
        } catch (error) {
            console.error("Failed to load leads", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Contacted': return 'bg-yellow-100 text-yellow-800';
            case 'Qualified': return 'bg-purple-100 text-purple-800';
            case 'Converted': return 'bg-green-100 text-green-800';
            case 'Lost': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const columns: Column<Lead>[] = [
        { key: 'title', label: 'Título', sortable: true },
        {
            key: 'companyName',
            label: 'Empresa / Contato',
            sortable: true,
            render: (_, lead) => (
                <div>
                    <div className="font-medium">{lead.companyName}</div>
                    <div className="text-[10px] text-text-secondary">{lead.contactName}</div>
                </div>
            )
        },
        { key: 'source', label: 'Origem', width: '150px' },
        {
            key: 'estimatedValue',
            label: 'Valor Est.',
            width: '120px',
            align: 'right',
            render: (val) => val ? `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'
        },
        {
            key: 'status',
            label: 'Status',
            width: '120px',
            render: (value) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(value)}`}>
                    {value.toUpperCase()}
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Criado em',
            width: '120px',
            render: (val) => new Date(val).toLocaleDateString('pt-BR')
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Leads</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">CRM01</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadLeads} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/crm/leads/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO LEAD
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={leads}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(lead) => navigate(`/crm/leads/${lead.id}`)}
                />
            </div>
        </div>
    );
}
