import React, { useState } from 'react';
import { Search, Bell, Settings, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils';

export function Header() {
    const [tcode, setTcode] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleTCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Executing T-Code: ${tcode}`);
        // T-Code execution logic will go here
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className="h-12 bg-bg-panel border-b border-border-default flex items-center justify-between px-4 shadow-sm z-10">

            {/* Left: Branding & Context */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="font-bold text-base text-brand-primary leading-tight">AURORA ERP</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">Production</span>
                </div>
                <div className="h-6 w-px bg-border-default mx-2" />
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="font-medium">Aurora Ind.</span>
                    <span className="text-text-muted">/</span>
                    <span>Matriz SP</span>
                </div>
            </div>

            {/* Center: T-Code Command Bar */}
            <form onSubmit={handleTCodeSubmit} className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-text-muted" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-9 pr-4 py-1.5 text-sm border border-border-default rounded bg-bg-main focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors uppercase placeholder:normal-case"
                        placeholder="Digite a transação (ex: VA01)..."
                        value={tcode}
                        onChange={(e) => setTcode(e.target.value)}
                    />
                </div>
            </form>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-3">
                <button className="p-2 text-text-secondary hover:bg-bg-main rounded-full relative">
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-6 w-px bg-border-default mx-1" />

                <div className="relative">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 hover:bg-bg-main py-1 px-2 rounded transition-colors group select-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs border border-brand-primary/20">
                            {user?.username.substring(0, 2).toUpperCase() || 'AU'}
                        </div>
                        <div className="hidden sm:flex flex-col items-start">
                            <span className="text-xs font-bold text-text-primary capitalize leading-tight">{user?.username || 'Usuário'}</span>
                            <span className="text-[10px] text-text-muted capitalize">{user?.roles?.[0]?.toLowerCase() || 'Admin'}</span>
                        </div>
                        <ChevronDown size={14} className={cn("text-text-muted transition-transform duration-200", isUserMenuOpen && "rotate-180")} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsUserMenuOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-border-default rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="px-4 py-3 border-b border-border-default bg-bg-main/30">
                                    <p className="text-sm font-bold text-text-primary truncate">{user?.username}</p>
                                    <p className="text-xs text-text-muted truncate">{user?.roles?.[0]}</p>
                                </div>

                                <div className="py-1">
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text-secondary hover:bg-bg-main transition-colors">
                                        <UserIcon size={14} />
                                        <span>Meu Perfil</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text-secondary hover:bg-bg-main transition-colors">
                                        <Settings size={14} />
                                        <span>Configurações</span>
                                    </button>
                                </div>

                                <div className="border-t border-border-default mt-1 pt-1 pb-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
                                    >
                                        <LogOut size={14} />
                                        <span>Sair do Sistema</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
