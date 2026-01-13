import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, Eye } from 'lucide-react';
import purchasingService from '../../../services/purchasingService';
import type { PurchaseRequisition } from '../../../types/purchasing';
import { format } from 'date-fns';

const PurchaseRequisitionList: React.FC = () => {
    const navigate = useNavigate();
    const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequisitions();
    }, []);

    const loadRequisitions = async () => {
        try {
            const data = await purchasingService.getRequisitions();
            setRequisitions(data);
        } catch (error) {
            console.error('Error loading requisitions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (window.confirm('Aprovar esta requisição?')) {
            try {
                await purchasingService.approveRequisition(id);
                loadRequisitions();
            } catch (error) {
                console.error('Error approving requisition', error);
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-gray-100 text-gray-800';
            case 'PendingApproval': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <h1 className="text-xl font-bold text-text-primary">Requisições de Compra</h1>
                <button
                    onClick={() => navigate('/purchasing/requisitions/new')}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary"
                >
                    <Plus size={16} />
                    Nova Requisição
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-border-default overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-bg-secondary border-b border-border-default">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Número</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Data Necessária</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Solicitante</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisitions.map((req) => (
                                    <tr key={req.id} className="border-b border-border-default hover:bg-bg-subtle">
                                        <td className="px-4 py-3 text-sm font-mono">{req.requisitionNumber}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {format(new Date(req.requiredDate), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">{req.requester}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            {(req.status === 'Draft' || req.status === 'PendingApproval') && (
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="text-green-600 hover:text-green-700 p-1"
                                                    title="Aprovar"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {requisitions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            Nenhuma requisição encontrada
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseRequisitionList;
