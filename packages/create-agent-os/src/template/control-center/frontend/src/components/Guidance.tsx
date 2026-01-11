import { ArrowRight, Copy } from 'lucide-react';
import { useToast } from '../components/ui/ToastContext';

interface GuidanceProps {
    phase: string;
    title: string;
    description: string;
    prompt?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export const Guidance = ({ phase, title, description, prompt, actionLabel, onAction, className }: GuidanceProps) => {
    const { toast } = useToast();

    return (
        <div className={`bg-card border border-border rounded-xl p-6 shadow-sm ${className}`}>
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                {phase}
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="max-w-xl">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
                {(prompt || actionLabel) && (
                    <div className="flex items-center gap-3 shrink-0">
                        {prompt && (
                            <button
                                onClick={async () => {
                                    if (!prompt) return;
                                    try {
                                        await navigator.clipboard.writeText(prompt);
                                        toast({ title: "Prompt Copied!", type: 'success' });
                                    } catch (err) {
                                        console.error('Failed to copy', err);
                                        toast({ title: "Failed to copy", description: "Please copy manually", type: 'error' });
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg border border-border transition-all shadow-sm hover:shadow"
                            >
                                <Copy size={16} />
                                Copy Prompt
                            </button>
                        )}
                        {actionLabel && (
                            <button
                                onClick={onAction}
                                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                            >
                                {actionLabel} <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
