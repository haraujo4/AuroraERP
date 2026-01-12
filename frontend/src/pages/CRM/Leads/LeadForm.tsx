import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadService } from '../../../services/leadService';
import type { CreateLeadDto } from '../../../types/crm-leads';
import { Save, ArrowLeft } from 'lucide-react';

export function LeadForm() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<CreateLeadDto>({
        title: '',
        source: 'Website',
        contactName: '',
        email: '',
        phone: '',
        companyName: '',
        estimatedValue: 0,
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await LeadService.create(formData);
            navigate('/crm/leads');
        } catch (error) {
            console.error("Failed to save lead", error);
            alert("Erro ao salvar Lead.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/crm/leads')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Novo Lead</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {saving ? '...' : <Save size={16} className="mr-2" />}
                        {saving ? 'Salvar' : 'Salvar'}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl grid grid-cols-2 gap-6">

                    <div className="col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Título / Assunto *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required autoFocus className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Nome do Contato *</label>
                        <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Nome da Empresa</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Telefone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Origem *</label>
                        <select name="source" value={formData.source} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white">
                            <option value="Website">Website</option>
                            <option value="Indicação">Indicação</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Feira/Evento">Feira/Evento</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Valor Estimado</label>
                        <input type="number" step="0.01" name="estimatedValue" value={formData.estimatedValue} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Observações</label>
                        <textarea rows={4} name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"></textarea>
                    </div>

                </form>
            </div>
        </div>
    );
}
