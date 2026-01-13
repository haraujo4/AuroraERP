import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';
import { inventoryService } from '../../../services/inventoryService';
import type { StockLevel } from '../../../types/inventory';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';
import { formatDate } from '../../../utils';

export function StockList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [stocks, setStocks] = useState<StockLevel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        setLoading(true);
        try {
            const data = await inventoryService.getAll();
            setStocks(data);
        } catch (error) {
            console.error('Failed to load stock levels:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: Column<StockLevel>[] = [
        { key: 'materialName', label: 'Material', sortable: true },
        { key: 'depositoName', label: 'Depósito', sortable: true, width: '200px' },
        {
            key: 'batchNumber',
            label: 'Lote / Série',
            width: '150px',
            render: (val) => val ? (
                <span className="bg-brand-secondary/10 text-brand-secondary px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                    {val}
                </span>
            ) : '-'
        },
        { key: 'quantity', label: 'Quantidade', width: '120px', align: 'right' },
        {
            key: 'lastUpdated',
            label: 'Última Atualização',
            width: '180px',
            render: (val) => formatDate(val)
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Visão Geral de Estoque</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">MMBE</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadStocks} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/logistics/inventory/movement')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <ArrowRightLeft size={14} className="mr-2" />
                        NOVO MOVIMENTO
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={stocks}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(stock) => navigate(`/logistics/inventory/movement?materialId=${stock.materialId}`)}
                />
            </div>
        </div>
    );
}
