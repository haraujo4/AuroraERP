import React, { useState, useEffect } from 'react';
import { Save, Calendar, FileText, Lock } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

interface Deposito {
    id: string;
    descricao: string;
}

const InventoryCreatePage: React.FC = () => {
    const [depositos, setDepositos] = useState<Deposito[]>([]);
    const [description, setDescription] = useState('');
    const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDepositoId, setSelectedDepositoId] = useState('');
    const [postingBlock, setPostingBlock] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDepositos();
    }, []);

    const loadDepositos = async () => {
        try {
            const response = await api.get('/organization/warehouses');
            setDepositos(response.data);
        } catch (error) {
            toast.error('Erro ao carregar depósitos');
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payload = {
                description,
                planDate,
                depositoId: selectedDepositoId,
                postingBlock
            };
            // Mock API call for now
            // await api.post('/logistics/inventory/documents', payload);
            console.log('Creating Inventory Document:', payload);
            toast.success('Documento de Inventário criado com sucesso! (Simulação)');
            setDescription('');
            setSelectedDepositoId('');
            setPostingBlock(false);
        } catch (error) {
            toast.error('Erro ao criar documento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Criar Documento de Inventário (MI01)</h1>
                    <p className="text-sm text-text-secondary">Selecione o depósito e data para corte de estoque</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !selectedDepositoId || !planDate}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Criando...' : 'Criar Documento'}
                </button>
            </div>

            <div className="p-8 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-xl shadow-sm border border-border-default p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Descrição</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ex: Inventário Anual 2026 - Almoxarifado Central"
                                    className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Depósito</label>
                            <select
                                value={selectedDepositoId}
                                onChange={(e) => setSelectedDepositoId(e.target.value)}
                                className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                            >
                                <option value="">Selecione o Depósito...</option>
                                {depositos.map(d => (
                                    <option key={d.id} value={d.id}>{d.descricao}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Data Planejada</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                                <input
                                    type="date"
                                    value={planDate}
                                    onChange={(e) => setPlanDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-text-secondary"
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="flex items-center gap-3 p-4 border border-border-default rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={postingBlock}
                                    onChange={(e) => setPostingBlock(e.target.checked)}
                                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                                />
                                <div>
                                    <span className="font-medium text-text-primary flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-orange-500" />
                                        Bloqueio de Lançamento
                                    </span>
                                    <p className="text-sm text-text-tertiary">
                                        Se marcado, impede movimentações (MIGO) para os materiais selecionados durante a contagem.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryCreatePage;
