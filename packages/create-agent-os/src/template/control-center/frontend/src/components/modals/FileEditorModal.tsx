import { FileText, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useState, useEffect } from 'react';

interface FileEditorModalProps {
    viewingFile: { path: string, title: string };
    content: string | null;
    onClose: () => void;
    onSave: (content: string) => Promise<void>;
}

export const FileEditorModal = ({ viewingFile, content, onClose, onSave }: FileEditorModalProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        if (content) setEditContent(content);
    }, [content]);

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-md">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{viewingFile.title}</h3>
                            <code className="text-xs text-muted-foreground font-mono">{viewingFile.path}</code>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-1.5 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                            >
                                Edit
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1.5 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        await onSave(editContent);
                                        setIsEditing(false);
                                    }}
                                    className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                                >
                                    Save Changes
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors ml-2">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-background">
                    {content === "Loading..." || content === "Error loading file." ? (
                        <div className="font-mono text-sm">{content}</div>
                    ) : isEditing ? (
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-secondary text-secondary-foreground border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    ) : (
                        <article className="prose dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-primary prose-code:text-primary prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border prose-p:leading-relaxed prose-p:mb-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                {content || ''}
                            </ReactMarkdown>
                        </article>
                    )}
                </div>
            </div>
        </div>
    );
};
