import { Layers, X } from 'lucide-react';

interface DesignOSOverlayProps {
    onClose: () => void;
}

export const DesignOSOverlay = ({ onClose }: DesignOSOverlayProps) => {
    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-fade-in w-screen h-screen">
            <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card shrink-0 shadow-sm z-50">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-sidebar-primary/10 text-sidebar-primary rounded-md">
                        <Layers size={20} />
                    </div>
                    <h2 className="font-semibold text-lg text-foreground">Design OS</h2>
                    <span className="text-muted-foreground text-sm border-l border-border pl-3">Design System & Handoff</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                        title="Close Design OS"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
            <div className="flex-1 bg-background relative">
                <iframe
                    src={`http://localhost:5400?theme=${localStorage.getItem('theme') || 'system'}`}
                    className="absolute inset-0 w-full h-full border-none"
                    title="Design OS"
                    allow="clipboard-read; clipboard-write"
                />
            </div>
        </div >
    );
};
