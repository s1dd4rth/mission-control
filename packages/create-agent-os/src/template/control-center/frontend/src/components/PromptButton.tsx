import { Copy, Play } from 'lucide-react';
import { useContext } from 'react';
import { IdeContext } from '../contexts/IdeContext';

interface PromptButtonProps {
    label: string;
    prompt: string;
    onClick: (text: string) => void;
    small?: boolean;
    primary?: boolean;
}

export function PromptButton({ label, prompt, onClick, small, primary }: PromptButtonProps) {
    const { scheme } = useContext(IdeContext);
    const deepLink = `${scheme}://vscode.executeCommand/workbench.action.chat.open?query=${encodeURIComponent(prompt)}`;

    return (
        <div className={`flex gap-1 items-center ${!small ? 'w-full' : 'flex-1'}`}>
            <button
                onClick={() => onClick(prompt)}
                className={`flex items-center justify-center gap-2 rounded-lg font-medium transition cursor-pointer flex-1
              ${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
              ${primary
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                        : 'bg-background hover:bg-secondary border border-border text-foreground hover:text-foreground'}
            `}
            >
                <Copy size={small ? 12 : 14} />
                {label}
            </button>

            <a
                href={deepLink}
                className={`flex items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground transition
          ${small ? 'w-8 h-[30px]' : 'w-10 h-[38px]'}
        `}
                title={`Run in IDE (${scheme}://)`}
            >
                <Play size={small ? 12 : 14} fill="currentColor" className="opacity-70" />
            </a>
        </div>
    )
}
