import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { productionService } from '../../../services/productionService';
import type { BillOfMaterial } from '../../../types/production';

export function BillOfMaterialList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [boms, setBoms] = useState<BillOfMaterial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await productionService.getBOMs();
            setBoms(data);
        } catch (error) {
            console.error('Failed to load BOMs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBoms = boms.filter(bom =>
        searchTerm === '' ||
        bom.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bom.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Listas de Materiais (CS01)</h1>
                <button
                    onClick={() => navigate('/production/boms/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Nova Lista
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
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Produto</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Descrição</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase w-32">Qtd Base</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBoms.map((bom) => (
                                    <tr key={bom.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 text-sm font-medium">{bom.productName}</td>
                                        <td className="px-4 py-3 text-sm">{bom.description}</td>
                                        <td className="px-4 py-3 text-sm text-right">{bom.baseQuantity}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                className="text-gray-500 hover:text-brand-primary p-1"
                                                title="Detalhes"
                                            >
                                                <Settings size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
