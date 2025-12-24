import { PromptButton } from './PromptButton'

interface GuidanceCardProps {
    phase?: string
    title: string
    description: string
    prompt?: string
    actionLabel?: string
    onAction?: () => void
    onCopy?: (text: string) => void
    className?: string
}

export function GuidanceCard({
    phase,
    title,
    description,
    prompt,
    actionLabel,
    onAction,
    onCopy,
    className
}: GuidanceCardProps) {
    const handleCopy = (text: string) => {
        if (onCopy) {
            onCopy(text)
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
        }
    }

    return (
        <div className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm relative overflow-hidden ${className || ''}`}>
            {/* Decorative Background Icon Effect - Optional, kept simple for package */}

            <div className="relative z-10">
                {phase && (
                    <div className="text-xs font-bold tracking-wider text-stone-500 uppercase mb-2">
                        {phase}
                    </div>
                )}

                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                    {title}
                </h2>

                <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-2xl leading-relaxed">
                    {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {prompt && (
                        <div className="flex-1 w-full sm:w-auto">
                            <PromptButton
                                label="Copy Prompt for Agent"
                                prompt={prompt}
                                onClick={handleCopy}
                                primary
                            />
                        </div>
                    )}

                    {actionLabel && onAction && (
                        <button
                            onClick={onAction}
                            className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
                        >
                            {actionLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
