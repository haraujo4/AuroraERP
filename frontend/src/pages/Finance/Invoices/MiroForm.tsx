
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function MiroForm() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <button onClick={() => navigate('/finance/invoices')} className="p-2 text-text-secondary hover:text-brand-primary" title="Voltar">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-text-primary">
                        Revisão de Faturas Logísticas (MIRO)
                    </h1>
                </div>
            </div>
            <div className="flex-1 bg-white p-6 rounded shadow-sm border border-border-default flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-secondary mb-2">Em Construção</h2>
                    <p className="text-text-secondary">O módulo de revisão de faturas (MIRO) será implementado em breve.</p>
                </div>
            </div>
        </div>
    );
}
