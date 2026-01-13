import { useState } from 'react';
import { Bell, Settings, User as UserIcon, LogOut, ChevronDown, Star, Search, X } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { MENU_ITEMS } from '../../utils/menuItems';

interface HeaderProps {
    favorites: string[];
    onToggleFavorite: (id: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export function Header({ favorites, onToggleFavorite, searchTerm, onSearchChange }: HeaderProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();

    // Find current transaction ID based on path
    const allSubItems = MENU_ITEMS.flatMap(item => item.subItems || []);
    // Find exact match or match ignoring localized params if needed
    // For now strict path match is good as registry paths are strict
    const currentTransaction = allSubItems.find(sub => sub.path === location.pathname);

    const isFavorite = currentTransaction ? favorites.includes(currentTransaction.id) : false;

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className="h-12 bg-bg-panel border-b border-border-default flex items-center justify-between px-4 shadow-sm z-10">

            {/* Left: Branding & Context & Favorite */}
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

                {/* Global Favorite Button for Current Transaction */}
                {currentTransaction && (
                    <>
                        <div className="h-6 w-px bg-border-default mx-2" />
                        <button
                            onClick={() => onToggleFavorite(currentTransaction.id)}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all",
                                isFavorite
                                    ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                    : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                            )}
                            title={isFavorite ? "Remover a tela atual dos favoritos" : "Adicionar a tela atual aos favoritos"}
                        >
                            <Star size={12} className={isFavorite ? "fill-yellow-500" : ""} />
                            <span>{isFavorite ? "Favorito" : "Favoritar"}</span>
                        </button>
                    </>
                )}
            </div>

            {/* Center: Global Search Bar */}
            <div className="flex-1 flex justify-center px-8">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Filtrar dados na tela..."
                        className="w-full pl-9 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

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
