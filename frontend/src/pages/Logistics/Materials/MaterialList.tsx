import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { materialService } from '../../../services/materialService';
import type { Material } from '../../../types/materials';
import { Plus, Edit, Trash, RefreshCw } from 'lucide-react';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';

export function MaterialList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        try {
            const data = await materialService.getAll();
            setMaterials(data);
        } catch (error) {
            console.error('Failed to load materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este material?')) {
            try {
                await materialService.delete(id);
                loadMaterials();
            } catch (error) {
                console.error('Failed to delete material:', error);
            }
        }
    };

    const columns: Column<Material>[] = [
        { key: 'code', label: 'Código', sortable: true, width: '120px' },
        { key: 'description', label: 'Descrição', sortable: true },
        {
            key: 'type',
            label: 'Tipo',
            sortable: true,
            width: '100px',
            render: (value) => (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                    {value}
                </span>
            )
        },
        { key: 'group', label: 'Grupo', sortable: true, width: '120px' },
        { key: 'unitOfMeasure', label: 'Unid.', width: '80px', align: 'center' },
        {
            key: 'basePrice',
            label: 'Preço Base',
            align: 'right',
            width: '120px',
            render: (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
        },
        {
            key: 'actions',
            label: 'Ações',
            align: 'right',
            width: '80px',
            render: (_, material) => (
                <div className="flex justify-end gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/logistics/materials/${material.id}`); }}
                        className="p-1 text-text-secondary hover:text-brand-primary transition-colors"
                        title="Editar"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(material.id); }}
                        className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                        title="Excluir"
                    >
                        <Trash className="w-3.5 h-3.5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Mestre de Materiais</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">MM02</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadMaterials} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/logistics/materials/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO MATERIAL
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={materials}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(m) => navigate(`/logistics/materials/${m.id}`)}
                />
            </div>
        </div>
    );
}
