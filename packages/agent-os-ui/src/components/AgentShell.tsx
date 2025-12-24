import { ReactNode } from 'react'

interface AgentShellProps {
    sidebar: ReactNode
    header?: ReactNode
    children: ReactNode
    className?: string
}

export function AgentShell({ sidebar, header, children, className }: AgentShellProps) {
    return (
        <div className={`flex h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-sans transition-colors ${className || ''}`}>
            {/* Sidebar Area */}
            <div className="shrink-0">
                {sidebar}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {header && (
                    <div className="shrink-0">
                        {header}
                    </div>
                )}
                <main className="flex-1 overflow-auto bg-stone-50 dark:bg-black/20">
                    {children}
                </main>
            </div>
        </div>
    )
}
