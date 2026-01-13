import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatusBar } from './StatusBar';
import { Outlet } from 'react-router-dom';

export function Layout() {
    const [sidebarOpen] = useState(true);

    // Favorites State Management lifted to Layout
    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem('aurora_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('aurora_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(fav => fav !== id)
                : [...prev, id]
        );
    };

    // Global Search State
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="h-screen w-screen flex overflow-hidden bg-bg-main">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {/* Work Area */}
                <main className="flex-1 overflow-auto p-4 relative">
                    <Outlet context={{ searchTerm }} />
                </main>

                <StatusBar />
            </div>
        </div>
    );
}
