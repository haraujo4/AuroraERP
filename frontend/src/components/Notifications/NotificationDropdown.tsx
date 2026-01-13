import { Bell, Check, Trash2 } from 'lucide-react';
import { useSignalR } from '../../contexts/SignalRContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils';

export function NotificationDropdown() {
    const { notifications, markAllAsRead, clearNotifications } = useSignalR();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-text-secondary hover:bg-bg-main rounded-lg transition-colors"
                title="Notificações"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border-secondary z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notificações</h3>
                        <div className="flex gap-2">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={markAllAsRead}
                                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Marcar todas como lidas"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={clearNotifications}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Limpar notificações"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Bell className="mx-auto mb-2 opacity-20" size={32} />
                                <p className="text-sm">Nenhuma notificação nova</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors",
                                            !notification.read ? "bg-blue-50/30" : ""
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                                                notification.type === 'error' ? "bg-red-500" :
                                                    notification.type === 'warning' ? "bg-amber-500" :
                                                        notification.type === 'success' ? "bg-green-500" :
                                                            "bg-blue-500"
                                            )} />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(notification.date).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
