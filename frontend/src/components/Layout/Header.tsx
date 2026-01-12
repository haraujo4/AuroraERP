import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';

export function Header() {
    const [tcode, setTcode] = useState('');

    const handleTCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Executing T-Code: ${tcode}`);
        // T-Code execution logic will go here
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
                <button className="p-2 text-text-secondary hover:bg-bg-main rounded-full">
                    <Bell size={16} />
                </button>
                <div className="h-6 w-px bg-border-default" />
                <div className="flex items-center gap-2 cursor-pointer hover:bg-bg-main py-1 px-2 rounded transition-colors">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-medium text-xs">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-text-primary">John Doe</span>
                        <span className="text-[10px] text-text-muted">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
