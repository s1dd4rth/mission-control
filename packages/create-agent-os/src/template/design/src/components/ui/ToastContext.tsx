import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    title: string;
    description?: string;
    type?: ToastType;
}

interface ToastContextType {
    toast: (props: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(({ title, description, type = 'info' }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type }]);

        // Auto dismiss
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              min-w-[300px] border rounded-lg shadow-lg p-4 transition-all duration-300 animate-in slide-in-from-right
              bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800
            `}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 pt-0.5">
                                {t.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
                                {t.type === 'error' && <AlertTriangle size={18} className="text-red-500" />}
                                {t.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
                                {t.type === 'info' && <Info size={18} className="text-blue-500" />}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{t.title}</h4>
                                {t.description && (
                                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="shrink-0 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
