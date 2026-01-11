import { X, Settings } from 'lucide-react';
import { useContext } from 'react';
import { IdeContext } from '../../contexts/IdeContext';

interface SettingsModalProps {
    onClose: () => void;
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
    const { scheme, setScheme } = useContext(IdeContext);

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-sm rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Settings size={18} /> Settings</h3>
                    <button onClick={onClose} className="hover:bg-secondary p-1 rounded"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">IDE / Editor</label>
                        <div className="space-y-2">
                            {['vscode', 'cursor', 'windsurf', 'antigravity'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setScheme(s)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${scheme === s
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-secondary/20 border-border hover:border-foreground/20'
                                        }`}
                                >
                                    <span className="capitalize font-medium">{s}</span>
                                    {scheme === s && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            Select the editor to open when clicking "Play".
                            <br />Currently using: <code>{scheme}://</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
