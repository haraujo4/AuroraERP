import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BusinessPartnerService } from '../../services/businessPartnerService';
import type { CreateBusinessPartnerDto, CreateAddressDto, CreateContactDto } from '../../types/crm';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { cepService } from '../../services/cepService';
import { toast } from 'react-hot-toast';

export function BusinessPartnerForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const [contacts, setContacts] = useState<CreateContactDto[]>([
        { name: '', email: '', phone: '', role: 'Principal' }
    ]);

    const [formData, setFormData] = useState<CreateBusinessPartnerDto>({
        codigo: '',
        tipo: 'PessoaJuridica',
        razaoSocial: '',
        nomeFantasia: '',
        cpfCnpj: '',
        rgIe: '',
        addresses: [],
        contacts: []
    });

    useEffect(() => {
        if (isEdit && id) {
            loadBusinessPartner(id);
        }
    }, [id]);

    const loadBusinessPartner = async (bpId: string) => {
        setLoading(true);
        try {
            const data = await BusinessPartnerService.getById(bpId);
            setFormData({
                codigo: data.codigo,
                tipo: data.tipo,
                razaoSocial: data.razaoSocial,
                nomeFantasia: data.nomeFantasia,
                cpfCnpj: data.cpfCnpj,
                rgIe: data.rgIe,
                addresses: data.addresses,
                contacts: data.contacts
            });

            if (data.addresses && data.addresses.length > 0) {
                // Find principal or use first
                const principal = data.addresses.find(a => a.isPrincipal) || data.addresses[0];
                setAddress({
                    type: principal.type,
                    isPrincipal: true, // Force UI to treat as editing principal
                    street: principal.street,
                    number: principal.number,
                    complement: principal.complement,
                    neighborhood: principal.neighborhood,
                    city: principal.city,
                    state: principal.state,
                    country: principal.country,
                    zipCode: principal.zipCode
                });
            }

            if (data.contacts && data.contacts.length > 0) {
                setContacts(data.contacts.map(c => ({
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    role: c.role
                })));
            }
        } catch (error) {
            console.error("Error loading BP", error);
            toast.error("Erro ao carregar dados do parceiro.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    // Contacts Logic
    const handleContactChange = (index: number, field: keyof CreateContactDto, value: string) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    const addContact = () => {
        setContacts([...contacts, { name: '', email: '', phone: '', role: 'Comercial' }]);
    };

    const removeContact = (index: number) => {
        if (contacts.length === 1) return; // Prevent deleting last/only
        setContacts(contacts.filter((_, i) => i !== index));
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
            // Merge address and contacts into formData
            // We use the single address form as the "addresses" list for now
            const payload = {
                ...formData,
                addresses: [address],
                contacts: contacts.filter(c => c.name) // Filter empty rows if any
            };

            if (isEdit && id) {
                await BusinessPartnerService.update(id, payload);
                toast.success('Parceiro atualizado com sucesso!');
            } else {
                await BusinessPartnerService.create(payload);
                toast.success('Parceiro criado com sucesso!');
            }
            navigate('/crm/bp');
        } catch (error) {
            console.error("Failed to save", error);
            toast.error("Erro ao salvar parceiro de negócio.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/crm/bp')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">{isEdit ? 'Editar Business Partner' : 'Novo Business Partner (BP02)'}</h1>
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
                        <label className="block text-sm font-medium text-text-secondary">Código</label>
                        <input
                            type="text"
                            name="codigo"
                            value={formData.codigo || (isEdit ? '' : 'BPxxxx (Gerado Automaticamente)')}
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

                    {/* Section: Contatos */}
                    <div className="col-span-2 border-b border-border-default pb-2 mb-2 mt-4 font-bold text-text-primary flex items-center justify-between">
                        <span>Contatos</span>
                        <button type="button" onClick={addContact} className="text-xs flex items-center text-brand-primary hover:underline">
                            <Plus size={14} className="mr-1" /> Adicionar
                        </button>
                    </div>

                    <div className="col-span-2 space-y-3">
                        {contacts.map((contact, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end border p-2 rounded bg-bg-alt/30">
                                <div className="col-span-4">
                                    <label className="block text-xs font-medium text-text-secondary">Nome</label>
                                    <input type="text" value={contact.name} onChange={e => handleContactChange(index, 'name', e.target.value)} className="w-full p-1.5 text-sm border border-border-input rounded outline-none" placeholder="Nome do contato" />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-xs font-medium text-text-secondary">E-mail</label>
                                    <input type="email" value={contact.email} onChange={e => handleContactChange(index, 'email', e.target.value)} className="w-full p-1.5 text-sm border border-border-input rounded outline-none" placeholder="email@exemplo.com" />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-medium text-text-secondary">Telefone</label>
                                    <input type="text" value={contact.phone} onChange={e => handleContactChange(index, 'phone', e.target.value)} className="w-full p-1.5 text-sm border border-border-input rounded outline-none" placeholder="(00) 0000-0000" />
                                </div>
                                <div className="col-span-1 flex justify-center pb-2">
                                    <button type="button" onClick={() => removeContact(index)} className="text-red-500 hover:text-red-700" title="Remover">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
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
                            <label className="block text-sm font-medium text-text-secondary">Complemento</label>
                            <input type="text" name="complement" value={address.complement || ''} onChange={handleAddressChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Bairro</label>
                        <input type="text" name="neighborhood" value={address.neighborhood || ''} onChange={handleAddressChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-text-secondary">Cidade *</label>
                            <input type="text" name="city" value={address.city} onChange={handleAddressChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                        </div>
                        <div className="w-24">
                            <label className="block text-sm font-medium text-text-secondary">Estado *</label>
                            <input type="text" name="state" value={address.state} onChange={handleAddressChange} required maxLength={2} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-center uppercase" placeholder="UF" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">País</label>
                        <input type="text" name="country" value={address.country || 'Brasil'} onChange={handleAddressChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>
                </form>
            </div>
        </div>
    );
}
