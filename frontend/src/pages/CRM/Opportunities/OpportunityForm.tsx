import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OpportunityService } from '../../../services/opportunityService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import { LeadService } from '../../../services/leadService';
import type { CreateOpportunityDto } from '../../../types/crm-opportunities';
import type { BusinessPartner } from '../../../types/crm';
import type { Lead } from '../../../types/crm-leads';
import { Save, ArrowLeft } from 'lucide-react';

export function OpportunityForm() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [bps, setBps] = useState<BusinessPartner[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);

    const [formData, setFormData] = useState<CreateOpportunityDto>({
        title: '',
        businessPartnerId: undefined,
        leadId: undefined,
        estimatedValue: 0,
        closeDate: new Date().toISOString().split('T')[0]
    });

    // Load BPs and Leads for selection
    useEffect(() => {
        Promise.all([
            BusinessPartnerService.getAll(),
            LeadService.getAll()
        ]).then(([bpData, leadData]) => {
            setBps(bpData);
            setLeads(leadData);
        }).catch(err => console.error(err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Ensure empty strings are treated as undefined/null for IDs
            const payload = {
                ...formData,
                businessPartnerId: formData.businessPartnerId === '' ? undefined : formData.businessPartnerId,
                leadId: formData.leadId === '' ? undefined : formData.leadId
            };

            await OpportunityService.create(payload as CreateOpportunityDto);
            navigate('/crm/opportunities');
        } catch (error) {
            console.error("Failed to save opportunity", error);
            alert("Erro ao salvar Oportunidade.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/crm/opportunities')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">Nova Oportunidade</h1>
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

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl grid grid-cols-2 gap-6">

                    <div className="col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Título da Oportunidade *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required autoFocus className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Parceiro de Negócio (Cliente Existente)</label>
                        <select name="businessPartnerId" value={formData.businessPartnerId || ''} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white">
                            <option value="">Selecione...</option>
                            {bps.map(bp => (
                                <option key={bp.id} value={bp.id}>{bp.razaoSocial}</option>
                            ))}
                        </select>
                        <p className="text-xs text-text-secondary mt-1">Ou selecione um Lead abaixo.</p>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Lead (Cliente Potencial)</label>
                        <select name="leadId" value={formData.leadId || ''} onChange={handleChange} className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white">
                            <option value="">Selecione...</option>
                            {leads.map(lead => (
                                <option key={lead.id} value={lead.id}>{lead.title} - {lead.contactName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Valor Estimado</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-text-secondary">R$</span>
                            <input type="number" step="0.01" name="estimatedValue" value={formData.estimatedValue} onChange={handleChange} required className="w-full p-2 pl-8 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-secondary">Data de Fechamento Prevista</label>
                        <input type="date" name="closeDate" value={formData.closeDate} onChange={handleChange} required className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none" />
                    </div>

                </form>
            </div>
        </div>
    );
}
