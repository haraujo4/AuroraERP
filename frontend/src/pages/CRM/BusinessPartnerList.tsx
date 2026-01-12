import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessPartnerService } from '../../services/businessPartnerService';
import type { BusinessPartner } from '../../types/crm';
import { Plus, RefreshCw, Users } from 'lucide-react';

export function BusinessPartnerList() {
    const navigate = useNavigate();
    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = async () => {
        setLoading(true);
        try {
            const data = await BusinessPartnerService.getAll();
            setPartners(data);
        } catch (error) {
            console.error("Failed to load business partners", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-2">
                    <Users size={20} className="text-text-secondary" />
                    <h1 className="text-xl font-bold text-text-primary">Parceiros de Negócio</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={loadPartners} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/crm/bp/new')}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Novo BP
                    </button>
                </div>
            </div>

            {/* Content / Table */}
            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Código</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Razão Social / Nome</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Nome Fantasia</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Tipo</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Doc. (CPF/CNPJ)</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : partners.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">Nenhum registro encontrado.</td>
                            </tr>
                        ) : (
                            partners.map((bp) => (
                                <tr key={bp.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{bp.codigo}</td>
                                    <td className="p-3 font-medium">{bp.razaoSocial}</td>
                                    <td className="p-3">{bp.nomeFantasia}</td>
                                    <td className="p-3">{bp.tipo === 'PessoaJuridica' ? 'Pessoa Jurídica' : 'Pessoa Física'}</td>
                                    <td className="p-3 font-mono">{bp.cpfCnpj}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${bp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {bp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 text-xs text-text-secondary text-right">
                Registros: {partners.length}
            </div>
        </div>
    );
}
