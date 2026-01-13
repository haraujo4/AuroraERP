import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LeadService } from '../../../services/leadService';
import type { Lead } from '../../../types/crm-leads';
import { Plus, RefreshCw } from 'lucide-react';

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

    const filteredLeads = leads.filter(lead =>
        searchTerm === '' ||
        lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contactName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-text-primary">Leads (CRM01)</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={loadLeads} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/crm/leads/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Lead
                    </button>
                </div>
            </div>

            {/* Content / Table */}
            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Título</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Empresa / Contato</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Origem</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Valor Est.</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Criado em</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">Nenhum lead encontrado.</td>
                            </tr>
                        ) : (
                            filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-medium">{lead.title}</td>
                                    <td className="p-3">
                                        <div className="font-medium">{lead.companyName}</div>
                                        <div className="text-xs text-text-secondary">{lead.contactName}</div>
                                    </td>
                                    <td className="p-3">{lead.source}</td>
                                    <td className="p-3 font-mono">
                                        {lead.estimatedValue ? `R$ ${lead.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs text-text-secondary">
                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
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
