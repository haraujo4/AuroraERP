import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import { OrganizationService as GroupService } from '../../services/organizationService'; // Re-use for groups
import type { Empresa, GrupoEmpresarial } from '../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';

export function CompanyList() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Empresa[]>([]);
    const [groups, setGroups] = useState<GrupoEmpresarial[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            loadCompanies(selectedGroup);
        } else {
            setCompanies([]);
        }
    }, [selectedGroup]);

    const loadGroups = async () => {
        try {
            const data = await GroupService.getGroups();
            setGroups(data);
            if (data.length > 0) {
                setSelectedGroup(data[0].id);
            }
        } catch (error) {
            console.error("Failed to load groups", error);
        }
    };

    const loadCompanies = async (grupoId: string) => {
        setLoading(true);
        try {
            const data = await OrganizationService.getCompaniesByGroup(grupoId);
            setCompanies(data);
        } catch (error) {
            console.error("Failed to load companies", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Empresas</h1>

                    {/* Filter by Group */}
                    <div className="flex items-center space-x-2 text-sm">
                        <Filter size={16} className="text-text-secondary" />
                        <span className="text-text-secondary">Grupo:</span>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="p-1 border border-border-input rounded focus:border-brand-primary outline-none"
                        >
                            <option value="">Selecione...</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.nomeFantasia}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => selectedGroup && loadCompanies(selectedGroup)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/companies/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Nova Empresa
                    </button>
                </div>
            </div>

            {/* Content / Table */}
            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Código</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Razão Social</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Nome Fantasia</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">CNPJ</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : companies.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">
                                    {selectedGroup ? 'Nenhuma empresa encontrada neste grupo.' : 'Selecione um grupo para visualizar as empresas.'}
                                </td>
                            </tr>
                        ) : (
                            companies.map((company) => (
                                <tr key={company.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{company.codigo}</td>
                                    <td className="p-3 font-medium">{company.razaoSocial}</td>
                                    <td className="p-3">{company.nomeFantasia}</td>
                                    <td className="p-3 font-mono">{company.cnpj}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${company.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {company.isActive ? 'Ativa' : 'Inativa'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 text-xs text-text-secondary text-right">
                Registros: {companies.length}
            </div>
        </div>
    );
}
