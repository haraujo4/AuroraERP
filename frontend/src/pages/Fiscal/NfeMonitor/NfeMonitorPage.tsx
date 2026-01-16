import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, CheckCircle, FileText, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import toast from 'react-hot-toast';

interface FiscalDocument {
    id: string;
    invoiceId: string;
    invoiceNumber: string;
    documentNumber: string;
    series: string;
    accessKey: string;
    status: string;
    issuedAt: string;
    partnerName: string;
    amount: number;
}

const NfeMonitorPage: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [documents, setDocuments] = useState<FiscalDocument[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/fiscal/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar notas fiscais.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const filteredDocuments = documents.filter(doc =>
        filter === 'All' || doc.status === filter
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Authorized':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Autorizada</span>;
            case 'Processing':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><RefreshCw className="w-3 h-3 animate-spin" /> Processando</span>;
            case 'Rejected':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><AlertCircle className="w-3 h-3" /> Rejeitada</span>;
            case 'Cancelled':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><Ban className="w-3 h-3" /> Cancelada</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Monitor de NF-e (J1BNFE)</h1>
                    <p className="text-sm text-text-secondary">Acompanhamento e Status da SEFAZ</p>
                </div>
                <button
                    onClick={fetchDocuments}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white text-text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-border-default shadow-sm disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                </button>
            </div>

            <div className="p-8 max-w-7xl mx-auto w-full space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-border-default shadow-sm border-l-4 border-l-green-500">
                        <p className="text-sm text-text-secondary">Autorizadas</p>
                        <p className="text-2xl font-bold text-text-primary">{documents.filter(d => d.status === 'Authorized').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-border-default shadow-sm border-l-4 border-l-yellow-500">
                        <p className="text-sm text-text-secondary">Em Processamento</p>
                        <p className="text-2xl font-bold text-text-primary">{documents.filter(d => d.status === 'Processing').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-border-default shadow-sm border-l-4 border-l-red-500">
                        <p className="text-sm text-text-secondary">Rejeitadas</p>
                        <p className="text-2xl font-bold text-text-primary">{documents.filter(d => d.status === 'Rejected').length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-border-default shadow-sm border-l-4 border-l-gray-300">
                        <p className="text-sm text-text-secondary">Canceladas</p>
                        <p className="text-2xl font-bold text-text-primary">{documents.filter(d => d.status === 'Cancelled').length}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-border-default overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-default flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Buscar por número, chave ou parceiro..."
                                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white min-w-[200px]"
                        >
                            <option value="All">Todos os Status</option>
                            <option value="Authorized">Autorizadas</option>
                            <option value="Processing">Processando</option>
                            <option value="Rejected">Rejeitadas</option>
                            <option value="Cancelled">Canceladas</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-border-default text-xs uppercase text-text-secondary font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Documento</th>
                                    <th className="px-6 py-3">Destinatário</th>
                                    <th className="px-6 py-3">Data Emissão</th>
                                    <th className="px-6 py-3 text-right">Valor Total</th>
                                    <th className="px-6 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default">
                                {loading && documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                                            Carregando via SEFAZ...
                                        </td>
                                    </tr>
                                ) : filteredDocuments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                                            Nenhum documento fiscal encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDocuments.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                {getStatusBadge(doc.status)}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-text-primary">{doc.documentNumber}-{doc.series}</span>
                                                    <span className="text-xs text-text-tertiary">Ref: {doc.invoiceNumber || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-text-secondary font-medium">{doc.partnerName}</td>
                                            <td className="px-6 py-3 text-text-secondary text-sm">
                                                {new Date(doc.issuedAt).toLocaleDateString('pt-BR')}
                                                <span className="text-xs text-text-tertiary ml-1">
                                                    {new Date(doc.issuedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right font-medium">
                                                {doc.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    onClick={() => navigate(`/finance/invoices/${doc.invoiceId}`)}
                                                    className="text-brand-primary hover:text-brand-secondary p-1 rounded hover:bg-brand-muted/10 transition-colors"
                                                    title="Visualizar Fatura (MIRO)"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NfeMonitorPage;
