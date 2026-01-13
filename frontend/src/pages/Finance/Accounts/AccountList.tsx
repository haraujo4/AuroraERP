import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { financeService } from '../../../services/financeService';
import type { Account } from '../../../types/finance';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';
import { RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';

export function AccountList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const data = await financeService.getAccounts();
            setAccounts(data);
        } catch (error) {
            console.error('Failed to load accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
        try {
            await financeService.deleteAccount(id);
            loadAccounts();
        } catch (error) {
            alert('Erro ao excluir conta');
        }
    };

    const columns: Column<Account>[] = [
        { key: 'code', label: 'Código', sortable: true, width: '120px' },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'type', label: 'Tipo', width: '120px' },
        { key: 'nature', label: 'Natureza', width: '120px' },
        { key: 'level', label: 'Nível', width: '80px', align: 'center' },
        {
            key: 'isActive',
            label: 'Status',
            width: '100px',
            render: (value) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value ? 'ATIVA' : 'INATIVA'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Ações',
            align: 'right',
            width: '80px',
            render: (_, account) => (
                <div className="flex justify-end gap-1">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/finance/accounts/${account.id}`); }} className="p-1 text-text-secondary hover:text-brand-primary">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(account.id); }} className="p-1 text-text-secondary hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Plano de Contas</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">FI01</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadAccounts} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/finance/accounts/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVA CONTA
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={accounts}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(acc) => navigate(`/finance/accounts/${acc.id}`)}
                />
            </div>
        </div>
    );
}
