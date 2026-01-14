import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { materialService } from '../../../services/materialService';
import type { CreateMaterial } from '../../../types/materials';
import { ArrowLeft, Save, Package, Truck, DollarSign, ShoppingCart, Settings } from 'lucide-react';

type Tab = 'general' | 'logistics' | 'sales' | 'purchasing' | 'control';

export function MaterialForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<CreateMaterial>({
        code: '',
        description: '',
        type: 'Finished Good',
        group: '',
        unitOfMeasure: 'UN',

        // Logistics
        netWeight: 0,
        grossWeight: 0,
        weightUnit: 'KG',
        width: 0,
        height: 0,
        length: 0,
        dimensionUnit: 'CM',
        minStock: 0,
        maxStock: 0,

        // Sales
        basePrice: 0,
        salesUnit: 'UN',
        taxClassification: '',
        origin: 0,
        defaultIpiRate: 0,
        defaultIcmsRate: 0,

        // Purchasing
        standardCost: 0,
        purchasingUnit: 'UN',

        // Control
        isBatchManaged: false,
        isSerialManaged: false
    });

    useEffect(() => {
        if (id) {
            loadMaterial(id);
        }
    }, [id]);

    const loadMaterial = async (materialId: string) => {
        setLoading(true);
        try {
            const data = await materialService.getById(materialId);
            setFormData({
                code: data.code,
                description: data.description,
                type: data.type,
                group: data.group || '',
                unitOfMeasure: data.unitOfMeasure,

                netWeight: data.netWeight || 0,
                grossWeight: data.grossWeight || 0,
                weightUnit: data.weightUnit || 'KG',
                width: data.width || 0,
                height: data.height || 0,
                length: data.length || 0,
                dimensionUnit: data.dimensionUnit || 'CM',
                minStock: data.minStock,
                maxStock: data.maxStock,

                basePrice: data.basePrice,
                salesUnit: data.salesUnit || 'UN',
                taxClassification: data.taxClassification || '',
                origin: data.origin || 0,
                defaultIpiRate: data.defaultIpiRate || 0,
                defaultIcmsRate: data.defaultIcmsRate || 0,

                standardCost: data.standardCost || 0,
                purchasingUnit: data.purchasingUnit || 'UN',

                isBatchManaged: data.isBatchManaged,
                isSerialManaged: data.isSerialManaged
            });
        } catch (error) {
            console.error('Failed to load material:', error);
            alert('Falha ao carregar detalhes do material');
            navigate('/logistics/materials');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing && id) {
                await materialService.update(id, formData);
            } else {
                await materialService.create(formData);
            }
            navigate('/logistics/materials');
        } catch (error) {
            console.error('Failed to save material:', error);
            alert('Falha ao salvar material');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const tabs = [
        { id: 'general', label: 'Dados Gerais', icon: Package },
        { id: 'logistics', label: 'Logística', icon: Truck },
        { id: 'sales', label: 'Vendas', icon: DollarSign },
        { id: 'purchasing', label: 'Compras', icon: ShoppingCart },
        { id: 'control', label: 'Controle', icon: Settings },
    ];

    if (loading && isEditing) return <div className="p-8 text-center text-text-secondary">Carregando...</div>;

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/logistics/materials')}
                        className="p-2 hover:bg-bg-secondary rounded-full text-text-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">
                            {isEditing ? `Editar Material: ${formData.code}` : 'Novo Material (MM01)'}
                        </h1>
                        <p className="text-sm text-text-secondary">{isEditing ? 'Atualizar detalhes do material' : 'Criar novo registro de material'}</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Salvando...' : 'Salvar Material'}
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar / Tabs */}
                <div className="w-64 bg-white border-r border-border-default flex flex-col">
                    <nav className="p-4 space-y-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-brand-primary/10 text-brand-primary'
                                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-border-default p-6">
                        {activeTab === 'general' && (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Código do Material</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={isEditing ? formData.code : (formData.code || 'MATxxxx (Auto)')}
                                        onChange={handleChange}
                                        disabled={true} // Always disabled for both New and Edit
                                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-secondary text-text-secondary cursor-not-allowed"
                                        required={isEditing}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Descrição</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Tipo</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    >
                                        <option value="Raw Material">Matéria Prima</option>
                                        <option value="Finished Good">Produto Acabado</option>
                                        <option value="Service">Serviço</option>
                                        <option value="Asset">Ativo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Grupo de Material</label>
                                    <input
                                        type="text"
                                        name="group"
                                        value={formData.group}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Unidade de Medida</label>
                                    <input
                                        type="text"
                                        name="unitOfMeasure"
                                        value={formData.unitOfMeasure}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'logistics' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-text-primary border-b border-border-default pb-2">Pesos e Dimensões</h3>
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Peso Líquido</label>
                                        <input type="number" name="netWeight" value={formData.netWeight} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Peso Bruto</label>
                                        <input type="number" name="grossWeight" value={formData.grossWeight} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Unidade de Peso</label>
                                        <input type="text" name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Comprimento</label>
                                        <input type="number" name="length" value={formData.length} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Largura</label>
                                        <input type="number" name="width" value={formData.width} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Altura</label>
                                        <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Unidade</label>
                                        <input type="text" name="dimensionUnit" value={formData.dimensionUnit} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-text-primary border-b border-border-default pb-2 pt-4">Parâmetros de Estoque</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Estoque Mínimo</label>
                                        <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Estoque Máximo</label>
                                        <input type="number" name="maxStock" value={formData.maxStock} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sales' && (
                            <div>
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Preço Base de Venda</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-text-tertiary">R$</span>
                                            <input
                                                type="number"
                                                name="basePrice"
                                                value={formData.basePrice}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Unidade de Venda</label>
                                        <input type="text" name="salesUnit" value={formData.salesUnit} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Classificação Fiscal (NCM)</label>
                                        <input type="text" name="taxClassification" value={formData.taxClassification} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Origem</label>
                                        <select
                                            name="origin"
                                            value={formData.origin}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        >
                                            <option value={0}>0 - Nacional</option>
                                            <option value={1}>1 - Importado</option>
                                            <option value={2}>2 - Estrangeira (Adq. no mercado interno)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Aliq. Padrão IPI (%)</label>
                                        <input
                                            type="number"
                                            name="defaultIpiRate"
                                            value={formData.defaultIpiRate}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Aliq. Padrão ICMS (%)</label>
                                        <input
                                            type="number"
                                            name="defaultIcmsRate"
                                            value={formData.defaultIcmsRate}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'purchasing' && (
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Custo Padrão</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-text-tertiary">R$</span>
                                        <input
                                            type="number"
                                            name="standardCost"
                                            value={formData.standardCost}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Unidade de Compra</label>
                                    <input type="text" name="purchasingUnit" value={formData.purchasingUnit} onChange={handleChange} className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'control' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 border border-border-default rounded-lg">
                                    <input
                                        type="checkbox"
                                        name="isBatchManaged"
                                        checked={formData.isBatchManaged}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary">Controlado por Lote</label>
                                        <p className="text-xs text-text-secondary">Controlar estoque por números de lote e data de validade</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 border border-border-default rounded-lg">
                                    <input
                                        type="checkbox"
                                        name="isSerialManaged"
                                        checked={formData.isSerialManaged}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary">Controlado por Série</label>
                                        <p className="text-xs text-text-secondary">Controlar unidades individuais com números de série únicos</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
