import { Copy } from 'lucide-react'

interface PromptButtonProps {
    label: string
    prompt: string
    onClick: (text: string) => void
    small?: boolean
    primary?: boolean
    className?: string
}

export function PromptButton({ label, prompt, onClick, small, primary, className }: PromptButtonProps) {
    return (
        <button
            onClick={() => onClick(prompt)}
            className={`flex items-center justify-center gap-2 rounded-lg font-medium transition cursor-pointer
            ${small ? 'px-3 py-1.5 text-xs flex-1' : 'px-4 py-2 text-sm w-full'}
            ${primary
                    ? 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 shadow-sm'
                    : 'bg-white hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'}
            ${className || ''}
          `}
        >
            <Copy size={small ? 12 : 14} />
            {label}
        </button>
    )
}
