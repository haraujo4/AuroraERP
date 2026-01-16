import React, { useState } from 'react';
import { Save, UserPlus, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

const PersonnelActionPage: React.FC = () => {
    const [actionType, setActionType] = useState('Hiring');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Medida de pessoal registrada com sucesso!');
            setReason('');
        } catch (error) {
            toast.error('Erro ao registrar medida');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Medidas de Pessoal (PA40)</h1>
                    <p className="text-sm text-text-secondary">Registro de Admissões, Rescisões e Alterações Organizacionais</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    Executar Medida
                </button>
            </div>

            <div className="p-8 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-xl shadow-sm border border-border-default p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Tipo de Medida</label>
                            <div className="relative">
                                <ClipboardList className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                                <select
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                                >
                                    <option value="Hiring">Contratação (Admissão)</option>
                                    <option value="Promotion">Promoção</option>
                                    <option value="Transfer">Transferência</option>
                                    <option value="Termination">Desligamento</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Data de Início</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                            />
                        </div>

                        {actionType !== 'Hiring' && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Colaborador</label>
                                <div className="relative">
                                    <UserPlus className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou ID..."
                                        className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Motivo / Justificativa</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                placeholder="Descreva o motivo da ação..."
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonnelActionPage;
