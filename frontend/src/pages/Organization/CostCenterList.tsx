import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import type { Empresa, CentroCusto } from '../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { ALVGrid } from '../../components/Common/ALVGrid';
import type { Column } from '../../components/Common/ALVGrid';

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

    const columns: Column<CentroCusto>[] = [
        { key: 'codigo', label: 'Código', sortable: true, width: '120px' },
        { key: 'descricao', label: 'Descrição', sortable: true },
        { key: 'responsavel', label: 'Responsável', sortable: true, width: '200px' },
        {
            key: 'validadeInicio',
            label: 'Validade Início',
            width: '120px',
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Gestão de Centros de Custo</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">KS01</span>
                    </div>

                    <div className="h-6 w-[1px] bg-border-default mx-1" />

                    <div className="flex items-center space-x-2 text-xs">
                        <Filter size={14} className="text-text-secondary" />
                        <span className="text-text-secondary font-medium">EMPRESA:</span>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="p-1.5 bg-bg-secondary border border-border-default rounded text-xs font-bold text-brand-primary outline-none focus:ring-1 focus:ring-brand-primary"
                        >
                            <option value="">Selecione...</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.nomeFantasia.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => selectedCompany && loadCostCenters(selectedCompany)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/cost-centers/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO CENTRO DE CUSTO
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={costCenters}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(cc) => navigate(`/admin/cost-centers/${cc.id}`)}
                />
            </div>
        </div>
    );
}
