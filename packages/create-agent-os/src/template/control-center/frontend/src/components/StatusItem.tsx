import type { Status } from '../types';

interface StatusItemProps {
    label: string;
    status?: Status;
    icon: React.ReactNode;
    small?: boolean;
    onClick?: () => void;
}

export function StatusItem({ label, status, icon, small, onClick }: StatusItemProps) {
    if (!status) return null;
    const isComplete = status.exists && (status.total > 0 ? status.completed === status.total : true);

    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between ${small ? 'text-xs' : 'text-sm'} ${onClick ? 'cursor-pointer hover:bg-secondary/50 p-1.5 -mx-1.5 rounded-md transition-colors group' : ''}`}
        >
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                {icon}
                <span>{label}</span>
            </div>
            <div>
                {status.exists && !status.isBoilerplate ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${isComplete
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                        : 'bg-secondary text-muted-foreground border-border'
                        }`}>
                        {isComplete ? 'Done' : 'Pending'}
                    </span>
                ) : (
                    <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium border border-border">Pending</span>
                )}
            </div>
        </div>
    );
}
