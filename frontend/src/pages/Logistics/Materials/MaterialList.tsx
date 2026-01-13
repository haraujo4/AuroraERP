import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { materialService } from '../../../services/materialService';
import type { Material } from '../../../types/materials';
import { Plus, Package, Edit, Trash } from 'lucide-react';

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

    const filteredMaterials = materials.filter(m =>
        searchTerm === '' ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Header */}
            <div className="p-4 bg-white border-b border-border-secondary flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Package className="w-6 h-6 text-brand-primary" />
                        Gestão de Materiais (MM02)
                    </h1>
                    <p className="text-text-secondary text-sm">Gerencie produtos, serviços e ativos</p>
                </div>
                <button
                    onClick={() => navigate('/logistics/materials/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Novo Material
                </button>
            </div>



            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-text-secondary">Carregando materiais...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-border-default overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-secondary text-text-secondary text-xs uppercase font-semibold">
                                    <th className="p-4 border-b border-border-defaults">Código</th>
                                    <th className="p-4 border-b border-border-default">Descrição</th>
                                    <th className="p-4 border-b border-border-default">Tipo</th>
                                    <th className="p-4 border-b border-border-default">Grupo</th>
                                    <th className="p-4 border-b border-border-default">Unid.</th>
                                    <th className="p-4 border-b border-border-default text-right">Preço Base</th>
                                    <th className="p-4 border-b border-border-default text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default">
                                {filteredMaterials.map((material) => (
                                    <tr key={material.id} className="hover:bg-bg-secondary/50 transition-colors">
                                        <td className="p-4 font-medium text-text-primary">{material.code}</td>
                                        <td className="p-4 text-text-secondary">{material.description}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {material.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary">{material.group || '-'}</td>
                                        <td className="p-4 text-text-secondary">{material.unitOfMeasure}</td>
                                        <td className="p-4 text-text-primary text-right font-mono">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(material.basePrice)}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => navigate(`/logistics/materials/${material.id}`)}
                                                className="p-1 text-text-secondary hover:text-brand-primary transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(material.id)}
                                                className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredMaterials.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-text-secondary">
                                            Nenhum material encontrado com sua busca.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
