import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { OrganizationService } from '../../services/organizationService';
import { OrganizationService as GroupService } from '../../services/organizationService'; // Re-use for groups
import type { Empresa, GrupoEmpresarial } from '../../types/organization';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { ALVGrid } from '../../components/Common/ALVGrid';
import type { Column } from '../../components/Common/ALVGrid';

export function CompanyList() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Empresa[]>([]);
    const [groups, setGroups] = useState<GrupoEmpresarial[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            loadCompanies(selectedGroup);
        } else {
            setCompanies([]);
        }
    }, [selectedGroup]);

    const loadGroups = async () => {
        try {
            const data = await GroupService.getGroups();
            setGroups(data);
            if (data.length > 0) {
                setSelectedGroup(data[0].id);
            }
        } catch (error) {
            console.error("Failed to load groups", error);
        }
    };

    const loadCompanies = async (grupoId: string) => {

        const columns: Column<Empresa>[] = [
            { key: 'codigo', label: 'Código', sortable: true, width: '120px' },
            { key: 'razaoSocial', label: 'Razão Social', sortable: true },
            { key: 'nomeFantasia', label: 'Nome Fantasia', sortable: true },
            { key: 'cnpj', label: 'CNPJ', width: '150px' },
            {
                key: 'isActive',
                label: 'Status',
                width: '100px',
                render: (value) => (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {value ? 'ATIVA' : 'INATIVA'}
                    </span>
                )
            }
        ];

        return (
            <div className="flex flex-col h-full bg-bg-main p-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm z-20">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-text-primary">Gestão de Empresas</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border-default">ORG02</span>
                        </div>

                        <div className="h-6 w-[1px] bg-border-default mx-1" />

                        {/* Filter by Group */}
                        <div className="flex items-center space-x-2 text-xs">
                            <Filter size={14} className="text-text-secondary" />
                            <span className="text-text-secondary font-medium">GRUPO:</span>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="p-1.5 bg-bg-secondary border border-border-default rounded text-xs font-bold text-brand-primary outline-none focus:ring-1 focus:ring-brand-primary"
                            >
                                <option value="">Selecione...</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.nomeFantasia.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button onClick={() => selectedGroup && loadCompanies(selectedGroup)} className="p-2 text-text-secondary hover:text-brand-primary hover:bg-bg-main rounded border border-transparent hover:border-border-default transition-all" title="Atualizar">
                            <RefreshCw size={16} />
                        </button>
                        <button
                            onClick={() => navigate('/admin/companies/new')}
                            className="flex items-center px-4 py-1.5 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-xs font-bold shadow-sm"
                        >
                            <Plus size={14} className="mr-2" />
                            NOVA EMPRESA
                        </button>
                    </div>
                </div>

                {/* Content / Grid */}
                <div className="flex-1 overflow-hidden">
                    <ALVGrid
                        title={selectedGroup ? `Empresas: ${groups.find(g => g.id === selectedGroup)?.nomeFantasia}` : 'Empresas'}
                        tCode="ORG02-LIST"
                        data={companies}
                        columns={columns}
                        loading={loading}
                        onRowClick={(c) => navigate(`/admin/companies/${c.id}`)}
                    />
                </div>
            </div>
        );
    }
