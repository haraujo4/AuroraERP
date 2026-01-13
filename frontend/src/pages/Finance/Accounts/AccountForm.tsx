import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import type { Account, CreateAccount } from '../../../types/finance';

export function AccountForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [formData, setFormData] = useState<CreateAccount>({
        code: '',
        name: '',
        type: 'Asset',
        nature: 'Debit',
        level: 1,
        parentId: undefined
    });

    useEffect(() => {
        loadAccounts();
        if (isEditMode && id) {
            loadAccount(id);
        }
    }, [id]);

    const loadAccounts = async () => {
        try {
            const data = await financeService.getAccounts();
            setAccounts(data);
        } catch (error) {
            console.error('Failed to load accounts:', error);
        }
    };

    const loadAccount = async (accountId: string) => {
        try {
            const account = await financeService.getAccountById(accountId);
            setFormData({
                code: account.code,
                name: account.name,
                type: account.type,
                nature: account.nature,
                level: account.level,
                parentId: account.parentId
            });
        } catch (error) {
            console.error('Failed to load account:', error);
            alert('Erro ao carregar conta');
            navigate('/finance/accounts');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode && id) {
                await financeService.updateAccount(id, formData);
            } else {
                await financeService.createAccount(formData);
            }
            navigate('/finance/accounts');
        } catch (error) {
            console.error('Failed to save account:', error);
            alert('Erro ao salvar conta');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/finance/accounts')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {isEditMode ? 'Editar Conta' : 'Nova Conta'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50"
                >
                    <Save size={16} />
                    Salvar
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="Asset">Ativo</option>
                                <option value="Liability">Passivo</option>
                                <option value="Equity">Patrimônio Líquido</option>
                                <option value="Revenue">Receita</option>
                                <option value="Expense">Despesa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Natureza</label>
                            <select
                                name="nature"
                                value={formData.nature}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="Debit">Devedora</option>
                                <option value="Credit">Credora</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
                            <input
                                type="number"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Conta Pai (Opcional)</label>
                            <select
                                name="parentId"
                                value={formData.parentId || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="">Nenhuma</option>
                                {accounts
                                    .filter(a => a.id !== id) // Avoid circular reference
                                    .map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.code} - {account.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
