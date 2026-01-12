import React, { useEffect, useState } from 'react';
import type { Branch } from '../../types/organization';
import { branchService } from '../../services/branchService';
import { Link } from 'react-router-dom';
import { Plus, Building2 } from 'lucide-react';

export function BranchList() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        try {
            const data = await branchService.getAll();
            setBranches(data);
        } catch (error) {
            console.error('Failed to load branches', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Carregando filiais...</div>;

    return (
        <div className="flex flex-col h-full bg-bg-main p-4">
            <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-border-default shadow-sm">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-text-primary">Filiais</h1>
                </div>

                <Link
                    to="/admin/branches/new"
                    className="flex items-center px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors text-sm font-medium"
                >
                    <Plus size={16} className="mr-2" />
                    Nova Filial
                </Link>
            </div>

            <div className="flex-1 overflow-auto bg-white border border-border-default rounded shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-header sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Código</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Descrição</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Empresa</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Cidade/UF</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default">Tipo</th>
                            <th className="p-3 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-default text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">Carregando...</td>
                            </tr>
                        ) : branches.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-text-secondary">
                                    Nenhuma filial encontrada.
                                </td>
                            </tr>
                        ) : (
                            branches.map((branch) => (
                                <tr key={branch.id} className="hover:bg-bg-main cursor-pointer transition-colors text-sm text-text-primary">
                                    <td className="p-3 font-mono">{branch.codigo}</td>
                                    <td className="p-3 font-medium">{branch.descricao}</td>
                                    <td className="p-3">{branch.empresaName}</td>
                                    <td className="p-3">{branch.city} - {branch.state}</td>
                                    <td className="p-3">{branch.tipo}</td>
                                    <td className="p-3 text-right">
                                        <Link to={`/admin/branches/${branch.id}`} className="text-brand-primary hover:text-brand-secondary font-medium">
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-2 text-xs text-text-secondary text-right">
                Registros: {branches.length}
            </div>
        </div>
    );
}
