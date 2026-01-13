import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronLeft } from 'lucide-react';
import { cn } from '../../utils';
import { authService } from '../../services/authService';
import { useEffect } from 'react';

export function SettingsLayout() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isAdmin = user?.roles?.includes('Admin');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

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
