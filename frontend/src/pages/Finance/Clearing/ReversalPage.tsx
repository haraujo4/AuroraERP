import React, { useState } from 'react';
import { Search, RotateCcw, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { financeService } from '../../../services/financeService';
import { format } from 'date-fns';
import type { JournalEntry } from '../../../types/finance';

const ReversalPage: React.FC = () => {
    const [reference, setReference] = useState('');
    const [reason, setReason] = useState('');
    const [document, setDocument] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference) return;

        setSearching(true);
        setError(null);
        setDocument(null);
        setSuccess(null);

        try {
            // 1. Fetch JEs
            const entries = await financeService.getJournalEntries();
            const searchRef = reference.toLowerCase().trim();

            // 2. Try simple match
            let found = entries.find(e =>
                e.reference?.toLowerCase() === searchRef ||
                e.id.toLowerCase() === searchRef ||
                e.description.toLowerCase().includes(searchRef)
            );

            // 3. If not found, try to look up Invoice by Number
            if (!found && searchRef.startsWith('inv-')) {
                const invoices = await financeService.getInvoices();
                const invoice = invoices.find(i => i.number.toLowerCase() === searchRef);

                if (invoice) {
                    // Start looking for JE with Invoice ID or Invoice Number
                    found = entries.find(e =>
                        e.reference === invoice.id ||
                        e.reference === invoice.number ||
                        e.description.includes(invoice.number) ||
                        // Legacy: Description might contain first chunk of ID
                        e.description.includes(invoice.id.split('-')[0])
                    );
                }
            }

            // 4. If still not found, try matching UUID segment in description (for legacy "Invoice #abcd")
            if (!found && !searchRef.includes('-') && searchRef.length === 8) {
                found = entries.find(e => e.description.toLowerCase().includes(searchRef));
            }

            if (!found) {
                setError('Documento não encontrado para a referência informada.');
            } else if (found.status !== 'Posted') {
                setError(`Este documento possui status "${found.status}" e não pode ser estornado.`);
            } else {
                setDocument(found);
            }
        } catch (err: any) {
            setError('Erro ao buscar documento. Verifique a referência.');
        } finally {
            setSearching(false);
        }
    };

    const handleReverse = async () => {
        if (!document || !reason) return;

        setLoading(true);
        setError(null);

        try {
            // Check if it's an invoice reversal or manual JE reversal
            // For now, let's reverse the JE directly as the logic is robust
            await financeService.reverseJournalEntry(document.id, reason);

            setSuccess('Documento estornado com sucesso! Os lançamentos de compensação foram criados.');
            setDocument(null);
            setReference('');
            setReason('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar o estorno.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Estorno de Documento (FB08)</h1>
                    <p className="text-text-secondary">Anulação formal de lançamentos contábeis e faturas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Search Card */}
                <div className="bg-bg-paper rounded-xl shadow-sm border border-border-default p-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Referência do Documento (Nº Fatura ou ID)
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="Ex: INV-2024-0001"
                                    className="w-full pl-10 pr-4 py-2 bg-bg-default border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={searching || !reference}
                                className="px-6 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary disabled:opacity-50 flex items-center gap-2 h-[42px]"
                            >
                                <Search className="h-4 w-4" />
                                {searching ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Document Details & Reason */}
                {document && (
                    <div className="bg-bg-paper rounded-xl shadow-sm border border-border-default overflow-hidden animate-in fade-in slide-in-from-top-4">
                        <div className="bg-gray-50 border-b border-border-default p-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-brand-primary" />
                                Detalhes do Documento a Estornar
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold">Data de Postagem</label>
                                    <p className="font-medium">{format(new Date(document.postingDate), 'dd/MM/yyyy')}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold">Referência</label>
                                    <p className="font-medium font-mono">{document.reference || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold">Tipo</label>
                                    <p className="font-medium">{document.type}</p>
                                </div>
                                <div className="col-span-3">
                                    <label className="text-xs text-text-secondary uppercase font-bold">Descrição</label>
                                    <p className="font-medium">{document.description}</p>
                                </div>
                            </div>

                            <div className="border border-border-default rounded-lg overflow-hidden mb-6">
                                <table className="w-full text-left">
                                    <thead className="bg-bg-subtle text-xs font-bold uppercase text-text-secondary border-b border-border-default">
                                        <tr>
                                            <th className="px-4 py-2">Conta</th>
                                            <th className="px-4 py-2 text-right">Débito</th>
                                            <th className="px-4 py-2 text-right">Crédito</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {document.lines.map((line, idx) => (
                                            <tr key={idx} className="border-b border-border-subtle last:border-0">
                                                <td className="px-4 py-2">{line.accountName}</td>
                                                <td className="px-4 py-2 text-right text-blue-600 font-mono">
                                                    {line.type === 'Debit' ? line.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                                                </td>
                                                <td className="px-4 py-2 text-right text-red-600 font-mono">
                                                    {line.type === 'Credit' ? line.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
                                <label className="block text-sm font-bold text-orange-800 mb-2">
                                    Motivo do Estorno (Obrigatório)
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explique o porquê este documento está sendo anulado..."
                                    className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDocument(null)}
                                    className="px-6 py-2 text-text-secondary hover:bg-bg-subtle rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleReverse}
                                    disabled={loading || !reason}
                                    className="px-8 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    {loading ? 'Estornando...' : 'Confirmar Estorno (FB08)'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReversalPage;
