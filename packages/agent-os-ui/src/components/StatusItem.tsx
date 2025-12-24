import { ReactNode } from 'react'

interface Status {
    exists: boolean
    completed?: number
    total?: number
    label?: string
}

interface StatusItemProps {
    label: string
    status: Status | undefined | null
    icon: ReactNode
    small?: boolean
    onClick?: () => void
    className?: string
}

export function StatusItem({ label, status, icon, small, onClick, className }: StatusItemProps) {
    if (!status) return null
    const isComplete = status.exists && (status.total && status.total > 0 ? status.completed === status.total : true)

    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between ${small ? 'text-xs' : 'text-sm'} ${onClick ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1.5 -mx-1.5 rounded-md transition-colors group' : ''} ${className || ''}`}
        >
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                {icon}
                <span>{label}</span>
            </div>
            <div>
                {status.exists ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${isComplete
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>
                        {status.total && status.total > 0 ? `${status.completed}/${status.total}` : (status.label || 'Done')}
                    </span>
                ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">Missing</span>
                )}
            </div>
        </div>
    )
}
