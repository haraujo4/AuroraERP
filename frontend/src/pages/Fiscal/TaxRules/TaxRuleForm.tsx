import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import fiscalService from '../../../services/fiscalService';
import { STATES, OperationTypes, CstIcmsValues } from '../../../types/fiscal';
import type { OperationType, CstIcms } from '../../../types/fiscal';

const TaxRuleForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sourceState: '',
        destState: '',
        ncmCode: '', // Empty means ALL
        operationType: 'Sales' as OperationType,
        cfop: 5101, // Default Sales
        cstIcms: 'Cst00' as CstIcms,
        icmsRate: 0,
        ipiRate: 0,
        pisRate: 1.65,
        cofinsRate: 7.60
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fiscalService.createRule({
                ...formData,
                ncmCode: formData.ncmCode.trim() || undefined
            });
            navigate('/fiscal/tax-rules');
        } catch (error) {
            console.error('Error creating rule', error);
            alert('Erro ao criar regra fiscal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/fiscal/tax-rules')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-500" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Nova Regra Fiscal (FIS01)</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">

                {/* Criteria Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Critérios de Aplicação</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UF Origem</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={formData.sourceState}
                                onChange={e => setFormData({ ...formData, sourceState: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UF Destino</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={formData.destState}
                                onChange={e => setFormData({ ...formData, destState: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Operação</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={formData.operationType}
                                onChange={e => setFormData({ ...formData, operationType: e.target.value as OperationType })}
                            >
                                <option value="Sales">Venda</option>
                                <option value="Purchase">Compra</option>
                                <option value="Transfer">Transferência</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">NCM (Opcional)</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: 1234.56.78"
                                value={formData.ncmCode}
                                onChange={e => setFormData({ ...formData, ncmCode: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">Deixe em branco para aplicar a todos</p>
                        </div>
                    </div>
                </div>

                {/* Fiscal Definition Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Definição Fiscal</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CFOP</label>
                            <input
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.cfop}
                                onChange={e => setFormData({ ...formData, cfop: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">CST (ICMS)</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={formData.cstIcms}
                                onChange={e => setFormData({ ...formData, cstIcms: e.target.value as CstIcms })}
                            >
                                {Object.values(CstIcmsValues).map(cst => (
                                    <option key={cst} value={cst}>{cst}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Rates Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Alíquotas (%)</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ICMS Rate</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.icmsRate}
                                    onChange={e => setFormData({ ...formData, icmsRate: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">IPI Rate</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.ipiRate}
                                    onChange={e => setFormData({ ...formData, ipiRate: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PIS Rate</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.pisRate}
                                    onChange={e => setFormData({ ...formData, pisRate: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">COFINS Rate</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.cofinsRate}
                                    onChange={e => setFormData({ ...formData, cofinsRate: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/fiscal/tax-rules')}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Save size={20} />
                        {loading ? 'Salvando...' : 'Salvar Regra'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaxRuleForm;
