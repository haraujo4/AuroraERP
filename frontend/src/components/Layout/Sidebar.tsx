
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ChevronRight, ChevronDown, Search, Star
} from 'lucide-react';
import { cn } from '../../utils';
import { findTransaction } from '../../utils/transactionRegistry';
import { MENU_ITEMS } from '../../utils/menuItems';
import type { SubItem, MenuItem } from '../../utils/menuItems';

interface SidebarProps {
    isOpen: boolean;
    favorites: string[];
    onToggleFavorite: (id: string) => void;
}

export function Sidebar({ isOpen, favorites, onToggleFavorite }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [openModules, setOpenModules] = useState<string[]>(['organization', 'favorites']); // Open favorites by default

    const toggleModule = (id: string) => {
        setOpenModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleFavoriteClick = (e: React.MouseEvent, subItemId: string) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite(subItemId);
    };

    // Flatten all subitems to easily find them by ID
    const allSubItems = MENU_ITEMS.flatMap(item => item.subItems || []);

    // Construct the menu with dynamic favorites
    const menuItems = MENU_ITEMS.map(item => {
        if (item.id === 'favorites') {
            const favoriteItems = favorites
                .map(favId => allSubItems.find(sub => sub.id === favId))
                .filter((sub): sub is SubItem => !!sub);

            return {
                ...item,
                subItems: favoriteItems.length > 0 ? favoriteItems : undefined,
                // If it has no items, we might want to hide it or show empty state. 
                // For now let's show it so users know where they go.
                // Actually, if empty, maybe show a "No favorites" dummy item or just be empty.
            };
        }
        return item;
    });

    return (
        <aside className={cn(
            "bg-bg-sidebar border-r border-border-default flex flex-col transition-all duration-300",
            isOpen ? "w-64" : "w-0 overflow-hidden"
        )}>
            {/* Transaction Search Bar */}
            <div className="h-14 flex items-center px-3 border-b border-border-default/50">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                        const tcode = input.value;
                        const transaction = findTransaction(tcode);
                        if (transaction) {
                            navigate(transaction.path);
                            input.value = '';
                        }
                    }}
                    className="w-full relative group"
                >
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <Search size={14} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Transação (ex: VA01)..."
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-bg-main border border-transparent focus:bg-white focus:border-brand-primary rounded-md outline-none transition-all uppercase placeholder:normal-case shadow-sm"
                    />
                </form>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
                {menuItems.map((item) => {
                    const isActive = openModules.includes(item.id);
                    const hasChildren = item.subItems && item.subItems.length > 0;
                    const Icon = item.icon;
                    const isFavoritesSection = item.id === 'favorites';

                    // Hide empty favorites section if desired, but user wants to access them, so keep visible
                    // If favorites is empty and not active, functionality works.

                    return (
                        <div key={item.id}>
                            <div
                                onClick={() => (hasChildren || isFavoritesSection) && toggleModule(item.id)}
                                className={cn(
                                    "flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors border-l-2 border-transparent select-none",
                                    isActive && (!hasChildren && !isFavoritesSection) ? "bg-white border-brand-primary text-brand-primary font-medium" : "text-text-secondary hover:bg-white/50 hover:text-text-primary",
                                    isFavoritesSection && "text-brand-primary font-medium" // Highlight favorites header slightly
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={16} className={cn(isFavoritesSection && "text-yellow-500 fill-yellow-500")} />
                                    <span>{item.label}</span>
                                </div>
                                {(hasChildren || isFavoritesSection) && (
                                    isActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                )}
                            </div>

                            {/* Submenu */}
                            {isActive && (
                                <div className="bg-bg-subtle/30">
                                    {isFavoritesSection && (!item.subItems || item.subItems.length === 0) && (
                                        <div className="py-2 pl-11 pr-4 text-xs text-text-muted italic">
                                            Sem favoritos
                                        </div>
                                    )}
                                    {item.subItems?.map(sub => {
                                        const isFavorite = favorites.includes(sub.id);
                                        return (
                                            <div key={sub.id} className="relative group">
                                                <Link
                                                    to={sub.path}
                                                    className={cn(
                                                        "block py-2 pl-11 pr-8 text-xs hover:text-brand-primary transition-colors", // increased pr for star
                                                        location.pathname === sub.path ? "text-brand-primary font-bold bg-white/50" : "text-text-secondary"
                                                    )}
                                                >
                                                    {sub.label}
                                                </Link>
                                                {/* Favorite Toggle Star */}
                                                {!isFavoritesSection && (
                                                    <button
                                                        onClick={(e) => handleFavoriteClick(e, sub.id)}
                                                        className={cn(
                                                            "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-20 cursor-pointer", // Increased padding and z-index
                                                            isFavorite ? "text-yellow-500 opacity-100" : "text-gray-300 hover:text-yellow-400 opacity-100" // Always visible
                                                        )}
                                                        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                                    >
                                                        <Star
                                                            size={14}
                                                            className={cn(
                                                                "transition-all",
                                                                isFavorite ? "fill-yellow-500" : ""
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                                {/* Allow removing from favorites section too */}
                                                {isFavoritesSection && (
                                                    <button
                                                        onClick={(e) => handleFavoriteClick(e, sub.id)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-20 cursor-pointer"
                                                        title="Remover dos favoritos"
                                                    >
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer with Version Only */}
            <div className="p-4 border-t border-border-default">
                <div className="text-[10px] text-text-muted text-center">
                    Aurora ERP v1.0.0
                </div>
            </div>
        </aside>
    );
}
