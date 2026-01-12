import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import { OrganizationService as GroupService } from '../../services/organizationService';
import type { GrupoEmpresarial } from '../../types/organization';
import { Save, ArrowLeft } from 'lucide-react';

interface CreateEmpresaFormData {
    grupoEmpresarialId: string;
    codigo: string;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    inscricaoEstadual: string;
    inscricaoMunicipal: string;
    cnaePrincipal: string;
    naturezaJuridica: string;
    regimeTributario: string;
    moedaLocal: string;
    enderecoFiscal: {
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
}

export function CompanyForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id; // Not fully supported in API yet

    const [saving, setSaving] = useState(false);
    const [groups, setGroups] = useState<GrupoEmpresarial[]>([]);

    const [formData, setFormData] = useState<CreateEmpresaFormData>({
        grupoEmpresarialId: '',
        codigo: '',
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
        inscricaoEstadual: '',
        inscricaoMunicipal: '',
        cnaePrincipal: '',
        naturezaJuridica: '',
        regimeTributario: 'Lucro Real',
        moedaLocal: 'BRL',
        enderecoFiscal: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            country: 'Brasil',
            zipCode: ''
        }
    });

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const data = await GroupService.getGroups();
            setGroups(data);
            if (data.length > 0 && !formData.grupoEmpresarialId) {
                setFormData(prev => ({ ...prev, grupoEmpresarialId: data[0].id }));
            }
        } catch (error) {
            console.error("Failed to load groups", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('addr.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                enderecoFiscal: { ...prev.enderecoFiscal, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                console.log("Edit not implemented");
            } else {
                await OrganizationService.createCompany(formData); // Assume createCompany exists or add type to service
            }
            navigate('/admin/companies');
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/admin/companies')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {isEdit ? 'Editar Empresa' : 'Nova Empresa'}
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
                        <label className="block text-sm font-medium text-text-secondary">Grupo Empresarial *</label>
                        <select
                            name="grupoEmpresarialId"
                            value={formData.grupoEmpresarialId}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                            required
                        >
                            <option value="">Selecione...</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.nomeFantasia}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Código *</label>
                        <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required maxLength={10} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1 col-span-2">
                        <label className="block text-sm font-medium text-text-secondary">Razão Social *</label>
                        <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required maxLength={100} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Nome Fantasia *</label>
                        <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} required maxLength={100} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">CNPJ *</label>
                        <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required maxLength={14} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none font-mono" />
                    </div>

                    {/* Section: Endereço Fiscal */}
                    <div className="col-span-2 border-b border-border-default pb-2 mb-2 mt-4 font-bold text-text-primary flex items-center">
                        Endereço Fiscal
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">CEP *</label>
                        <input type="text" name="addr.zipCode" value={formData.enderecoFiscal.zipCode} onChange={handleChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1 col-span-1">
                        <label className="block text-sm font-medium text-text-secondary">Rua *</label>
                        <input type="text" name="addr.street" value={formData.enderecoFiscal.street} onChange={handleChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1 col-span-1 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary">Número *</label>
                            <input type="text" name="addr.number" value={formData.enderecoFiscal.number} onChange={handleChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary">Comp.</label>
                            <input type="text" name="addr.complement" value={formData.enderecoFiscal.complement} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
