import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { financeService } from '../../../services/financeService';
import type { JournalEntry } from '../../../types/finance';
import { format } from 'date-fns';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';
import { RefreshCw, Plus, CheckCircle } from 'lucide-react';

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

    const columns: Column<JournalEntry>[] = [
        {
            key: 'postingDate',
            label: 'Data Lanç.',
            sortable: true,
            width: '120px',
            render: (val) => format(new Date(val), 'dd/MM/yyyy')
        },
        { key: 'reference', label: 'Nr. Doc', sortable: true, width: '120px' },
        { key: 'description', label: 'Descrição', sortable: true },
        {
            key: 'status',
            label: 'Status',
            width: '100px',
            render: (value) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold 
                    ${value === 'Posted' ? 'bg-green-100 text-green-800' :
                        value === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                    {value === 'Posted' ? 'POSTADO' : value === 'Draft' ? 'RASCUNHO' : 'CANCELADO'}
                </span>
            )
        },
        {
            key: 'id', // Re-use ID for computed total for now, or just key: 'lines'
            label: 'Valor Total',
            align: 'right',
            width: '150px',
            render: (_, entry) => {
                const total = entry.lines
                    .filter(l => l.type === 'Debit')
                    .reduce((sum, line) => sum + line.amount, 0);
                return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }
        },
        {
            key: 'actions',
            label: 'Ações',
            align: 'right',
            width: '80px',
            render: (_, entry) => (
                <div className="flex justify-end gap-1">
                    {entry.status === 'Draft' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePost(entry.id); }}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Postar"
                        >
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Lançamentos Contábeis</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">FB50</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadEntries} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/finance/journal-entries/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO LANÇAMENTO
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={entries}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(entry) => navigate(`/finance/journal-entries/${entry.id}`)}
                />
            </div>
        </div>
    );
}
