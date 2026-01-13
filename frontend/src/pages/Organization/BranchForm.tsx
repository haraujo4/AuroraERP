import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { branchService } from '../../services/branchService';
import { companyService } from '../../services/companyService';
import type { Empresa, CreateBranchDto, Deposito, CreateDepositoDto } from '../../types/organization';
import { ArrowLeft, Save, Warehouse, Building2, Plus } from 'lucide-react';
import { cepService } from '../../services/cepService';
import { toast } from 'react-hot-toast';

export function BranchForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [companies, setCompanies] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'general' | 'warehouses'>('general');
    const [depositos, setDepositos] = useState<Deposito[]>([]);
    const [showDepositoForm, setShowDepositoForm] = useState(false);
    const [newDeposito, setNewDeposito] = useState<CreateDepositoDto>({
        filialId: '',
        codigo: '',
        descricao: '',
        tipo: 'Armazenagem',
        controlaLote: false,
        controlaSerie: false
    });

    const [formData, setFormData] = useState<CreateBranchDto>({
        empresaId: '',
        codigo: '',
        descricao: '',
        tipo: 'Comercial',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        country: 'Brasil',
        zipCode: ''
    });

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const data = await companyService.getAll();
                setCompanies(data);

                if (id) {
                    const branch = await branchService.getById(id);
                    setFormData({
                        empresaId: branch.empresaId,
                        codigo: branch.codigo,
                        descricao: branch.descricao,
                        tipo: branch.tipo,
                        street: branch.street || '',
                        number: branch.number || '',
                        complement: branch.complement || '',
                        neighborhood: branch.neighborhood || '',
                        city: branch.city || '',
                        state: branch.state || '',
                        country: branch.country || 'Brasil',
                        zipCode: branch.zipCode || ''
                    });
                    loadDepositos(id);
                }
            } catch (error) {
                console.error('Error loading data', error);
            } finally {
                setLoading(false);
            }
        };
        loadCompanies();
    }, [id]);

    const loadDepositos = async (branchId: string) => {
        try {
            const data = await branchService.getDepositos(branchId);
            setDepositos(data);
        } catch (error) {
            console.error('Failed to load warehouses', error);
        }
    };

    const handleSaveDeposito = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        try {
            await branchService.createDeposito(id, { ...newDeposito, filialId: id });
            setShowDepositoForm(false);
            setNewDeposito({
                filialId: '',
                codigo: '',
                descricao: '',
                tipo: 'Armazenagem',
                controlaLote: false,
                controlaSerie: false
            });
            loadDepositos(id);
        } catch (error) {
            console.error('Failed to create warehouse', error);
            alert('Erro ao criar depósito');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await branchService.update(id, formData);
            } else {
                await branchService.create(formData);
            }
            navigate('/admin/branches');
        } catch (error) {
            console.error('Failed to save branch', error);
            alert('Failed to save branch');
        }
    };

    const handleCepBlur = async () => {
        const cep = formData.zipCode;
        if (cep && cep.replace(/\D/g, '').length === 8) {
            try {
                const address = await cepService.getAddressByCep(cep);
                if (address) {
                    setFormData(prev => ({
                        ...prev,
                        street: address.logradouro,
                        neighborhood: address.bairro,
                        city: address.localidade,
                        state: address.uf
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

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/admin/branches')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        {id ? 'Editar Filial' : 'Nova Filial'}
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Save size={16} className="mr-2" />
                        Salvar Filial
                    </button>
                </div>
            </div>

            {/* Tabs */}
            {id && (
                <div className="flex space-x-4 border-b border-border-default mb-4">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'general'
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Building2 size={16} />
                            Informações Gerais
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('warehouses')}
                        className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'warehouses'
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Warehouse size={16} />
                            Depósitos
                        </div>
                    </button>
                </div>
            )}

            {/* Form Content */}
            {activeTab === 'general' ? (
                <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="max-w-4xl grid grid-cols-2 gap-6">
                        <div className="col-span-2 border-b border-border-default pb-2 mb-2 font-bold text-text-primary flex items-center">
                            Informações Gerais
                        </div>

                        <div className="space-y-1 col-span-1">
                            <label className="block text-sm font-medium text-text-secondary">Empresa Matriz *</label>
                            <select
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                                value={formData.empresaId}
                                onChange={(e) => setFormData({ ...formData, empresaId: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.razaoSocial}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1 col-span-1">
                            <label className="block text-sm font-medium text-text-secondary">Tipo *</label>
                            <select
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-white"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            >
                                <option value="Comercial">Comercial</option>
                                <option value="Industrial">Industrial</option>
                                <option value="Administrativa">Administrativa</option>
                                <option value="Logística">Logística</option>
                            </select>
                        </div>

                        <div className="space-y-1 col-span-1">
                            <label className="block text-sm font-medium text-text-secondary">Código *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.codigo}
                                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1 col-span-2">
                            <label className="block text-sm font-medium text-text-secondary">Descrição / Nome da Filial *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 border-b border-border-default pb-2 mb-2 mt-4 font-bold text-text-primary flex items-center">
                            Endereço
                        </div>

                        <div className="space-y-1 col-span-1">
                            <label className="block text-sm font-medium text-text-secondary">CEP</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                onBlur={handleCepBlur}
                                maxLength={9}
                                placeholder="00000-000"
                            />
                        </div>

                        <div className="space-y-1 col-span-1">
                            <label className="block text-sm font-medium text-text-secondary">Cidade *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1 col-span-2">
                            <label className="block text-sm font-medium text-text-secondary">Rua *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1 col-span-1">
                            <label className="block text-sm font-medium text-text-secondary">Número *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1 col-span-1">
                            <label className="block text-sm font-medium text-text-secondary">Estado *</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-border-input rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-text-primary">Depósitos Cadastrados</h2>
                        <button
                            onClick={() => setShowDepositoForm(!showDepositoForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm"
                        >
                            <Plus size={16} />
                            Novo Depósito
                        </button>
                    </div>

                    {showDepositoForm && (
                        <div className="mb-8 p-4 bg-bg-secondary rounded border border-border-default">
                            <h3 className="text-sm font-bold text-text-primary mb-4">Novo Depósito</h3>
                            <form onSubmit={handleSaveDeposito} className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary mb-1">Código *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none"
                                        value={newDeposito.codigo}
                                        onChange={e => setNewDeposito({ ...newDeposito, codigo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary mb-1">Descrição *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-border-input rounded focus:border-brand-primary outline-none"
                                        value={newDeposito.descricao}
                                        onChange={e => setNewDeposito({ ...newDeposito, descricao: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newDeposito.controlaLote}
                                            onChange={e => setNewDeposito({ ...newDeposito, controlaLote: e.target.checked })}
                                        />
                                        Controla Lote
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newDeposito.controlaSerie}
                                            onChange={e => setNewDeposito({ ...newDeposito, controlaSerie: e.target.checked })}
                                        />
                                        Controla Série
                                    </label>
                                </div>
                                <div className="col-span-2 flex justify-end gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowDepositoForm(false)}
                                        className="px-3 py-1 text-text-secondary hover:text-text-primary"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1 bg-brand-primary text-white rounded hover:bg-brand-secondary"
                                    >
                                        Salvar Depósito
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary text-text-secondary text-xs uppercase font-semibold">
                                <th className="p-3 border-b border-border-default">Código</th>
                                <th className="p-3 border-b border-border-default">Descrição</th>
                                <th className="p-3 border-b border-border-default">Lote?</th>
                                <th className="p-3 border-b border-border-default">Série?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depositos.map(dep => (
                                <tr key={dep.id} className="border-b border-border-default hover:bg-bg-secondary/20">
                                    <td className="p-3 text-text-primary font-medium">{dep.codigo}</td>
                                    <td className="p-3 text-text-secondary">{dep.descricao}</td>
                                    <td className="p-3 text-text-secondary">{dep.controlaLote ? 'Sim' : 'Não'}</td>
                                    <td className="p-3 text-text-secondary">{dep.controlaSerie ? 'Sim' : 'Não'}</td>
                                </tr>
                            ))}
                            {depositos.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-text-secondary italic">
                                        Nenhum depósito cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
