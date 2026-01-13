import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { productionService } from '../../../services/productionService';
import type { WorkCenter } from '../../../types/production';

export function WorkCenterList() {
    const navigate = useNavigate();
    const [centers, setCenters] = useState<WorkCenter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await productionService.getWorkCenters();
            setCenters(data);
        } catch (error) {
            console.error('Failed to load work centers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Centros de Trabalho</h1>
                <button
                    onClick={() => navigate('/production/work-centers/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Novo Centro
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
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase w-32">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Nome</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase w-24">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {centers.map((center) => (
                                    <tr key={center.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 text-sm font-mono">{center.code}</td>
                                        <td className="px-4 py-3 text-sm">{center.name}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${center.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {center.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
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
