import React, { useState } from 'react';
import {
    History,
    Search,
    Filter,
    Play,
    Pause,
    FileText,
    Tag,
    Calendar,
    ChevronRight,
    GitCommit,
    Quote,
    Database,
    ShieldAlert,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// Mock Data Types
interface ContextSnippet {
    id: string;
    type: string;
    start?: string;
    duration?: string;
    speaker?: string;
    transcript: string;
}

interface Decision {
    id: string;
    title: string;
    summary: string;
    outcome: string;
    createdAt: string;
    tags: string[];
    contextSnippets: ContextSnippet[];
    impact: 'high' | 'medium' | 'low' | 'critical';
}

const MOCK_DATA = {
    "decisions": [
        {
            "id": "d_1",
            "title": "Adopt PostgreSQL for primary data store",
            "summary": "We chose Postgres over MongoDB due to strict relational data requirements and better ACID compliance for financial transactions.",
            "outcome": "approved",
            "createdAt": "2023-11-15T10:00:00Z",
            "tags": ["Architecture", "Database", "Backend"],
            "contextSnippets": [
                {
                    "id": "ctx_1",
                    "type": "audio",
                    "start": "14:20",
                    "duration": "45s",
                    "speaker": "Sarah Chen",
                    "transcript": "Look, if we lose a single transaction record, we're liable. Mongo's flexibility is nice, but we need rigid schemas here."
                }
            ],
            "impact": "high"
        },
        {
            "id": "d_2",
            "title": "Delay Q4 Launch by 2 weeks",
            "summary": "To address critical security vulnerabilities found in the penetration test.",
            "outcome": "approved",
            "createdAt": "2023-10-01T15:30:00Z",
            "tags": ["Schedule", "Security", "Risk"],
            "contextSnippets": [
                {
                    "id": "ctx_2",
                    "type": "transcript",
                    "speaker": "David Kim",
                    "transcript": "I'd rather be late than hacked. It's a non-negotiable for me."
                }
            ],
            "impact": "critical"
        },
        {
            "id": "d_3",
            "title": "Use 'Inter' font family",
            "summary": "Standardizing on a Google Font for better load times and legibility.",
            "outcome": "consensus",
            "createdAt": "2023-09-20T09:12:00Z",
            "tags": ["Design", "UI", "Performance"],
            "contextSnippets": [],
            "impact": "low"
        }
    ] as Decision[],
    "tags": [
        "Architecture", "Database", "Backend", "Schedule", "Security", "Risk", "Design", "UI", "Performance"
    ]
};

const ImpactBadge = ({ impact }: { impact: Decision['impact'] }) => {
    const styles = {
        critical: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        high: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
        medium: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        low: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700",
    };

    return (
        <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border", styles[impact])}>
            {impact} Impact
        </span>
    );
};

export default function PersistentMemory() {
    const [selectedDecision, setSelectedDecision] = useState<Decision | null>(MOCK_DATA.decisions[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans overflow-hidden">

            {/* Sidebar: Filters & Graph Nav */}
            <aside className="w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col p-4 z-20">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <Database size={20} className="text-indigo-600" />
                        Memory Bank
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">Organizational Wisdom Graph</p>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                    <Input placeholder="Search decisions..." className="pl-9 bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700" />
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <h3 className="text-xs font-semibold uppercase text-stone-400 mb-2">Filters</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {MOCK_DATA.tags.slice(0, 6).map(tag => (
                                <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                        <h3 className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                            <History size={12} /> Insight of the Day
                        </h3>
                        <p className="text-xs text-indigo-900 dark:text-indigo-300 italic">
                            "Most security delays happened in Q4. Consider shifting penetration tests to Q3."
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content: Split View */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Decision Timeline */}
                <div className="w-1/3 border-r border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 flex flex-col">
                    <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                        <h3 className="font-semibold text-sm">Decision Timeline</h3>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-3 space-y-6">
                            {MOCK_DATA.decisions.map(decision => (
                                <div
                                    key={decision.id}
                                    className={cn(
                                        "relative pl-6 cursor-pointer group transition-all",
                                        selectedDecision?.id === decision.id ? "opacity-100 scale-100" : "opacity-70 hover:opacity-100"
                                    )}
                                    onClick={() => setSelectedDecision(decision)}
                                >
                                    <div className={cn(
                                        "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 transition-colors",
                                        selectedDecision?.id === decision.id
                                            ? "bg-white border-indigo-600 dark:bg-stone-900 dark:border-indigo-500"
                                            : "bg-stone-200 border-white dark:bg-stone-700 dark:border-stone-900 group-hover:bg-indigo-200"
                                    )} />

                                    <div className={cn(
                                        "p-3 rounded-lg border shadow-sm transition-all",
                                        selectedDecision?.id === decision.id
                                            ? "bg-white dark:bg-stone-900 border-indigo-200 dark:border-indigo-800 shadow-md ring-1 ring-indigo-50 dark:ring-indigo-900/20"
                                            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                                    )}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] text-stone-500 font-mono">
                                                {new Date(decision.createdAt).toLocaleDateString()}
                                            </span>
                                            <ImpactBadge impact={decision.impact} />
                                        </div>
                                        <h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm leading-tight mb-2">
                                            {decision.title}
                                        </h4>
                                        <div className="flex gap-1 flex-wrap">
                                            {decision.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] text-stone-500 bg-stone-50 dark:bg-stone-800 px-1 py-0.5 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right: Detail View ("The Why") */}
                <div className="flex-1 bg-stone-50 dark:bg-stone-950 flex flex-col h-full overflow-hidden">
                    {selectedDecision ? (
                        <div className="flex-1 overflow-y-auto">
                            {/* Header */}
                            <div className="p-8 pb-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <GitCommit size={20} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">{selectedDecision.title}</h1>
                                        <p className="text-stone-500 text-sm flex items-center gap-2">
                                            Status: <span className="text-emerald-600 font-medium capitalize">{selectedDecision.outcome}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {selectedDecision.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <Card className="mb-6">
                                    <CardHeader className="bg-stone-50/50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-800 py-3">
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                            <FileText size={16} /> The Rationale
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                                            {selectedDecision.summary}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Context / Media Player */}
                                {selectedDecision.contextSnippets.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Historical Context</h3>
                                        {selectedDecision.contextSnippets.map(snippet => (
                                            <Card key={snippet.id} className="overflow-hidden border-indigo-100 dark:border-indigo-900/50">
                                                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-3 flex items-center gap-3 border-b border-indigo-100 dark:border-indigo-900/20">
                                                    <Button
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shrink-0"
                                                        onClick={() => setIsPlaying(!isPlaying)}
                                                    >
                                                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                                                    </Button>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center text-xs mb-1">
                                                            <span className="font-semibold text-indigo-900 dark:text-indigo-300">
                                                                {snippet.speaker}
                                                            </span>
                                                            <span className="font-mono text-stone-400">
                                                                {snippet.start} ({snippet.duration})
                                                            </span>
                                                        </div>
                                                        <Progress value={isPlaying ? 45 : 0} className="h-1 bg-indigo-200 dark:bg-indigo-900/50" />
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-white dark:bg-stone-900">
                                                    <div className="flex gap-3">
                                                        <Quote size={16} className="text-stone-300 shrink-0 mt-1" />
                                                        <p className="text-stone-600 dark:text-stone-400 italic text-sm">
                                                            "{snippet.transcript}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-stone-400">
                            Select a decision to view details
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
