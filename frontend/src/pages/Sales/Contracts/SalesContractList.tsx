import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesContractService } from '../../../services/salesContractService';
import type { SalesContract } from '../../../types/sales-contracts';
import { Plus, Search, FileText, Clock } from 'lucide-react';

export function SalesContractList() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState<SalesContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadContracts();
    }, []);

    const loadContracts = async () => {
        try {
            const data = await salesContractService.getAll();
            setContracts(data);
        } catch (error) {
            console.error('Failed to load contracts', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredContracts = contracts.filter(c =>
        c.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.businessPartnerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary flex items-center">
                    <FileText className="mr-2" /> Contratos de Venda
                </h1>
                <button
                    onClick={() => navigate('/sales/contracts/new')}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors"
                >
                    <Plus size={20} className="mr-2" /> Novo Contrato
                </button>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Buscar por número ou cliente..."
                    className="w-full pl-10 pr-4 py-2 border border-border-input rounded-lg focus:outline-none focus:border-brand-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-text-secondary" size={20} />
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-lg shadow border border-border-default">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0">
                        <tr>
                            <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Número</th>
                            <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Cliente</th>
                            <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Início</th>
                            <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Fim</th>
                            <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Ciclo</th>
                            <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Valor Mensal</th>
                            <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {filteredContracts.map((contract) => (
                            <tr
                                key={contract.id}
                                onClick={() => navigate(`/sales/contracts/${contract.id}`)}
                                className="hover:bg-bg-main cursor-pointer transition-colors"
                            >
                                <td className="p-4 text-sm font-medium text-text-primary">{contract.contractNumber}</td>
                                <td className="p-4 text-sm text-text-primary">{contract.businessPartnerName}</td>
                                <td className="p-4 text-sm text-text-secondary">{new Date(contract.startDate).toLocaleDateString()}</td>
                                <td className="p-4 text-sm text-text-secondary">{new Date(contract.endDate).toLocaleDateString()}</td>
                                <td className="p-4 text-sm text-text-secondary">
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-1" />
                                        {contract.billingFrequency}
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-medium text-text-primary text-right">
                                    R$ {contract.totalMonthlyValue.toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                                        ${contract.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                            contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                contract.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                        {contract.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
