import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import type { GrupoEmpresarial } from '../../types/organization';
import { Plus, RefreshCw } from 'lucide-react';

export function GroupList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>(); // Get search term from layout
    const [groups, setGroups] = useState<GrupoEmpresarial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        setLoading(true);
        try {
            const data = await OrganizationService.getGroups();
            setGroups(data);
        } catch (error) {
            console.error("Failed to load groups", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter groups based on Global Search Term
    const filteredGroups = groups.filter(group =>
        searchTerm === '' ||
        group.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.razaoSocialConsolidada.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-text-primary mr-4">Grupos Empresariais (ORG01)</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={loadGroups} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/groups/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Grupo
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
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">País</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Moeda</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : groups.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">Nenhum grupo encontrado.</td>
                            </tr>
                        ) : (
                            filteredGroups.map((group) => (
                                <tr key={group.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{group.codigo}</td>
                                    <td className="p-3 font-medium">{group.razaoSocialConsolidada}</td>
                                    <td className="p-3">{group.paisConsolidacao}</td>
                                    <td className="p-3">{group.moedaBase}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {group.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 text-xs text-text-secondary text-right">
                Registros: {groups.length}
            </div>
        </div>
    );
}
