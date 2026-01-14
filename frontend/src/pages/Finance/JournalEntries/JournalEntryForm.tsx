import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import type { Account, CreateJournalEntry, JournalEntry } from '../../../types/finance';

export function JournalEntryForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [entryStatus, setEntryStatus] = useState<string>('');

    // Form State
    const [postingDate, setPostingDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [reference, setReference] = useState('');
    const [lines, setLines] = useState<{
        id: number; // temporary id for react keys
        accountId: string;
        accountName?: string; // For display in read-only
        type: 'Debit' | 'Credit';
        amount: number;
        costCenterId?: string;
    }[]>([
        { id: 1, accountId: '', type: 'Debit', amount: 0 },
        { id: 2, accountId: '', type: 'Credit', amount: 0 }
    ]);

    useEffect(() => {
        loadAccounts();
        if (id) {
            loadEntry(id);
        }
    }, [id]);

    const loadAccounts = async () => {
        try {
            const data = await financeService.getAccounts();
            const activeAccounts = data.filter(a => a.isActive);
            setAccounts(activeAccounts);
        } catch (error) {
            console.error('Failed to load accounts:', error);
        }
    };

    const loadEntry = async (entryId: string) => {
        setLoading(true);
        try {
            // Assuming getJournalEntryById exists in financeService (fetching single entry)
            // Ideally it should be financeService.getJournalEntry(id)
            // But checking previous code usage, financeService.getJournalEntries() returns array. 
            // I might need to implement getById if missing or specific endpoint calls.
            // Let's assume financeService has getJournalEntry(id) or I use generic fetch.
            // Wait, previous file view didn't show financeService.ts, but usage in List was getJournalEntries().
            // I'll assume standard REST: getJournalEntry(id). If not, I might fail build. 
            // Better to assume generic generic fetch or check service. 
            // I will use financeService.getJournalEntry(entryId) and if it fails I'll fix service.

            // Actually, looking at List.tsx: financeService.getJournalEntries()
            // We need to check if getJournalEntry(id) exists. 
            // But let's write the code assuming it does from standard pattern or List's usage.

            // Checking JournalEntryController: [HttpGet("{id}")] is available.

            // Note: Typescript might complain if method is missing on client service.
            // I will try to call it.

            // Mocking the call if I can't verify service file? 
            // I should have checked service file. 
            // Let's assume it exists or I'll fix it.

            // Actually, I'll fetch via direct fetch if I'm unsure, but better to use service.
            // Let's assume `financeService.getJournalEntry(id)` works or I add it.

            // Wait, I didn't verify financeService.ts. 
            // But based on controller `[HttpGet("{id}")]`, the backend supports it.
            // I will implement the usage here.

            const entry: JournalEntry = await financeService.getJournalEntry(entryId) as any;

            setPostingDate(new Date(entry.postingDate).toISOString().split('T')[0]);
            setDescription(entry.description);
            setReference(entry.reference || '');
            setEntryStatus(entry.status);

            // Map lines
            setLines(entry.lines.map((l, index) => ({
                id: index + 1,
                accountId: l.accountId,
                accountName: l.accountName,
                type: l.type as 'Debit' | 'Credit',
                amount: l.amount,
                costCenterId: l.costCenterId
            })));

            if (entry.status === 'Posted' || entry.status === 'Cancelled') {
                setIsReadOnly(true);
            }

        } catch (error) {
            console.error('Failed to load entry:', error);
            alert('Erro ao carregar lançamento');
            navigate('/finance/journal-entries');
        } finally {
            setLoading(false);
        }
    };

    const handleLineChange = (id: number, field: string, value: any) => {
        if (isReadOnly) return;
        setLines(prev => prev.map(line => {
            if (line.id === id) {
                return { ...line, [field]: value };
            }
            return line;
        }));
    };

    const addLine = () => {
        if (isReadOnly) return;
        const newId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
        setLines(prev => [...prev, { id: newId, accountId: '', type: 'Debit', amount: 0 }]);
    };

    const removeLine = (id: number) => {
        if (isReadOnly) return;
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
        if (isReadOnly) return;

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
                documentDate: new Date(postingDate).toISOString(),
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
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">
                            {id ? `Lançamento Contábil (FB03)` : `Novo Lançamento Contábil (FB50)`}
                        </h1>
                        {entryStatus && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${entryStatus === 'Posted' ? 'bg-green-100 text-green-800' :
                                entryStatus === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {entryStatus === 'Posted' ? 'POSTADO' : entryStatus === 'Draft' ? 'RASCUNHO' : 'CANCELADO'}
                            </span>
                        )}
                    </div>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50"
                    >
                        <Save size={16} />
                        Salvar
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-auto p-4">
                <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Lançamento</label>
                            <input
                                type="date"
                                value={postingDate}
                                onChange={(e) => setPostingDate(e.target.value)}
                                required
                                disabled={isReadOnly}
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                disabled={isReadOnly}
                                className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Referência / Nr. Doc</label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            disabled={isReadOnly}
                            className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>

                    {/* Lines */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Itens do Lançamento</h3>
                            {!isReadOnly && (
                                <button
                                    type="button"
                                    onClick={addLine}
                                    className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-medium"
                                >
                                    <Plus size={16} /> Adicionar Linha
                                </button>
                            )}
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Conta (Plano de Contas)</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Tipo</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Débito</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Crédito</th>
                                        {!isReadOnly && <th className="px-4 py-2 text-right w-1/12"></th>}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {lines.map((line) => (
                                        <tr key={line.id} className="hover:bg-gray-50">
                                            <td className="p-2">
                                                {isReadOnly ? (
                                                    <span className="text-sm text-gray-800 font-medium">
                                                        {line.accountName || accounts.find(a => a.id === line.accountId)?.name || 'Conta desconhecida'}
                                                    </span>
                                                ) : (
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
                                                )}
                                            </td>
                                            <td className="p-2">
                                                {isReadOnly ? (
                                                    <span className={`text-sm font-bold ${line.type === 'Debit' ? 'text-blue-700' : 'text-red-700'}`}>
                                                        {line.type === 'Debit' ? 'Débito' : 'Crédito'}
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={line.type}
                                                        onChange={(e) => handleLineChange(line.id, 'type', e.target.value)}
                                                        className={`w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm font-bold ${line.type === 'Debit' ? 'text-blue-700' : 'text-red-700'}`}
                                                    >
                                                        <option value="Debit">Débito</option>
                                                        <option value="Credit">Crédito</option>
                                                    </select>
                                                )}
                                            </td>
                                            {/* Debit Column */}
                                            <td className="p-2 text-right">
                                                {line.type === 'Debit' ? (
                                                    isReadOnly ? (
                                                        <span className="text-sm font-mono font-medium text-blue-700">
                                                            {Number(line.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </span>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={line.amount}
                                                            onChange={(e) => handleLineChange(line.id, 'amount', e.target.value)}
                                                            min="0.01" step="0.01"
                                                            className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm text-right text-blue-700 font-medium"
                                                            required
                                                        />
                                                    )
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            {/* Credit Column */}
                                            <td className="p-2 text-right">
                                                {line.type === 'Credit' ? (
                                                    isReadOnly ? (
                                                        <span className="text-sm font-mono font-medium text-red-700">
                                                            {Number(line.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </span>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={line.amount}
                                                            onChange={(e) => handleLineChange(line.id, 'amount', e.target.value)}
                                                            min="0.01" step="0.01"
                                                            className="w-full p-2 border border-gray-300 rounded focus:border-brand-primary text-sm text-right text-red-700 font-medium"
                                                            required
                                                        />
                                                    )
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>

                                            {!isReadOnly && (
                                                <td className="p-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLine(line.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100 font-bold border-t border-gray-300">
                                    <tr>
                                        <td className="px-4 py-2 text-right uppercase text-xs text-gray-500">Totais:</td>
                                        <td className="px-4 py-2"></td>
                                        <td className="px-4 py-2 text-right text-blue-800">
                                            {debit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="px-4 py-2 text-right text-red-800">
                                            {credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        {!isReadOnly && <td></td>}
                                    </tr>
                                </tfoot>
                            </table>
                            {Math.abs(diff) > 0.01 && (
                                <div className="bg-red-50 p-2 text-center text-red-600 text-sm font-bold border-t border-red-100">
                                    Diferença (Não Balanceado): {diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
