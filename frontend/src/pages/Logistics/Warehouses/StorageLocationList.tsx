import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../../services/organizationService';
import type { Deposito, LocalEstoque } from '../../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';

export function StorageLocationList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [locations, setLocations] = useState<LocalEstoque[]>([]);
    const [warehouses, setWarehouses] = useState<Deposito[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadWarehouses();
    }, []);

    useEffect(() => {
        if (selectedWarehouse) {
            loadLocations(selectedWarehouse);
        } else {
            setLocations([]);
        }
    }, [selectedWarehouse]);

    const loadWarehouses = async () => {
        try {
            const branches = await OrganizationService.getBranches();
            let allWarehouses: Deposito[] = [];
            for (const b of branches) {
                const whs = await OrganizationService.getWarehousesByBranch(b.id);
                allWarehouses = [...allWarehouses, ...whs];
            }
            setWarehouses(allWarehouses);
            if (allWarehouses.length > 0) {
                setSelectedWarehouse(allWarehouses[0].id);
            }
        } catch (error) {
            console.error("Failed to load warehouses", error);
        }
    };

    const loadLocations = async (warehouseId: string) => {
        setLoading(true);
        try {
            const data = await OrganizationService.getStorageLocationsByWarehouse(warehouseId);
            setLocations(data);
        } catch (error) {
            console.error("Failed to load locations", error);
        } finally {
            setLoading(false);
        }
    };

    const columns: Column<LocalEstoque>[] = [
        { key: 'codigo', label: 'Código', sortable: true, width: '120px' },
        { key: 'tipo', label: 'Tipo', sortable: true, width: '150px' },
        { key: 'permitePicking', label: 'Picking', width: '100px', align: 'center', render: (val) => val ? 'SIM' : 'NÃO' },
        { key: 'permiteInventario', label: 'Inventário', width: '100px', align: 'center', render: (val) => val ? 'SIM' : 'NÃO' }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Locais de Estoque</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default uppercase">SL01</span>
                    </div>

                    <div className="h-6 w-[1px] bg-border-default mx-1" />

                    <div className="flex items-center space-x-2 text-xs">
                        <Filter size={14} className="text-text-secondary" />
                        <span className="text-text-secondary font-medium uppercase tracking-tight">Depósito:</span>
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="p-1.5 bg-bg-secondary border border-border-default rounded text-xs font-bold text-brand-primary outline-none focus:ring-1 focus:ring-brand-primary min-w-[150px]"
                        >
                            <option value="">Selecione...</option>
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.descricao.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => selectedWarehouse && loadLocations(selectedWarehouse)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/logistics/storage-locations/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO LOCAL
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={locations}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(l) => navigate(`/logistics/storage-locations/${l.id}`)}
                />
            </div>
        </div>
    );
}
