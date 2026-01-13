import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessPartnerService } from '../../services/businessPartnerService';
import type { CreateBusinessPartnerDto, CreateAddressDto } from '../../types/crm';
import { Save, ArrowLeft } from 'lucide-react';
import { cepService } from '../../services/cepService';
import { toast } from 'react-hot-toast';

export function BusinessPartnerForm() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    // Address State (Simplification: Only one principal address for now in UI)
    const [address, setAddress] = useState<CreateAddressDto>({
        type: 'Fiscal',
        isPrincipal: true,
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        country: 'Brasil',
        zipCode: ''
    });

    const [formData, setFormData] = useState<CreateBusinessPartnerDto>({
        codigo: '',
        tipo: 'PessoaJuridica',
        razaoSocial: '',
        nomeFantasia: '',
        cpfCnpj: '',
        rgIe: '',
        addresses: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCepBlur = async () => {
        const cep = address.zipCode;
        if (cep && cep.replace(/\D/g, '').length === 8) {
            try {
                const fetchedAddress = await cepService.getAddressByCep(cep);
                if (fetchedAddress) {
                    setAddress(prev => ({
                        ...prev,
                        street: fetchedAddress.logradouro,
                        neighborhood: fetchedAddress.bairro,
                        city: fetchedAddress.localidade,
                        state: fetchedAddress.uf
                    }));
                    toast.success('Endereço encontrado!');
                } else {
                    toast.error('CEP não encontrado.');
                }
            } catch (error) {
                toast.error('Erro ao buscar CEP.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Merge address into formData
            const payload = { ...formData, addresses: [address] };
            await BusinessPartnerService.create(payload);
            navigate('/crm/bp');
        } catch (error) {
            console.error("Failed to save", error);
            alert("Erro ao salvar parceiro de negócio.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/crm/bp')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Novo Business Partner (BP02)</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {saving ? '...' : <Save size={16} className="mr-2" />}
                        {saving ? 'Salvando' : 'Salvar'}
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
                            value={formData.codigo || 'BPxxxx (Gerado Automaticamente)'}
                            disabled
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-bg-alt text-text-secondary cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Tipo *</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                        >
                            <option value="PessoaJuridica">Pessoa Jurídica</option>
                            <option value="PessoaFisica">Pessoa Física</option>
                        </select>
                    </div>

                    <div className="space-y-1 col-span-2">
                        <label className="block text-sm font-medium text-text-secondary">Razão Social / Nome Completo *</label>
                        <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required maxLength={150} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Nome Fantasia *</label>
                        <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} required maxLength={150} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">CPF / CNPJ *</label>
                        <input type="text" name="cpfCnpj" value={formData.cpfCnpj} onChange={handleChange} required maxLength={20} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none font-mono" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">RG / IE / IM</label>
                        <input type="text" name="rgIe" value={formData.rgIe} onChange={handleChange} maxLength={20} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    {/* Section: Endereço Principal */}
                    <div className="col-span-2 border-b border-border-default pb-2 mb-2 mt-4 font-bold text-text-primary flex items-center">
                        Endereço Principal
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">CEP *</label>
                        <input type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} onBlur={handleCepBlur} maxLength={9} placeholder="00000-000" required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1 col-span-1">
                        <label className="block text-sm font-medium text-text-secondary">Rua *</label>
                        <input type="text" name="street" value={address.street} onChange={handleAddressChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary">Número *</label>
                            <input type="text" name="number" value={address.number} onChange={handleAddressChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary">Cidade *</label>
                            <input type="text" name="city" value={address.city} onChange={handleAddressChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
