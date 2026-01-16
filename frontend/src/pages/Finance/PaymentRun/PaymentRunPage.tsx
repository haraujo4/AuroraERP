import React, { useState } from 'react';
import { Play, Settings, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentRunPage: React.FC = () => {
    const [runDate, setRunDate] = useState(new Date().toISOString().split('T')[0]);
    const [id, setId] = useState(`RUN-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-01`);

    // Steps: Parameter -> Proposal -> Payment
    const [step, setStep] = useState(1);

    const handleCreateProposal = () => {
        setStep(2);
        toast.success('Proposta de pagamento criada com sucesso!');
    };

    const handleExecuteRun = () => {
        setStep(3);
        toast.success('Pagamento executado! Arquivos CNAB gerados.');
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Pagamentos Automáticos (F110)</h1>
                    <p className="text-sm text-text-secondary">Execução de pagamentos em lote e geração de arquivos bancários</p>
                </div>
            </div>

            <div className="p-8 max-w-5xl mx-auto w-full space-y-8">

                {/* Identifier Section */}
                <div className="bg-white p-6 rounded-xl border border-border-default shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Data da Execução</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                            <input
                                type="date"
                                value={runDate}
                                onChange={(e) => setRunDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Identificação da Execução</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                </div>

                {/* Process Steps */}
                <div className="relative">
                    <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
                    <div className="grid grid-cols-3 gap-4 text-center">

                        {/* Step 1 */}
                        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${step >= 1 ? 'bg-white border-brand-primary text-brand-primary' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                                <Settings className="w-8 h-8" />
                            </div>
                            <span className="font-semibold text-text-primary">Parâmetros</span>
                        </div>

                        {/* Step 2 */}
                        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${step >= 2 ? 'bg-white border-brand-primary text-brand-primary' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <span className="font-semibold text-text-primary">Proposta</span>
                        </div>

                        {/* Step 3 */}
                        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${step >= 3 ? 'bg-white border-brand-primary text-brand-primary' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <span className="font-semibold text-text-primary">Pagamento</span>
                        </div>
                    </div>
                </div>

                {/* Actions Area */}
                <div className="bg-white p-8 rounded-xl border border-border-default shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-text-primary">Definição de Parâmetros</h2>
                            <p className="text-text-secondary max-w-md">
                                Configure quais empresas, métodos de pagamento e datas de vencimento devem ser considerados nesta execução.
                            </p>
                            <button
                                onClick={handleCreateProposal}
                                className="bg-brand-primary text-white px-8 py-3 rounded-lg hover:bg-brand-secondary transition-transform transform active:scale-95 flex items-center gap-2 mx-auto"
                            >
                                <Settings className="w-4 h-4" /> Criar Proposta
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-text-primary">Proposta Gerada</h2>
                            <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm mb-4">
                                45 faturas encontradas. Total: R$ 152.000,00
                            </div>
                            <p className="text-text-secondary max-w-md">
                                Revise a lista de pagamentos propostos. Você pode bloquear pagamentos individuais antes de continuar.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setStep(1)}
                                    className="bg-gray-100 text-text-primary px-6 py-3 rounded-lg hover:bg-gray-200"
                                >
                                    Editar Parâmetros
                                </button>
                                <button
                                    onClick={handleExecuteRun}
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-transform transform active:scale-95 flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" /> Executar Pagamentos
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary">Execução Finalizada!</h2>
                            <p className="text-text-secondary">
                                As ordens de pagamento foram geradas e os lançamentos contábeis efetuados.
                            </p>
                            <div className="flex gap-4 justify-center mt-4">
                                <button className="text-brand-primary underline hover:text-brand-secondary">
                                    Baixar Arquivo CNAB
                                </button>
                                <button className="text-brand-primary underline hover:text-brand-secondary">
                                    Ver Relatório de Erros
                                </button>
                            </div>

                            <button
                                onClick={() => { setStep(1); setId(`RUN-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-02`); }}
                                className="mt-8 bg-gray-100 text-text-primary px-6 py-2 rounded-lg hover:bg-gray-200"
                            >
                                Nova Execução
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PaymentRunPage;
