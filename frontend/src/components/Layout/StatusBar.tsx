
import { CheckCircle } from 'lucide-react';

export function StatusBar() {
    return (
        <div className="h-8 bg-bg-panel border-t border-border-default flex items-center justify-between px-4 text-xs select-none">

            {/* Left: System Message */}
            <div className="flex items-center gap-2 text-status-success font-medium">
                <CheckCircle size={12} />
                <span>Sistema pronto.</span>
            </div>

            {/* Right: Technical Info */}
            <div className="flex items-center gap-6 text-text-muted">
                <div className="flex gap-1">
                    <span className="uppercase">Srv:</span>
                    <span>PRD-01</span>
                </div>
                <div className="flex gap-1">
                    <span className="uppercase">Db:</span>
                    <span>aurora_db</span>
                </div>
                <div className="flex gap-1">
                    <span className="uppercase">Lat:</span>
                    <span>12ms</span>
                </div>
                <div className="flex gap-1">
                    <span className="uppercase">Ins:</span>
                    <span>OVR</span>
                </div>
            </div>
        </div>
    );
}
