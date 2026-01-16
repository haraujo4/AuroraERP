import React, { useState } from 'react';
import { Save, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const TimeManagementPage: React.FC = () => {
    const [type, setType] = useState('Absence_Vacation');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSave = () => {
        toast.success('Registro de tempo salvo com sucesso!');
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Gestão de Tempos (PA61)</h1>
                    <p className="text-sm text-text-secondary">Registro de Ausências, Férias e Atestados</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-secondary transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" />
                    Salvar Registro
                </button>
            </div>

            <div className="p-8 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-xl shadow-sm border border-border-default p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Colaborador</label>
                            <input
                                type="text"
                                placeholder="Buscar colaborador..."
                                className="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Tipo de Ausência/Presença</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                                >
                                    <option value="Absence_Vacation">Férias</option>
                                    <option value="Absence_Sick">Atestado Médico (Doença)</option>
                                    <option value="Absence_Unpaid">Falta Injustificada</option>
                                    <option value="Overtime">Horas Extras</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Data Início</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-text-secondary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Data Fim</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-text-secondary"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeManagementPage;
