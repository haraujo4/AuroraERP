import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { materialService } from '../../../services/materialService';
import type { Material } from '../../../types/materials';
import { Plus, Package, Edit, Trash } from 'lucide-react';
import { ALVGrid } from '../../../components/Common/ALVGrid';
import type { Column } from '../../../components/Common/ALVGrid';

export function MaterialList() {
    const navigate = useNavigate();
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
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-border-secondary flex justify-between items-center shadow-sm z-20">
                <div>
                    <h1 className="text-xl font-bold text-text-primary flex items-center gap-2 tracking-tight">
                        <Package className="w-5 h-5 text-brand-primary" />
                        Gestão de Materiais
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default uppercase">MM02</span>
                        <p className="text-text-secondary text-xs">Mestre de Materiais e Serviços</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/logistics/materials/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-brand-secondary transition-all shadow-sm active:transform active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    CRIAR MATERIAL
                </button>
            </div>

            {/* Content Contextualized */}
            <div className="flex-1 overflow-hidden p-4">
                <ALVGrid
                    title="Catálogo de Materiais"
                    tCode="MM02-LIST"
                    data={materials}
                    columns={columns}
                    loading={loading}
                    onRowClick={(m) => navigate(`/logistics/materials/${m.id}`)}
                />
            </div>
        </div>
    );
}
