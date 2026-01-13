

import { useState, useEffect } from 'react';
import { systemService, type SystemInfo } from '../../services/systemService';

export function StatusBar() {
    const [info, setInfo] = useState<SystemInfo | null>(null);
    const [latency, setLatency] = useState<number>(0);
    const [status, setStatus] = useState<'ESTÁVEL' | 'OSCILANDO' | 'DESCONECTADO'>('ESTÁVEL');
    const [isInsert, setIsInsert] = useState<boolean>(true);

    const fetchInfo = async () => {
        const start = performance.now();
        try {
            const data = await systemService.getSystemInfo();
            const end = performance.now();
            setInfo(data);
            const lat = Math.round(end - start);
            setLatency(lat);

            if (lat > 500) setStatus('OSCILANDO');
            else setStatus('ESTÁVEL');
        } catch (error) {
            setStatus('DESCONECTADO');
        }
    };

    useEffect(() => {
        fetchInfo();
        const interval = setInterval(fetchInfo, 30000); // Update every 30s

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Insert') {
                setIsInsert(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const getStatusColor = () => {
        switch (status) {
            case 'ESTÁVEL': return 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.4)]';
            case 'OSCILANDO': return 'bg-yellow-500 shadow-[0_0_4px_rgba(234,179,8,0.4)]';
            case 'DESCONECTADO': return 'bg-red-500 shadow-[0_0_4px_rgba(239,44,44,0.4)]';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="h-8 bg-bg-panel border-t border-border-default flex items-center justify-between px-4 text-xs select-none">

            {/* Left: Content or Empty */}
            <div className="flex items-center gap-2">
                {/* Reserved for contextual messages */}
            </div>

            {/* Right: Technical Info */}
            <div className="flex items-center gap-6 text-text-muted">
                <div className="flex items-center gap-3 pr-2 border-r border-border-default/50">
                    <span className="text-[10px] font-bold">SISTEMA: AURORA ERP</span>
                    <div className={`flex items-center gap-1.5 ${status === 'DESCONECTADO' ? '' : 'grayscale opacity-70'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
                        <span className="text-[10px]">{status}</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <span className="uppercase font-bold">Srv:</span>
                    <span>{info?.serverName || '...'}</span>
                </div>
                <div className="flex gap-1">
                    <span className="uppercase font-bold">Db:</span>
                    <span>{info?.databaseName || '...'}</span>
                </div>
                <div className="flex gap-1">
                    <span className="uppercase font-bold">Lat:</span>
                    <span>{latency > 0 ? `${latency}ms` : '--ms'}</span>
                </div>
                <div className="flex gap-1 w-8">
                    <span className="uppercase font-bold">{isInsert ? 'INS' : 'OVR'}</span>
                </div>
            </div>
        </div>
    );
}
