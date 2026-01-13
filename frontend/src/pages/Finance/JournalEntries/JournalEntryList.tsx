import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, CheckCircle } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import type { JournalEntry } from '../../../types/finance';
import { format } from 'date-fns';

export function JournalEntryList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const data = await financeService.getJournalEntries();
            setEntries(data);
        } catch (error) {
            console.error('Failed to load journal entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (id: string) => {
        if (!confirm('Deseja realmente postar este lançamento? Esta ação não pode ser desfeita.')) return;
        try {
            await financeService.postJournalEntry(id);
            loadEntries();
        } catch (error) {
            alert('Erro ao postar lançamento');
        }
    };

    const filteredEntries = entries.filter(entry =>
        searchTerm === '' ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.reference && entry.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Lançamentos (FB50)</h1>
                <button
                    onClick={() => navigate('/finance/journal-entries/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Novo Lançamento
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
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Data Lançamento</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Nr. Doc</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Descrição</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Valor Total</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntries.map((entry) => {
                                    const totalAmount = entry.lines
                                        .filter(l => l.type === 'Debit')
                                        .reduce((sum, line) => sum + line.amount, 0);

                                    return (
                                        <tr key={entry.id} className="border-b border-border-default hover:bg-bg-subtle">
                                            <td className="px-4 py-3 text-sm">
                                                {format(new Date(entry.postingDate), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="px-4 py-3 text-sm">{entry.reference || '-'}</td>
                                            <td className="px-4 py-3 text-sm">{entry.description}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${entry.status === 'Posted' ? 'bg-green-100 text-green-700' :
                                                        entry.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                    {entry.status === 'Posted' ? 'Postado' :
                                                        entry.status === 'Draft' ? 'Rascunho' : 'Cancelado'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">
                                                {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                {/* <button onClick={() => navigate(`/finance/journal-entries/${entry.id}`)} className="text-gray-600 hover:text-gray-800 p-1">
                                                    <Eye size={16} />
                                                </button> */}
                                                {entry.status === 'Draft' && (
                                                    <button
                                                        onClick={() => handlePost(entry.id)}
                                                        className="text-green-600 hover:text-green-700 p-1"
                                                        title="Postar Lançamento"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
