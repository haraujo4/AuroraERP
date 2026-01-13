import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import type { Empresa, CentroLucro } from '../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';

export function ProfitCenterList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [profitCenters, setProfitCenters] = useState<CentroLucro[]>([]);
    const [companies, setCompanies] = useState<Empresa[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            loadProfitCenters(selectedCompany);
        } else {
            setProfitCenters([]);
        }
    }, [selectedCompany]);

    const loadCompanies = async () => {
        try {
            const groups = await OrganizationService.getGroups();
            if (groups.length > 0) {
                const comps = await OrganizationService.getCompaniesByGroup(groups[0].id);
                setCompanies(comps);
                if (comps.length > 0) {
                    setSelectedCompany(comps[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to load initial data", error);
        }
    };

    const loadProfitCenters = async (companyId: string) => {
        setLoading(true);
        try {
            const data = await OrganizationService.getProfitCentersByCompany(companyId);
            setProfitCenters(data);
        } catch (error) {
            console.error("Failed to load profit centers", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProfitCenters = profitCenters.filter(pc =>
        searchTerm === '' ||
        pc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pc.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pc.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Centros de Lucro (KE51)</h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <Filter size={16} className="text-text-secondary" />
                        <span className="text-text-secondary">Empresa:</span>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="p-1 border border-border-input rounded focus:border-brand-primary outline-none"
                        >
                            <option value="">Selecione...</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.nomeFantasia}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => selectedCompany && loadProfitCenters(selectedCompany)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/profit-centers/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Centro de Lucro
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Código</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Descrição</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Responsável</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : profitCenters.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-text-secondary">
                                    {selectedCompany ? 'Nenhum centro de lucro encontrado nesta empresa.' : 'Selecione uma empresa para visualizar.'}
                                </td>
                            </tr>
                        ) : (
                            filteredProfitCenters.map((pc) => (
                                <tr key={pc.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{pc.codigo}</td>
                                    <td className="p-3 font-medium">{pc.descricao}</td>
                                    <td className="p-3">{pc.responsavel}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
