import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatusBar } from './StatusBar';
import { Outlet } from 'react-router-dom';

export function Layout() {
    const [sidebarOpen] = useState(true);

    return (
        <div className="h-screen w-screen flex overflow-hidden bg-bg-main">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />

                {/* Work Area */}
                <main className="flex-1 overflow-auto p-4 relative">
                    <Outlet />
                </main>

                <StatusBar />
            </div>
        </div>
    );
}
