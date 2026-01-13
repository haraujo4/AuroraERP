import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import type { Account, CreateJournalEntry } from '../../../types/finance';

export function JournalEntryForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);

    // Form State
    const [postingDate, setPostingDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [reference, setReference] = useState('');
    const [lines, setLines] = useState<{
        id: number; // temporary id for react keys
        accountId: string;
        type: 'Debit' | 'Credit';
        amount: number;
        costCenterId?: string;
    }[]>([
        { id: 1, accountId: '', type: 'Debit', amount: 0 },
        { id: 2, accountId: '', type: 'Credit', amount: 0 }
    ]);

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const data = await financeService.getAccounts();
            // Filter only leaf accounts (that accept entries) if necessary. 
            // For now, listing all active accounts.
            const activeAccounts = data.filter(a => a.isActive);
            setAccounts(activeAccounts);
        } catch (error) {
            console.error('Failed to load accounts:', error);
        }
    };

    const handleLineChange = (id: number, field: string, value: any) => {
        setLines(prev => prev.map(line => {
            if (line.id === id) {
                return { ...line, [field]: value };
            }
            return line;
        }));
    };

    const addLine = () => {
        const newId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
        setLines(prev => [...prev, { id: newId, accountId: '', type: 'Debit', amount: 0 }]);
    };

    const removeLine = (id: number) => {
        if (lines.length <= 2) {
            alert('Um lançamento deve ter pelo menos 2 linhas.');
            return;
        }
        setLines(prev => prev.filter(l => l.id !== id));
    };

    const calculateTotals = () => {
        const debit = lines.filter(l => l.type === 'Debit').reduce((sum, l) => sum + Number(l.amount), 0);
        const credit = lines.filter(l => l.type === 'Credit').reduce((sum, l) => sum + Number(l.amount), 0);
        return { debit, credit, diff: debit - credit };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const { diff } = calculateTotals();
        if (Math.abs(diff) > 0.01) {
            alert(`O lançamento não está balanceado. Diferença: R$ ${diff.toFixed(2)}`);
            return;
        }

        if (lines.some(l => !l.accountId || l.amount <= 0)) {
            alert('Todas as linhas devem ter uma conta selecionada e valor maior que zero.');
            return;
        }

        setLoading(true);
        try {
            const payload: CreateJournalEntry = {
                postingDate: new Date(postingDate).toISOString(),
                documentDate: new Date(postingDate).toISOString(), // Simplified
                description,
                reference,
                lines: lines.map(l => ({
                    accountId: l.accountId,
                    amount: Number(l.amount),
                    type: l.type,
                    costCenterId: l.costCenterId
                }))
            };

            await financeService.createJournalEntry(payload);
            navigate('/finance/journal-entries');
        } catch (error) {
            console.error('Failed to save journal entry:', error);
            alert('Erro ao salvar lançamento');
        } finally {
            setLoading(false);
        }
    };

    const { debit, credit, diff } = calculateTotals();

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/finance/journal-entries')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Novo Lançamento Contábil (FB50)</h1>
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
                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input
                                type="date"
                                value={postingDate}
                                onChange={(e) => setPostingDate(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Referência / Nr. Doc</label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        />
                    </div>

                    {/* Lines */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Itens</h3>
                            <button
                                type="button"
                                onClick={addLine}
                                className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-medium"
                            >
                                <Plus size={16} /> Adicionar Linha
                            </button>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Conta</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Tipo</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Valor</th>
                                        <th className="px-4 py-2 text-right w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {lines.map((line) => (
                                        <tr key={line.id}>
                                            <td className="p-2">
                                                <select
                                                    value={line.accountId}
                                                    onChange={(e) => handleLineChange(line.id, 'accountId', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm"
                                                    required
                                                >
                                                    <option value="">Selecione uma conta...</option>
                                                    {accounts.map(account => (
                                                        <option key={account.id} value={account.id}>
                                                            {account.code} - {account.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <select
                                                    value={line.type}
                                                    onChange={(e) => handleLineChange(line.id, 'type', e.target.value)}
                                                    className={`w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm font-bold ${line.type === 'Debit' ? 'text-blue-700' : 'text-red-700'}`}
                                                >
                                                    <option value="Debit">Débito</option>
                                                    <option value="Credit">Crédito</option>
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={line.amount}
                                                    onChange={(e) => handleLineChange(line.id, 'amount', e.target.value)}
                                                    min="0.01"
                                                    step="0.01"
                                                    className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm text-right"
                                                    required
                                                />
                                            </td>
                                            <td className="p-2 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeLine(line.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 font-bold">
                                    <tr>
                                        <td className="px-4 py-2 text-right">Totais:</td>
                                        <td className="px-4 py-2"></td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>D: {debit.toFixed(2)}</span>
                                                <span>C: {credit.toFixed(2)}</span>
                                            </div>
                                            <div className={`mt-1 ${Math.abs(diff) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                                                Dif: {diff.toFixed(2)}
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
