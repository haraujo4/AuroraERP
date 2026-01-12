import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { salesContractService } from '../../../services/salesContractService';
import { BusinessPartnerService } from '../../../services/businessPartnerService';
import type { BusinessPartner } from '../../../types/crm';
import { materialService } from '../../../services/materialService';
import type { Material } from '../../../types/materials';
import type { SalesContract, CreateSalesContractDto, CreateSalesContractItemDto } from '../../../types/sales-contracts';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';

export function SalesContractForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [contract, setContract] = useState<SalesContract | null>(null);
    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState<CreateSalesContractDto>({
        businessPartnerId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        billingDay: 1,
        billingFrequency: 'Monthly',
        items: []
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [partnersData, materialsData] = await Promise.all([
                BusinessPartnerService.getAll(),
                materialService.getAll()
            ]);
            setPartners(partnersData);
            setMaterials(materialsData);

            if (id) {
                const contractData = await salesContractService.getById(id);
                setContract(contractData);
                setFormData({
                    businessPartnerId: contractData.businessPartnerId,
                    startDate: contractData.startDate.split('T')[0],
                    endDate: contractData.endDate.split('T')[0],
                    billingDay: contractData.billingDay,
                    billingFrequency: contractData.billingFrequency,
                    items: contractData.items?.map(i => ({
                        materialId: i.materialId,
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                        discountPercentage: i.discountPercentage
                    })) || []
                });
            }
        } catch (error) {
            console.error('Error loading data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { materialId: '', quantity: 1, unitPrice: 0, discountPercentage: 0 }]
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index: number, field: keyof CreateSalesContractItemDto, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'materialId') {
            const material = materials.find(m => m.id === value);
            if (material) {
                newItems[index].unitPrice = material.basePrice || 0;
            }
        }

        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = (items: CreateSalesContractItemDto[]) => {
        return items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice * (1 - item.discountPercentage / 100));
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await salesContractService.update(id, formData);
            } else {
                await salesContractService.create(formData);
            }
            navigate('/sales/contracts');
        } catch (error) {
            console.error('Failed to save contract', error);
            alert('Failed to save contract');
        }
    };

    if (loading) return <div>Carregando...</div>;

    // View Mode (Read-only if it exists and we want a view mode, 
    // but typically Form is editable. Let's make it editable for now, 
    // unless Status prevents edit? 
    // Let's implement View Mode similar to Quote/Order for consistency 
    // if status is not Draft, or just for "View" action.)
    // For now, simple Edit/Create logic.

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/sales/contracts')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {id ? `Contrato ${contract?.contractNumber}` : 'Novo Contrato de Venda'}
                    </h1>
                    {id && contract && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                             ${contract.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    contract.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                            {contract.status}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Save size={16} className="mr-2" />
                        Salvar Contrato
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-auto space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="bg-white p-6 rounded shadow-sm border border-border-default grid grid-cols-2 gap-6">
                        <div className="col-span-2 border-b border-border-default pb-2 mb-2 font-bold text-text-primary flex items-center">
                            Informações Gerais
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Cliente *</label>
                            <select
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                                value={formData.businessPartnerId}
                                onChange={(e) => setFormData({ ...formData, businessPartnerId: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                {partners.map(p => (
                                    <option key={p.id} value={p.id}>{p.razaoSocial}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Frequência de Faturamento</label>
                            <select
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                                value={formData.billingFrequency}
                                onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value })}
                            >
                                <option value="Monthly">Mensal</option>
                                <option value="Quarterly">Trimestral</option>
                                <option value="Annually">Anual</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Data Início *</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Data Término *</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-text-secondary">Dia de Faturamento</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.billingDay}
                                onChange={(e) => setFormData({ ...formData, billingDay: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm border border-border-default">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-default">
                            <h2 className="text-lg font-bold text-text-primary">Itens do Contrato (Recorrentes)</h2>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="flex items-center text-sm text-brand-primary hover:text-brand-secondary font-medium"
                            >
                                <Plus size={16} className="mr-1" /> Adicionar Item
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-bg-header">
                                    <tr>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default" style={{ width: '40%' }}>Produto/Serviço</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right" style={{ width: '15%' }}>Qtd</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right" style={{ width: '15%' }}>Preço Unit.</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right" style={{ width: '15%' }}>Desc %</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right" style={{ width: '10%' }}>Total</th>
                                        <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default" style={{ width: '5%' }}></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default">
                                    {formData.items.map((item, index) => (
                                        <tr key={index} className="hover:bg-bg-main">
                                            <td className="p-2">
                                                <select
                                                    required
                                                    className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white text-sm"
                                                    value={item.materialId}
                                                    onChange={(e) => handleItemChange(index, 'materialId', e.target.value)}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {materials.map(m => (
                                                        <option key={m.id} value={m.id}>{m.description}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-right text-sm"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-right text-sm"
                                                    value={item.unitPrice}
                                                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-right text-sm"
                                                    value={item.discountPercentage}
                                                    onChange={(e) => handleItemChange(index, 'discountPercentage', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2 text-right text-sm font-medium text-text-primary">
                                                R$ {(item.quantity * item.unitPrice * (1 - item.discountPercentage / 100)).toFixed(2)}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end items-center border-t border-border-default pt-4">
                            <span className="text-lg font-bold text-text-secondary mr-4">Total Mensal:</span>
                            <span className="text-2xl font-bold text-brand-primary">R$ {calculateTotal(formData.items).toFixed(2)}</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
