import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrganizationService } from '../../../services/organizationService';
import type { Deposito } from '../../../types/organization';
import { Save, ArrowLeft } from 'lucide-react';

export function StorageLocationForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [saving, setSaving] = useState(false);
    const [warehouses, setWarehouses] = useState<Deposito[]>([]);

    const [formData, setFormData] = useState({
        depositoId: '',
        codigo: '',
        tipo: 'Estante',
        permitePicking: true,
        permiteInventario: true
    });

    useEffect(() => {
        loadWarehouses();
    }, []);

    const loadWarehouses = async () => {
        try {
            const branches = await OrganizationService.getBranches();
            let allWarehouses: Deposito[] = [];
            for (const b of branches) {
                const whs = await OrganizationService.getWarehousesByBranch(b.id);
                allWarehouses = [...allWarehouses, ...whs];
            }
            setWarehouses(allWarehouses);
            if (allWarehouses.length > 0 && !formData.depositoId) {
                setFormData(prev => ({ ...prev, depositoId: allWarehouses[0].id }));
            }
        } catch (error) {
            console.error("Failed to load warehouses", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await OrganizationService.createStorageLocation(formData);
            navigate('/logistics/storage-locations');
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/logistics/storage-locations')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {isEdit ? 'Editar Local' : 'Novo Local'}
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {saving ? 'O' : <Save size={16} className="mr-2" />}
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm p-6">
                <form onSubmit={handleSubmit} className="max-w-2xl grid grid-cols-2 gap-6">
                    <div className="space-y-1 col-span-2">
                        <label className="block text-sm font-medium text-text-secondary">Depósito *</label>
                        <select
                            name="depositoId"
                            value={formData.depositoId}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none bg-white"
                            required
                        >
                            <option value="">Selecione...</option>
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.descricao}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Código *</label>
                        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required maxLength={10} className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Tipo *</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none bg-white"
                        >
                            <option value="Estante">Estante</option>
                            <option value="Palete">Palete</option>
                            <option value="Bloco">Bloco</option>
                            <option value="Docas">Docas</option>
                        </select>
                    </div>

                    <div className="col-span-2 flex gap-8 pt-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="permitePicking" checked={formData.permitePicking} onChange={handleChange} className="w-4 h-4 text-brand-primary border-border-input rounded" />
                            <span className="text-sm font-medium text-text-secondary">Permite Picking</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="permiteInventario" checked={formData.permiteInventario} onChange={handleChange} className="w-4 h-4 text-brand-primary border-border-input rounded" />
                            <span className="text-sm font-medium text-text-secondary">Permite Inventário</span>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
}
