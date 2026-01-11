import { Trash2 } from 'lucide-react';
import axios from 'axios';

interface DeleteSpecModalProps {
    specName: string;
    runtimeConfig: any;
    onClose: () => void;
    onSuccess: () => void;
}

export const DeleteSpecModal = ({ specName, runtimeConfig, onClose, onSuccess }: DeleteSpecModalProps) => {
    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-sm rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-red-500">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground">Delete Spec?</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Are you sure you want to delete <strong>{specName}</strong>? This action cannot be undone and will permanently delete the spec files.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">Cancel</button>
                        <button
                            onClick={async () => {
                                await axios.delete(`${runtimeConfig.api}/api/specs/${specName}`);
                                onSuccess();
                                onClose();
                            }}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                            Delete Spec
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
