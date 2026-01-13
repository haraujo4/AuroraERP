import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import type { Account } from '../../../types/finance';

export function AccountList() {
    const navigate = useNavigate();
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

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Plano de Contas</h1>
                <button
                    onClick={() => navigate('/finance/accounts/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Nova Conta
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-border-default overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-bg-secondary border-b border-border-default">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Nome</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Natureza</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Nível</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 font-mono text-sm">{account.code}</td>
                                        <td className="px-4 py-3">{account.name}</td>
                                        <td className="px-4 py-3 text-sm">{account.type}</td>
                                        <td className="px-4 py-3 text-sm">{account.nature}</td>
                                        <td className="px-4 py-3 text-sm">{account.level}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${account.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {account.isActive ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => navigate(`/finance/accounts/${account.id}`)} className="text-brand-primary hover:text-brand-secondary p-1">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(account.id)} className="text-red-600 hover:text-red-700 p-1 ml-2">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
