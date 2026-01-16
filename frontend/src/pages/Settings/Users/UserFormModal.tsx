import { useState, useEffect } from 'react';
import { X, Save, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../../services/api';
import { OrganizationService } from '../../../services/organizationService';
import { PermissionService, type Permission } from '../../../services/permissionService';
import { RoleService, type Role } from '../../../services/roleService';
import type { Empresa, Branch } from '../../../types/organization';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user?: any; // Pass user object for editing
}

export function UserFormModal({ isOpen, onClose, onSuccess, user }: UserFormModalProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companies, setCompanies] = useState<Empresa[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Enhanced RBAC
    const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['User']);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [showPermissions, setShowPermissions] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCompanies();
            loadPermissions();
            loadRoles();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && user) {
            // Edit Mode: Pre-fill data
            setUsername(user.username);
            setEmail(user.email);
            setPassword(''); // Don't fill password
            setSelectedRoles(user.roles || []);
            // TODO: user object might not have permissions populated depending on List API. 
            // If not, we might need to fetch user details. Assuming current list has it or we accept empties.
            setSelectedPermissions(user.permissions || []);
            setSelectedCompany(user.empresaId || '');
            setSelectedBranch(user.filialId || '');
        } else if (isOpen && !user) {
            // Create Mode: Reset
            setUsername('');
            setEmail('');
            setPassword('');
            setSelectedRoles(['User']);
            setSelectedPermissions([]);
            setSelectedCompany('');
            setSelectedBranch('');
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (selectedCompany) {
            loadBranches(selectedCompany);
        } else {
            setBranches([]);
            // Don't clear selectedBranch if editing and it matches
            if (!user || user.filialId !== selectedBranch) {
                setSelectedBranch('');
            }
        }
    }, [selectedCompany]);

    const loadCompanies = async () => {
        const groups = await OrganizationService.getGroups();
        if (groups.length > 0) {
            const comps = await OrganizationService.getCompaniesByGroup(groups[0].id);
            setCompanies(comps);
        }
    };

    const loadBranches = async (companyId: string) => {
        const allBranches = await OrganizationService.getBranches();
        setBranches(allBranches.filter(b => b.empresaId === companyId));
    };

    const loadPermissions = async () => {
        try {
            const perms = await PermissionService.getAll();
            setAvailablePermissions(perms);
        } catch (error) {
            console.error('Failed to load permissions', error);
        }
    };

    const loadRoles = async () => {
        try {
            const roles = await RoleService.getAll();
            setAvailableRoles(roles);
        } catch (error) {
            console.error('Failed to load roles', error);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                // Only send username/email/password if creating or if specific logic allows (usually backend handles optional password on update)
                ...(user ? {} : { username, password }),
                email,
                ...(password ? { password } : {}), // Only send password if changed
                roles: selectedRoles,
                permissions: selectedPermissions,
                empresaId: selectedCompany || null,
                filialId: selectedBranch || null,
                isActive: user ? user.isActive : true
            };

            if (user && user.id) {
                await api.put(`/users/${user.id}`, payload);
            } else {
                await api.post('/users', { ...payload, username });
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erro ao salvar usuário');
        } finally {
            setIsSaving(false);
        }
    };

    const togglePermission = (code: string) => {
        setSelectedPermissions(prev =>
            prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">{user ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="w-full px-3 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none bg-gray-50 text-gray-500"
                                        readOnly={!!user}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {user ? 'Nova Senha (opcional)' : 'Senha'}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                                        required={!user}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                                    <select
                                        value={selectedCompany}
                                        onChange={e => setSelectedCompany(e.target.value)}
                                        className="w-full px-3 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none bg-white"
                                    >
                                        <option value="">Selecione...</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.nomeFantasia}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Filial</label>
                                    <select
                                        value={selectedBranch}
                                        onChange={e => setSelectedBranch(e.target.value)}
                                        className="w-full px-3 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none bg-white"
                                        disabled={!selectedCompany}
                                    >
                                        <option value="">Selecione...</option>
                                        {branches.map(b => (
                                            <option key={b.id} value={b.id}>{b.descricao}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Funções (Roles)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableRoles.length === 0 ? (
                                            <p className="text-xs text-text-tertiary">Nenhum grupo encontrado.</p>
                                        ) : (
                                            availableRoles.map(role => (
                                                <label key={role.id} className={`cursor-pointer px-3 py-1 rounded-full text-xs border ${selectedRoles.includes(role.name)
                                                        ? 'bg-brand-primary text-white border-brand-primary'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-primary'
                                                    }`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={selectedRoles.includes(role.name)}
                                                        onChange={e => {
                                                            if (e.target.checked) setSelectedRoles(prev => [...prev, role.name]);
                                                            else setSelectedRoles(prev => prev.filter(r => r !== role.name));
                                                        }}
                                                    />
                                                    {role.name}
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <div className="border rounded-lg border-gray-200 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowPermissions(!showPermissions)}
                                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock size={16} className="text-gray-400" />
                                    Permissões Individuais ({selectedPermissions.length})
                                </span>
                                {showPermissions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {showPermissions && (
                                <div className="p-3 bg-white max-h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {availablePermissions.length === 0 ? (
                                        <p className="text-sm text-gray-500 p-2 col-span-2 text-center">Nenhuma permissão encontrada.</p>
                                    ) : (
                                        availablePermissions.map(perm => (
                                            <label key={perm.code} className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(perm.code)}
                                                    onChange={() => togglePermission(perm.code)}
                                                    className="mt-1 w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{perm.name}</p>
                                                    <p className="text-xs text-text-tertiary">{perm.description || perm.code}</p>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="user-form"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-70 shadow-sm"
                    >
                        <Save size={16} />
                        {isSaving ? 'Salvar' : 'Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
