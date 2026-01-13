import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronLeft, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils';
import { authService } from '../../services/authService';
import { useEffect } from 'react';

export function SettingsLayout() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isAdmin = user?.roles?.some(r => r.toLowerCase() === 'admin');

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
                    <p className="text-gray-500 mb-6">Esta área é restrita a administradores do sistema.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Voltar ao Dashboard
                    </button>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                        <p>Debug: Roles = {JSON.stringify(user?.roles)}</p>
                    </div>
                </div>
            </div>
        );
    }

    const navItems = [
        { path: '/settings/users', label: 'Usuários', icon: Users },
        { path: '/settings/company', label: 'Empresa', icon: Building2 },
    ];

    return (
        <div className="h-full flex flex-col bg-bg-primary">
            {/* Header */}
            <div className="bg-white border-b border-border-secondary px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">Configurações do Sistema</h1>
                        <p className="text-sm text-gray-500 mt-1">Gerencie usuários e dados da empresa</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-border-secondary flex flex-col py-4">
                    <nav className="flex-1 space-y-1 px-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-brand-primary/10 text-brand-primary"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-bg-primary p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
