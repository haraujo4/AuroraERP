import React, { useState, useEffect } from 'react';
import { Shield, Plus, Save, Edit, CheckSquare, Square } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

interface Permission {
    id: string;
    code: string;
    name: string;
    module: string;
    transaction: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
}

const AccessControlPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isNewRole, setIsNewRole] = useState(false);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await api.get('/security/roles');
            setRoles(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar grupos de acesso.');
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await api.get('/security/roles/permissions');
            setAllPermissions(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar permissões.');
        }
    };

    const handleSelectRole = (role: Role) => {
        setSelectedRole(role);
        setRoleName(role.name);
        setRoleDescription(role.description);
        setSelectedPermissions(role.permissions.map(p => p.id));
        setIsEditing(false);
        setIsNewRole(false);
    };

    const handleNewRole = () => {
        setSelectedRole(null);
        setRoleName('');
        setRoleDescription('');
        setSelectedPermissions([]);
        setIsEditing(true);
        setIsNewRole(true);
    };

    const handleSave = async () => {
        if (!roleName) {
            toast.error('Nome do grupo é obrigatório.');
            return;
        }

        setLoading(true);
        const payload = {
            name: roleName,
            description: roleDescription,
            permissionIds: selectedPermissions
        };

        try {
            if (isNewRole) {
                await api.post('/security/roles', payload);
                toast.success('Grupo criado com sucesso!');
            } else if (selectedRole) {
                await api.put(`/security/roles/${selectedRole.id}`, payload);
                toast.success('Grupo atualizado com sucesso!');
            }
            setIsEditing(false);
            setIsNewRole(false);
            fetchRoles();
            setSelectedRole(null); // Reset selection
        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar grupo.');
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (id: string) => {
        if (!isEditing) return;
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Group permissions by Module and Transaction
    const groupedPermissions = allPermissions.reduce((acc, curr) => {
        const key = `${curr.module} > ${curr.transaction}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(curr);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            <div className="flex items-center justify-between p-4 bg-white border-b border-border-secondary shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Controle de Acessos (SU01)</h1>
                    <p className="text-sm text-text-secondary">Gestão de Grupos de Usuário e Permissões</p>
                </div>
                <button
                    onClick={handleNewRole}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Novo Grupo
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Roles List */}
                <div className="w-1/4 bg-white border-r border-border-default overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-xs uppercase text-text-secondary font-semibold mb-4">Grupos Existentes</h2>
                        <div className="space-y-2">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => handleSelectRole(role)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between group ${selectedRole?.id === role.id ? 'bg-brand-muted/20 text-brand-primary border border-brand-primary/30' : 'hover:bg-gray-50 text-text-primary'
                                        }`}
                                >
                                    <div>
                                        <p className="font-medium">{role.name}</p>
                                        <p className="text-xs text-text-tertiary truncate">{role.description}</p>
                                    </div>
                                    <Shield className={`w-4 h-4 ${selectedRole?.id === role.id ? 'text-brand-primary' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content: Role Editor */}
                <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
                    {(selectedRole || isNewRole) ? (
                        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-border-default overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-border-default flex justify-between items-center">
                                {isEditing ? (
                                    <div className="flex-1 mr-4 space-y-4">
                                        <input
                                            type="text"
                                            value={roleName}
                                            onChange={(e) => setRoleName(e.target.value)}
                                            placeholder="Nome do Grupo (Ex: COMPRAS_GERENTE)"
                                            className="w-full px-4 py-2 text-lg font-bold border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                            disabled={!isNewRole} // Name immutable if updating? existing code allows rename? Let's check backend. Backend allows creating only. Update only updates description/permissions. For now allow name edit only on creation.
                                        />
                                        <input
                                            type="text"
                                            value={roleDescription}
                                            onChange={(e) => setRoleDescription(e.target.value)}
                                            placeholder="Descrição do Grupo"
                                            className="w-full px-4 py-2 text-sm border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl font-bold text-text-primary">{selectedRole?.name}</h2>
                                        <p className="text-text-secondary">{selectedRole?.description}</p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border border-border-default rounded-lg text-text-secondary hover:bg-gray-50"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4" />
                                                Salvar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => { setIsNewRole(false); setIsEditing(true); }}
                                            className="flex items-center gap-2 border border-border-default text-text-primary px-4 py-2 rounded-lg hover:bg-gray-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Editar
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Permissions Matrix */}
                            <div className="p-6 bg-gray-50">
                                <h3 className="text-sm font-semibold uppercase text-text-secondary mb-4">Matriz de Permissões</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(groupedPermissions).map(([groupInfo, perms]) => (
                                        <div key={groupInfo} className="bg-white p-4 rounded-lg border border-border-default shadow-sm">
                                            <h4 className="font-medium text-brand-primary mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                {groupInfo}
                                            </h4>
                                            <div className="space-y-2">
                                                {perms.map(perm => (
                                                    <div
                                                        key={perm.id}
                                                        onClick={() => togglePermission(perm.id)}
                                                        className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${isEditing ? 'hover:bg-gray-50' : 'cursor-default'}`}
                                                    >
                                                        <div className={`mt-0.5 ${isEditing ? 'text-brand-primary' : 'text-gray-400'}`}>
                                                            {selectedPermissions.includes(perm.id) ? (
                                                                <CheckSquare className="w-5 h-5" />
                                                            ) : (
                                                                <Square className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-medium ${selectedPermissions.includes(perm.id) ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                {perm.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400">{perm.code}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-tertiary">
                            <Shield className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">Selecione um grupo para editar ou crie um novo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccessControlPage;
