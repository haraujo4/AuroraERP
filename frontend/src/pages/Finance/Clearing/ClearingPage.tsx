import { useEffect, useState } from 'react';
import { RefreshCcw, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { clearingService } from '../../../services/clearingService';
import type { OpenItem } from '../../../services/clearingService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import { format } from 'date-fns';
import type { BusinessPartner } from '../../../types/crm';

export function ClearingPage() {
    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [selectedPartners, setSelectedPartners] = useState<BusinessPartner[]>([]);
    const [openItems, setOpenItems] = useState<OpenItem[]>([]);
    const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = async () => {
        try {
            const data = await BusinessPartnerService.getAll();
            setPartners(data);
        } catch (error) {
            console.error('Failed to load partners:', error);
        }
    };

    const addPartner = async (partnerId: string) => {
        if (!partnerId) return;
        if (selectedPartners.find(p => p.id === partnerId)) return;

        const partner = partners.find(p => p.id === partnerId);
        if (!partner) return;

        setSelectedPartners(prev => [...prev, partner]);
        setLoading(true);
        try {
            const data = await clearingService.getOpenItems(partnerId);
            // Append new items, avoiding duplicates if any
            setOpenItems(prev => {
                const existingIds = new Set(prev.map(i => i.lineId));
                const newItems = data.filter(i => !existingIds.has(i.lineId));
                return [...prev, ...newItems].sort((a, b) => new Date(a.postingDate).getTime() - new Date(b.postingDate).getTime());
            });
        } catch (error) {
            console.error('Failed to load open items:', error);
        } finally {
            setLoading(false);
        }
    };

    const removePartner = (partnerId: string) => {
        setSelectedPartners(prev => prev.filter(p => p.id !== partnerId));
        setOpenItems(prev => prev.filter(item => item.businessPartnerId !== partnerId));
        // Also remove selected lines belonging to this partner
        const partnerItems = openItems.filter(i => i.businessPartnerId === partnerId);
        const partnerLineIds = new Set(partnerItems.map(i => i.lineId));
        setSelectedLineIds(prev => prev.filter(id => !partnerLineIds.has(id)));
    };

    const toggleLineSelection = (id: string) => {
        setSelectedLineIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const calculateBalance = () => {
        return openItems
            .filter(item => selectedLineIds.includes(item.lineId))
            .reduce((acc, item) => {
                return item.type === 'Debit' ? acc + item.amount : acc - item.amount;
            }, 0);
    };

    const handleClear = async () => {
        const balance = calculateBalance();

        let confirmMessage = 'Deseja realmente compensar as partidas selecionadas?';

        if (Math.abs(balance) > 0.01) {
            confirmMessage = `O saldo selecionado é de ${balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.\n\nSerá criado um novo lançamento RESIDUAL com este valor para manter a contabilidade balanceada.\n\nDeseja continuar?`;
        }

        if (!confirm(confirmMessage)) return;

        setProcessing(true);
        try {
            await clearingService.clearManual({ lineIds: selectedLineIds });
            alert('Compensação realizada com sucesso!');

            // Reload all partners in the list
            const updatedItems: OpenItem[] = [];
            setLoading(true);
            for (const p of selectedPartners) {
                const data = await clearingService.getOpenItems(p.id);
                updatedItems.push(...data);
            }
            setOpenItems(updatedItems.sort((a, b) => new Date(a.postingDate).getTime() - new Date(b.postingDate).getTime()));
            setSelectedLineIds([]);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erro ao realizar compensação');
        } finally {
            setLoading(false);
            setProcessing(false);
        }
    };

    const balance = calculateBalance();
    const canClear = selectedLineIds.length > 0; // Removed balance check for button enablement

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Compensação Manual (F-32/F-44)</h1>
                    <p className="text-sm text-text-secondary">Abatimento de partidas em aberto (Multi-Parceiro)</p>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-border-default space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Adicionar Parceiro</label>
                            <select
                                className="w-full border border-border-default rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none"
                                value=""
                                onChange={(e) => addPartner(e.target.value)}
                            >
                                <option value="">Pesquisar parceiro...</option>
                                {partners.filter(p => !selectedPartners.find(sp => sp.id === p.id)).map(p => (
                                    <option key={p.id} value={p.id}>{p.razaoSocial} ({p.cpfCnpj})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedPartners.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedPartners.map(p => (
                                <div key={p.id} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 text-sm font-medium">
                                    {p.razaoSocial}
                                    <button onClick={() => removePartner(p.id)} className="hover:text-red-500 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 bg-white rounded-lg shadow-sm border border-border-default overflow-hidden flex flex-col">
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-bg-secondary sticky top-0 border-b border-border-default z-10">
                                <tr>
                                    <th className="px-4 py-3 w-10"></th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase">Data Postagem</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase">Parceiro</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase">Tipo Doc.</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase">Descrição / Documento</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase">Referência</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase text-right">Débito</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase text-right">Crédito</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && openItems.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center py-8">Carregando partidas...</td></tr>
                                ) : openItems.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center py-8 text-text-secondary">Adicione parceiros para ver as partidas em aberto.</td></tr>
                                ) : (
                                    openItems.map(item => {
                                        const partnerName = selectedPartners.find(sp => sp.id === item.businessPartnerId)?.razaoSocial || 'N/A';
                                        return (
                                            <tr key={item.lineId} className={`border-b border-border-default hover:bg-bg-subtle cursor-pointer ${selectedLineIds.includes(item.lineId) ? 'bg-blue-50' : ''}`}
                                                onClick={() => toggleLineSelection(item.lineId)}>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLineIds.includes(item.lineId)}
                                                        onChange={() => { }} // Handled by tr onClick
                                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-sm">{format(new Date(item.postingDate), 'dd/MM/yyyy')}</td>
                                                <td className="px-4 py-3 text-xs font-medium text-gray-600 truncate max-w-[150px]" title={partnerName}>{partnerName}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.journalEntryType === 'Standard' ? 'bg-gray-100 text-gray-700' :
                                                        item.journalEntryType === 'Reversal' ? 'bg-orange-100 text-orange-700' :
                                                            item.journalEntryType === 'Invoice' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {item.journalEntryType === 'Standard' ? 'Normal' :
                                                            item.journalEntryType === 'Reversal' ? 'Estorno' :
                                                                item.journalEntryType === 'Invoice' ? 'Fatura' : item.journalEntryType}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium">{item.description}</div>
                                                    <div className="text-xs text-text-secondary">{item.accountName}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-mono">{item.reference}</td>
                                                <td className="px-4 py-3 text-right text-sm font-mono text-blue-600">
                                                    {item.type === 'Debit' ? item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-mono text-red-600">
                                                    {item.type === 'Credit' ? item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-bg-secondary p-4 border-t border-border-default flex items-center justify-between">
                        <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-xs text-text-secondary uppercase font-bold">Itens Selecionados</span>
                                <span className="text-lg font-bold">{selectedLineIds.length}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-text-secondary uppercase font-bold">Saldo Seleção</span>
                                <span className={`text-lg font-bold ${Math.abs(balance) < 0.01 ? 'text-status-success' : 'text-status-error'}`}>
                                    {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            {selectedLineIds.length > 0 && Math.abs(balance) > 0.01 && (
                                <div className="flex items-center gap-2 text-status-error text-sm font-medium">
                                    <AlertCircle size={16} />
                                    O saldo deve ser zero
                                </div>
                            )}
                            {canClear && (
                                <div className="flex items-center gap-2 text-status-success text-sm font-medium">
                                    <CheckCircle2 size={16} />
                                    Pronto para compensar
                                </div>
                            )}
                            <button
                                disabled={!canClear || processing}
                                onClick={handleClear}
                                className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                            >
                                {processing && <RefreshCcw size={16} className="animate-spin" />}
                                Postar Compensação
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


