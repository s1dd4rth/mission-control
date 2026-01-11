import axios from 'axios';
import { useState } from 'react';
import { useToast } from '../../components/ui/ToastContext';

interface CreateSpecModalProps {
    runtimeConfig: any;
    onClose: () => void;
    onSuccess: () => void;
    openFile: (path: string, title: string) => void;
}

export const CreateSpecModal = ({ runtimeConfig, onClose, onSuccess, openFile }: CreateSpecModalProps) => {
    const [newSpecName, setNewSpecName] = useState("");
    const { toast } = useToast();

    const handleCreate = async () => {
        if (newSpecName.trim()) {
            const name = newSpecName.trim();
            if (runtimeConfig?.api) {
                await axios.post(`${runtimeConfig.api}/api/scaffold/spec`, { name });
                const prompt = `Antigravity, let's shape the spec for '${name}'. Read commands/shape-spec/shape-spec.md.`;
                try {
                    await navigator.clipboard.writeText(prompt);
                    toast({ title: "Spec created & Prompt copied!", type: 'success' });
                } catch (err) {
                    console.error('Failed to copy', err);
                    toast({ title: "Spec created", description: "Standard prompt failed to copy", type: 'warning' });
                }
                setNewSpecName("");
                onSuccess();
                openFile(`specs/${name}/spec.md`, `${name} Spec`);
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                    <h3 className="font-semibold text-lg">New Feature Spec</h3>
                    <p className="text-sm text-muted-foreground">Shape a new feature for your project.</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Feature Name</label>
                            <input
                                autoFocus
                                type="text"
                                className="w-full px-3 py-2 rounded-md border border-input bg-secondary text-secondary-foreground text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="e.g. user-profile"
                                value={newSpecName}
                                onChange={(e) => setNewSpecName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreate();
                                }}
                            />
                            <p className="text-xs text-muted-foreground mt-1.5">
                                This will create a new directory in <code>specs/</code> and copy the prompt to your clipboard.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">Cancel</button>
                            <button
                                disabled={!newSpecName.trim()}
                                onClick={handleCreate}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Spec
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
