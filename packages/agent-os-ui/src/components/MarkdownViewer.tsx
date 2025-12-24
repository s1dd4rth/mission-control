import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface MarkdownViewerProps {
    content: string
    className?: string
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
    return (
        <article className={`prose dark:prose-invert max-w-none 
            prose-headings:font-serif prose-headings:font-semibold 
            prose-a:text-stone-900 dark:prose-a:text-stone-100 
            prose-code:text-stone-900 dark:prose-code:text-stone-100 
            prose-pre:bg-stone-50 dark:prose-pre:bg-stone-900/50 
            prose-pre:border prose-pre:border-stone-200 dark:prose-pre:border-stone-800 
            prose-p:leading-relaxed prose-p:mb-4
            ${className || ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {content || ''}
            </ReactMarkdown>
        </article>
    )
}
