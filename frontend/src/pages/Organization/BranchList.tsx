import { useEffect, useState } from 'react';
import type { Branch } from '../../types/organization';
import { branchService } from '../../services/branchService';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { RefreshCw, Plus } from 'lucide-react';
import { ALVGrid } from '../../components/Common/ALVGrid';
import type { Column } from '../../components/Common/ALVGrid';

export function BranchList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        setLoading(true);
        try {
            const data = await branchService.getAll();
            setBranches(data);
        } catch (error) {
            console.error('Failed to load branches', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: Column<Branch>[] = [
        { key: 'codigo', label: 'Código', sortable: true, width: '100px' },
        { key: 'descricao', label: 'Descrição', sortable: true },
        { key: 'empresaName', label: 'Empresa', sortable: true, width: '200px' },
        {
            key: 'city',
            label: 'Cidade/UF',
            width: '180px',
            render: (_, branch) => `${branch.city || ''} - ${branch.state || ''}`
        },
        { key: 'tipo', label: 'Tipo', width: '100px' },
        {
            key: 'id',
            label: 'Ações',
            align: 'right',
            width: '80px',
            render: (id) => (
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/branches/${id}`); }}
                    className="text-brand-primary hover:text-brand-secondary font-medium"
                >
                    Editar
                </button>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Gestão de Filiais</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">ORG03</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadBranches} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/admin/branches/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVA FILIAL
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={branches}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(branch) => navigate(`/admin/branches/${branch.id}`)}
                />
            </div>
        </div>
    );
}
