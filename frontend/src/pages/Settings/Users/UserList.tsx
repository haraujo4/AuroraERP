import { useState, useEffect } from 'react';
import { Plus, Search, Shield, ShieldAlert, Edit2 } from 'lucide-react';
import { api } from '../../../services/api';

import { UserFormModal } from './UserFormModal';

interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    isActive: boolean;
    lastLogin?: string;
    empresaName?: string;
    empresaId?: string;
    filialName?: string;
    filialId?: string;
    permissions?: string[];
}

export function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async (user: User) => {
        if (!confirm(`Deseja ${user.isActive ? 'desativar' : 'ativar'} o usuário ${user.username}?`)) return;

        try {
            await api.put(`/users/${user.id}`, {
                email: user.email,
                isActive: !user.isActive,
                roles: user.roles,
                empresaId: user.empresaId, // Preserve context
                filialId: user.filialId
            });
            loadUsers();
        } catch (error) {
            alert('Erro ao atualizar status do usuário');
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCreateUser = () => {
        setSelectedUser(undefined);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                    />
                </div>
                <button
                    onClick={handleCreateUser}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Novo Usuário
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border-secondary overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Usuário</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Empresa</th>
                            <th className="px-6 py-3">Filial</th>
                            <th className="px-6 py-3">Função</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Último Login</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">Carregando usuários...</td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">Nenhum usuário encontrado.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-3 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-3 text-gray-600">{user.empresaName || '-'}</td>
                                    <td className="px-6 py-3 text-gray-600">{user.filialName || '-'}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex gap-1">
                                            {user.roles.map(role => (
                                                <span key={role} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${user.isActive
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {user.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${user.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'
                                                    }`}
                                                title={user.isActive ? "Desativar" : "Ativar"}
                                            >
                                                {user.isActive ? <ShieldAlert size={16} /> : <Shield size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    loadUsers();
                }}
                user={selectedUser}
            />
        </div>
    );
}
