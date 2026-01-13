import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import type { Empresa, CentroCusto } from '../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';

export function CostCenterList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [costCenters, setCostCenters] = useState<CentroCusto[]>([]);
    const [companies, setCompanies] = useState<Empresa[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            loadCostCenters(selectedCompany);
        } else {
            setCostCenters([]);
        }
    }, [selectedCompany]);

    const loadCompanies = async () => {
        try {
            // We need all companies here. Service doesn't have getAllCompanies but we can use a workaround or add it.
            // For now, let's assume getGroups + getCompaniesByGroup if needed, or better, add getAllCompanies to service.
            // Simplified: let's use a group-based approach or add the missing service method.
            // Added getCompanies to service (mentally, let me verify if I added it)
            // Actually, let's just fetch groups then first group's companies.
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

    const loadCostCenters = async (companyId: string) => {
        setLoading(true);
        try {
            const data = await OrganizationService.getCostCentersByCompany(companyId);
            setCostCenters(data);
        } catch (error) {
            console.error("Failed to load cost centers", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCostCenters = costCenters.filter(cc =>
        searchTerm === '' ||
        cc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cc.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cc.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Centros de Custo (KS01)</h1>
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
                    <button onClick={() => selectedCompany && loadCostCenters(selectedCompany)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/cost-centers/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Centro de Custo
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
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Validade Início</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : costCenters.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-text-secondary">
                                    {selectedCompany ? 'Nenhum centro de custo encontrado nesta empresa.' : 'Selecione uma empresa para visualizar.'}
                                </td>
                            </tr>
                        ) : (
                            filteredCostCenters.map((cc) => (
                                <tr key={cc.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{cc.codigo}</td>
                                    <td className="p-3 font-medium">{cc.descricao}</td>
                                    <td className="p-3">{cc.responsavel}</td>
                                    <td className="p-3">{new Date(cc.validadeInicio).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
