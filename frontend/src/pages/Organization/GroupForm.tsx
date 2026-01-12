import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import type { CreateGrupoEmpresarialDto } from '../../types/organization';
import { Save, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils';

export function GroupForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<CreateGrupoEmpresarialDto>({
        codigo: '',
        razaoSocialConsolidada: '',
        nomeFantasia: '',
        paisConsolidacao: 'Brasil', // Default
        moedaBase: 'BRL', // Default
        idiomaPadrao: 'pt-BR', // Default
        regimeFiscalConsolidado: 'Lucro Real', // Default
    });

    useEffect(() => {
        if (isEdit && id) {
            loadGroup(id);
        }
    }, [id]);

    const loadGroup = async (groupId: string) => {
        setLoading(true);
        try {
            const data = await OrganizationService.getGroupById(groupId);
            if (data) {
                setFormData({
                    codigo: data.codigo,
                    razaoSocialConsolidada: data.razaoSocialConsolidada,
                    nomeFantasia: data.nomeFantasia,
                    paisConsolidacao: data.paisConsolidacao,
                    moedaBase: data.moedaBase,
                    idiomaPadrao: data.idiomaPadrao,
                    regimeFiscalConsolidado: data.regimeFiscalConsolidado,
                });
            }
        } catch (error) {
            console.error("Failed to load group", error);
            // Add toast notification here
        } finally {
            setLoading(false);
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
            if (isEdit) {
                // Update logic (Not implemented in service yet, but UI is ready)
                console.log("Update not implemented");
            } else {
                await OrganizationService.createGroup(formData);
            }
            navigate('/admin/groups');
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando formulário...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/admin/groups')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {isEdit ? `Editar Grupo: ${formData.codigo}` : 'Novo Grupo Empresarial'}
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

            {/* Form Content */}
            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl grid grid-cols-2 gap-6">
                    {/* Section: Identificação */}
                    <div className="col-span-2 border-b border-border-default pb-2 mb-2 font-bold text-text-primary flex items-center">
                        Identificação
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Código *</label>
                        <input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            disabled={isEdit}
                            className={cn("w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none", isEdit && "bg-gray-100")}
                            required
                            maxLength={10}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Razão Social Consolidada *</label>
                        <input
                            type="text"
                            name="razaoSocialConsolidada"
                            value={formData.razaoSocialConsolidada}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Nome Fantasia *</label>
                        <input
                            type="text"
                            name="nomeFantasia"
                            value={formData.nomeFantasia}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Section: Configurações Regionais */}
                    <div className="col-span-2 border-b border-border-default pb-2 mb-2 mt-4 font-bold text-text-primary flex items-center">
                        Configurações Regionais
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">País de Consolidação *</label>
                        <input
                            type="text"
                            name="paisConsolidacao"
                            value={formData.paisConsolidacao}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Moeda Base (ISO) *</label>
                        <input
                            type="text"
                            name="moedaBase"
                            value={formData.moedaBase}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none font-mono"
                            required
                            maxLength={3}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Idioma Padrão *</label>
                        <input
                            type="text"
                            name="idiomaPadrao"
                            value={formData.idiomaPadrao}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            required
                            maxLength={5}
                        />
                    </div>

                    {/* Section: Fiscal */}
                    <div className="col-span-2 border-b border-border-default pb-2 mb-2 mt-4 font-bold text-text-primary flex items-center">
                        Fiscal
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Regime Fiscal Consolidado *</label>
                        <select
                            name="regimeFiscalConsolidado"
                            value={formData.regimeFiscalConsolidado}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                        >
                            <option value="Lucro Real">Lucro Real</option>
                            <option value="Lucro Presumido">Lucro Presumido</option>
                            <option value="Simples Nacional">Simples Nacional</option>
                        </select>
                    </div>

                </form>
            </div>
        </div>
    );
}
