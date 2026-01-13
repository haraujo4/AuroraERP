import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import type { GrupoEmpresarial } from '../../types/organization';
import { Plus, RefreshCw } from 'lucide-react';
import { ALVGrid } from '../../components/Common/ALVGrid';
import type { Column } from '../../components/Common/ALVGrid';

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

    const columns: Column<GrupoEmpresarial>[] = [
        { key: 'codigo', label: 'Código', sortable: true, width: '120px' },
        { key: 'razaoSocialConsolidada', label: 'Razão Social', sortable: true },
        { key: 'paisConsolidacao', label: 'País/Sede', width: '150px' },
        { key: 'moedaBase', label: 'Moeda', width: '100px', align: 'center' },
        {
            key: 'isActive',
            label: 'Status',
            width: '100px',
            render: (value) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value ? 'ATIVO' : 'INATIVO'}
                </span>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Grupos Empresariais</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">ORG01</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadGroups} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/groups/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO GRUPO
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={groups}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(group) => navigate(`/admin/groups/${group.id}`)}
                />
            </div>
        </div>
    );
}
