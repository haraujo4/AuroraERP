import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import type { Empresa } from '../../types/organization';
import { Save, ArrowLeft } from 'lucide-react';

export function CostCenterForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [saving, setSaving] = useState(false);
    const [companies, setCompanies] = useState<Empresa[]>([]);

    const [formData, setFormData] = useState({
        empresaId: '',
        codigo: '',
        descricao: '',
        responsavel: '',
        hierarquiaPaiId: ''
    });

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const groups = await OrganizationService.getGroups();
            if (groups.length > 0) {
                const comps = await OrganizationService.getCompaniesByGroup(groups[0].id);
                setCompanies(comps);
                if (comps.length > 0 && !formData.empresaId) {
                    setFormData(prev => ({ ...prev, empresaId: comps[0].id }));
                }
            }
        } catch (error) {
            console.error("Failed to load companies", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...formData };
            if (!payload.hierarquiaPaiId) delete (payload as any).hierarquiaPaiId;
            if (!payload.codigo) (payload as any).codigo = 'Generating...'; // Placeholder to avoid empty string if required

            await OrganizationService.createCostCenter(payload);
            navigate('/admin/cost-centers');
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
                    <button onClick={() => navigate('/admin/cost-centers')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {isEdit ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
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
                        <label className="block text-sm font-medium text-text-secondary">Empresa *</label>
                        <select
                            name="empresaId"
                            value={formData.empresaId}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none bg-white"
                            required
                        >
                            <option value="">Selecione...</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.nomeFantasia}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Código *</label>
                        <input
                            type="text"
                            name="codigo"
                            value={formData.codigo || 'CCxxxx (Auto)'}
                            disabled
                            className="w-full p-2 border border-border-input rounded bg-bg-alt text-text-secondary cursor-not-allowed outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Responsável *</label>
                        <input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} required maxLength={100} className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1 col-span-2">
                        <label className="block text-sm font-medium text-text-secondary">Descrição *</label>
                        <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required maxLength={100} className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none" />
                    </div>
                </form>
            </div>
        </div>
    );
}
