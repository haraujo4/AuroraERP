import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../../services/organizationService';
import type { Deposito, LocalEstoque } from '../../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';

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
            // This is a bit complex as warehouses depend on branch.
            // Simplified: fetch all warehouses if service supports, or fetch branches then warehouses.
            // Let's assume we fetch all for now, or use a cascading filter in a real UI.
            // For list view, let's just fetch all branches then all warehouses for simplicity.
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

    const filteredLocations = locations.filter(l =>
        searchTerm === '' ||
        l.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Locais de Estoque (SL01)</h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <Filter size={16} className="text-text-secondary" />
                        <span className="text-text-secondary">Depósito:</span>
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="p-1 border border-border-input rounded focus:border-brand-primary outline-none"
                        >
                            <option value="">Selecione...</option>
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.descricao}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => selectedWarehouse && loadLocations(selectedWarehouse)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/logistics/storage-locations/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo Local
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Código</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Tipo</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Picking</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Inventário</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : locations.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-text-secondary">
                                    {selectedWarehouse ? 'Nenhum local de estoque encontrado neste depósito.' : 'Selecione um depósito para visualizar.'}
                                </td>
                            </tr>
                        ) : (
                            filteredLocations.map((l) => (
                                <tr key={l.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{l.codigo}</td>
                                    <td className="p-3">{l.tipo}</td>
                                    <td className="p-3">{l.permitePicking ? 'Sim' : 'Não'}</td>
                                    <td className="p-3">{l.permiteInventario ? 'Sim' : 'Não'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
