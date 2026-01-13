import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { BusinessPartnerService } from '../../services/businessPartnerService';
import type { BusinessPartner } from '../../types/crm';
import { Plus, RefreshCw } from 'lucide-react';
import { ALVGrid } from '../../components/Common/ALVGrid';
import type { Column } from '../../components/Common/ALVGrid';

export function BusinessPartnerList() {
    const navigate = useNavigate();
    const { searchTerm } = useOutletContext<{ searchTerm: string }>();
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

    const columns: Column<BusinessPartner>[] = [
        { key: 'codigo', label: 'Código', sortable: true, width: '100px' },
        { key: 'razaoSocial', label: 'Razão Social / Nome', sortable: true },
        { key: 'nomeFantasia', label: 'Nome Fantasia', sortable: true },
        {
            key: 'tipo',
            label: 'Tipo',
            width: '150px',
            render: (val) => val === 'PessoaJuridica' ? 'PESSOA JURÍDICA' : 'PESSOA FÍSICA'
        },
        { key: 'cpfCnpj', label: 'CPF / CNPJ', width: '180px' },
        {
            key: 'status',
            label: 'Status',
            width: '100px',
            render: (value) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value.toUpperCase()}
                </span>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Business Partners</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">BP01</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={loadPartners} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => navigate('/crm/bp/new')}
                        className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                    >
                        <Plus size={14} className="mr-2" />
                        NOVO PARCEIRO
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ALVGrid
                    data={partners}
                    columns={columns}
                    loading={loading}
                    searchTerm={searchTerm}
                    onRowClick={(bp) => navigate(`/crm/bp/${bp.id}`)}
                />
            </div>
        </div>
    );
}
