import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../../services/organizationService';
import type { Branch, Deposito } from '../../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';

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

    const columns: Column<Deposito>[] = [
        { key: 'codigo', label: 'Código', sortable: true, width: '120px' },
        { key: 'descricao', label: 'Descrição', sortable: true },
        { key: 'tipo', label: 'Tipo', width: '120px', render: (val) => val.toUpperCase() },
        { key: 'controlaLote', label: 'Lote', width: '80px', align: 'center', render: (val) => val ? 'SIM' : 'NÃO' },
        { key: 'controlaSerie', label: 'Série', width: '80px', align: 'center', render: (val) => val ? 'SIM' : 'NÃO' }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Gestão de Depósitos</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default uppercase">WR01</span>
                    </div>

                    <div className="h-6 w-[1px] bg-border-default mx-1" />

                    <div className="flex items-center space-x-2 text-xs">
                        <Filter size={14} className="text-text-secondary" />
                        <span className="text-text-secondary font-medium uppercase tracking-tight">Filial:</span>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="p-1.5 bg-bg-secondary border border-border-default rounded text-xs font-bold text-brand-primary outline-none focus:ring-1 focus:ring-brand-primary min-w-[150px]"
                        >
                            <option value="">Selecione...</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.descricao.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => selectedBranch && loadWarehouses(selectedBranch)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/logistics/warehouses/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO DEPÓSITO
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={warehouses}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(w) => navigate(`/logistics/warehouses/${w.id}`)}
                />
            </div>
        </div>
    );
}
