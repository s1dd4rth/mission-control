import { ReactNode } from 'react'

interface SidebarItem {
    label: string
    icon?: ReactNode
    active?: boolean
    onClick?: () => void
    badge?: string | number
}

interface AgentSidebarProps {
    title?: string
    version?: string
    items: SidebarItem[]
    footer?: ReactNode
    className?: string
}

export function AgentSidebar({ title = "Agent OS", version = "v1.0", items, footer, className }: AgentSidebarProps) {
    return (
        <div className={`w-64 h-full bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 flex flex-col ${className || ''}`}>
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-stone-900 dark:bg-stone-100 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white dark:bg-stone-900 rounded-sm" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">{title}</span>
                </div>
                <div className="text-xs text-stone-500 font-mono pl-1">{version}</div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-1 overflow-y-auto">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active
                            ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className="text-xs bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded-md">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Footer */}
            {footer && (
                <div className="p-4 border-t border-stone-200 dark:border-stone-800">
                    {footer}
                </div>
            )}
        </div>
    )
}
