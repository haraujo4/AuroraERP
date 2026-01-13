import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { authService } from '../services/authService';

export interface Notification {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    date: string;
    read: boolean;
}

interface SignalRContextType {
    connection: signalR.HubConnection | null;
    notifications: Notification[];
    isConnected: boolean;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export function SignalRProvider({ children }: { children: React.ReactNode }) {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const token = authService.getToken();
        if (!token) return;

        const baseUrl = import.meta.env.VITE_API_URL || 'http://31.97.168.147:5000/api';
        const hubUrl = baseUrl.replace(/\/api$/, '') + '/hubs/notifications';
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('SignalR Connected!');
                    setIsConnected(true);

                    connection.on('ReceiveNotification', (notification: any) => {
                        console.log('Notification received:', notification);
                        const newNotification: Notification = {
                            ...notification,
                            read: false
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                    });
                })
                .catch(err => console.error('SignalR Connection Error: ', err));

            return () => {
                connection.stop();
            };
        }
    }, [connection]);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <SignalRContext.Provider value={{ connection, notifications, isConnected, markAllAsRead, clearNotifications }}>
            {children}
        </SignalRContext.Provider>
    );
}

export function useSignalR() {
    const context = useContext(SignalRContext);
    if (!context) {
        throw new Error('useSignalR must be used within a SignalRProvider');
    }
    return context;
}
