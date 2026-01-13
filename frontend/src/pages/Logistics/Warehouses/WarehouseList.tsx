import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../../services/organizationService';
import type { Branch, Deposito } from '../../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';

export function WarehouseList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [warehouses, setWarehouses] = useState<Deposito[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBranches();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            loadWarehouses(selectedBranch);
        } else {
            setWarehouses([]);
        }
    }, [selectedBranch]);

    const loadBranches = async () => {
        try {
            const data = await OrganizationService.getBranches();
            setBranches(data);
            if (data.length > 0) {
                setSelectedBranch(data[0].id);
            }
        } catch (error) {
            console.error("Failed to load branches", error);
        }
    };

    const loadWarehouses = async (branchId: string) => {
        setLoading(true);
        try {
            const data = await OrganizationService.getWarehousesByBranch(branchId);
            setWarehouses(data);
        } catch (error) {
            console.error("Failed to load warehouses", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWarehouses = warehouses.filter(w =>
        searchTerm === '' ||
        w.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Depósitos (WR01)</h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <Filter size={16} className="text-text-secondary" />
                        <span className="text-text-secondary">Filial:</span>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="p-1 border border-border-input rounded focus:border-brand-primary outline-none"
                        >
                            <option value="">Selecione...</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.descricao}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => selectedBranch && loadWarehouses(selectedBranch)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/logistics/warehouses/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Depósito
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Código</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Descrição</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Tipo</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Lotes</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Série</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : warehouses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-secondary">
                                    {selectedBranch ? 'Nenhum depósito encontrado nesta filial.' : 'Selecione uma filial para visualizar.'}
                                </td>
                            </tr>
                        ) : (
                            filteredWarehouses.map((w) => (
                                <tr key={w.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{w.codigo}</td>
                                    <td className="p-3 font-medium">{w.descricao}</td>
                                    <td className="p-3">{w.tipo}</td>
                                    <td className="p-3">{w.controlaLote ? 'Sim' : 'Não'}</td>
                                    <td className="p-3">{w.controlaSerie ? 'Sim' : 'Não'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
