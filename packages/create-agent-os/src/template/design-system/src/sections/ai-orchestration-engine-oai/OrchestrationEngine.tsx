import React, { useState, useEffect } from 'react';
import {
    Activity,
    BrainCircuit,
    MessageSquare,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Play,
    Pause,
    RefreshCw,
    ChevronRight,
    Terminal,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock Data Types
interface Node {
    id: string;
    label: string;
    type: 'input' | 'process' | 'decision' | 'output';
    x: number;
    y: number;
    status: 'pending' | 'active' | 'processed';
}

interface Edge {
    source: string;
    target: string;
    label?: string;
}

interface Log {
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'success';
    message: string;
}

interface Intervention {
    type: string;
    content: string;
    confidence: number;
    rationale: string;
}

const MOCK_DATA = {
    "graph": {
        "nodes": [
            { "id": "observe", "label": "Observe", "type": "input", "x": 100, "y": 200, "status": "active" },
            { "id": "analyze", "label": "Analyze Bias", "type": "process", "x": 300, "y": 120, "status": "processed" },
            { "id": "detect_groan", "label": "Detect Groan Zone", "type": "process", "x": 300, "y": 280, "status": "processed" },
            { "id": "assessment", "label": "Assess Intervention", "type": "decision", "x": 550, "y": 200, "status": "active" },
            { "id": "formulate", "label": "Formulate Prompt", "type": "process", "x": 800, "y": 200, "status": "pending" },
            { "id": "act", "label": "Intervene", "type": "output", "x": 1000, "y": 200, "status": "pending" }
        ] as Node[],
        "edges": [
            { "source": "observe", "target": "analyze" },
            { "source": "observe", "target": "detect_groan" },
            { "source": "analyze", "target": "assessment" },
            { "source": "detect_groan", "target": "assessment" },
            { "source": "assessment", "target": "formulate", "label": "threshold_met" },
            { "source": "formulate", "target": "act" }
        ] as Edge[]
    },
    "logs": [
        {
            "id": "log_1",
            "timestamp": "2023-11-20T14:15:22Z",
            "level": "info",
            "message": "Ingesting audio stream: 15s silence detected from 'Remote Participants'."
        },
        {
            "id": "log_2",
            "timestamp": "2023-11-20T14:15:25Z",
            "level": "warning",
            "message": "Groan Zone Detector: Probability 85%. Circular argumentation detected in semantic analysis."
        },
        {
            "id": "log_3",
            "timestamp": "2023-11-20T14:15:28Z",
            "level": "success",
            "message": "Transitioning to Assessment State. Checking intervention cooldown (last active: 5m ago)."
        },
        {
            "id": "log_4",
            "timestamp": "2023-11-20T14:15:29Z",
            "level": "info",
            "message": "Evaluation: Bias metrics within acceptable range. Groan Zone impact: High."
        }
    ] as Log[],
    "currentIntervention": {
        "type": "text",
        "content": "I notice we've been circling the same point about 'timeline risks'. Would it help to map these risks on the canvas to visually distinguish them?",
        "confidence": 0.92,
        "rationale": "High repetition of 'risk' keywords; low participation from 2 members."
    } as Intervention
};

const GraphNode = ({ node }: { node: Node }) => {
    const getNodeColor = (type: string, status: string) => {
        if (status === 'active') return 'stroke-indigo-500 fill-indigo-50 dark:fill-indigo-950/50 dark:stroke-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]';
        if (status === 'processed') return 'stroke-emerald-500 fill-emerald-50 dark:fill-emerald-950/50 dark:stroke-emerald-400';
        return 'stroke-stone-300 fill-white dark:fill-stone-900 dark:stroke-stone-700';
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'input': return <BrainCircuit size={16} />;
            case 'decision': return <Activity size={16} />;
            case 'output': return <MessageSquare size={16} />;
            default: return <RefreshCw size={16} />;
        }
    };

    return (
        <g className="transition-all duration-500 select-none group cursor-pointer hover:scale-105">
            {/* Node Shape */}
            <rect
                x={node.x - 70}
                y={node.y - 30}
                width={140}
                height={60}
                rx={12}
                className={cn(
                    "stroke-2 transition-all duration-300",
                    getNodeColor(node.type, node.status)
                )}
            />

            {/* Active Pulse Animation */}
            {node.status === 'active' && (
                <rect
                    x={node.x - 70}
                    y={node.y - 30}
                    width={140}
                    height={60}
                    rx={12}
                    className="stroke-indigo-500 stroke-2 fill-none animate-ping opacity-20"
                />
            )}

            {/* Content */}
            <foreignObject x={node.x - 60} y={node.y - 20} width={120} height={40}>
                <div className="flex items-center gap-2 h-full justify-center text-xs font-medium text-stone-700 dark:text-stone-200">
                    {getIcon(node.type)}
                    <span className="truncate">{node.label}</span>
                </div>
            </foreignObject>
        </g>
    );
};

const GraphEdge = ({ edge, nodes }: { edge: Edge, nodes: Node[] }) => {
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);

    if (!source || !target) return null;

    // Simple Cubic Bezier
    const midX = (source.x + target.x) / 2;
    const path = `M ${source.x + 70} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x - 70} ${target.y}`;

    const isActive = source.status === 'processed' || (source.status === 'active' && target.status === 'active');

    return (
        <g>
            <path
                d={path}
                fill="none"
                className={cn(
                    "stroke-2 transition-all duration-500",
                    isActive ? "stroke-emerald-400 dark:stroke-emerald-500" : "stroke-stone-200 dark:stroke-stone-800"
                )}
            />
            {edge.label && (
                <foreignObject x={(source.x + target.x) / 2 - 40} y={(source.y + target.y) / 2 - 10} width={80} height={20}>
                    <div className="bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-500 px-1 rounded text-center border border-stone-200 dark:border-stone-700">
                        {edge.label}
                    </div>
                </foreignObject>
            )}
        </g>
    );
};

export default function OrchestrationEngine() {
    const [activeTab, setActiveTab] = useState('logs');

    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans overflow-hidden">

            {/* Main Graph Visualization Area */}
            <div className="flex-1 relative flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <BrainCircuit size={20} />
                        </div>
                        <div>
                            <h1 className="font-semibold text-stone-900 dark:text-stone-100">Orchestration Engine</h1>
                            <p className="text-xs text-stone-500">OAI Framework • v2.4.1</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            <Play size={10} className="fill-current" /> Running
                        </Badge>
                        <div className="text-xs text-stone-400 font-mono">Latency: 24ms</div>
                    </div>
                </header>

                {/* Graph SVG Canvas */}
                <div className="flex-1 bg-stone-50 dark:bg-stone-950 relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-[0.2]"
                        style={{ backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                    />

                    <svg className="w-full h-full">
                        {/* Edges */}
                        {MOCK_DATA.graph.edges.map((edge, i) => (
                            <GraphEdge key={i} edge={edge} nodes={MOCK_DATA.graph.nodes} />
                        ))}
                        {/* Nodes */}
                        {MOCK_DATA.graph.nodes.map(node => (
                            <GraphNode key={node.id} node={node} />
                        ))}
                    </svg>

                    {/* Floating Overlay Stats */}
                    <div className="absolute bottom-6 left-6 grid gap-4">
                        <Card className="w-64 bg-white/90 dark:bg-stone-900/90 backdrop-blur shadow-sm">
                            <CardHeader className="py-3">
                                <CardTitle className="text-xs uppercase tracking-wider text-stone-500">Active State</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 pb-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="text-indigo-500 animate-pulse" size={18} />
                                    <span className="font-medium">Assess Intervention</span>
                                </div>
                                <div className="mt-2 text-xs text-stone-400">
                                    Processing probabilities from Groan Zone classifier...
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Logs & Intervention */}
            <aside className="w-96 border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col shadow-xl z-10">

                {/* Intervention Preview Card (Top Priority) */}
                <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Zap size={16} className="text-amber-500" />
                            Proposed Intervention
                        </h3>
                        <Badge className={cn(
                            "font-mono text-[10px]",
                            MOCK_DATA.currentIntervention.confidence > 0.9 ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500"
                        )}>
                            {Math.round(MOCK_DATA.currentIntervention.confidence * 100)}% CONFIDENCE
                        </Badge>
                    </div>

                    <Card className="border-indigo-100 dark:border-indigo-900/30 shadow-sm overflow-hidden">
                        <div className="h-1 bg-indigo-500 w-full" />
                        <CardContent className="p-3">
                            <p className="text-sm font-medium leading-relaxed italic text-stone-700 dark:text-stone-300">
                                "{MOCK_DATA.currentIntervention.content}"
                            </p>
                        </CardContent>
                        <CardFooter className="p-2 bg-stone-50 dark:bg-stone-800/50 text-xs text-stone-500 border-t border-stone-100 dark:border-stone-800">
                            Rationale: {MOCK_DATA.currentIntervention.rationale}
                        </CardFooter>
                    </Card>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900">
                            <XCircle size={14} className="mr-2" /> Reject
                        </Button>
                        <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                            <CheckCircle2 size={14} className="mr-2" /> Approve
                        </Button>
                    </div>
                </div>

                {/* Logs Feed */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900 sticky top-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">System Logs</span>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Terminal size={12} /></Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {MOCK_DATA.logs.map((log) => (
                                <div key={log.id} className="flex gap-3 text-sm group">
                                    <div className="shrink-0 pt-0.5">
                                        {log.level === 'info' && <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />}
                                        {log.level === 'warning' && <AlertTriangle size={14} className="text-amber-500 mt-0.5" />}
                                        {log.level === 'success' && <CheckCircle2 size={14} className="text-emerald-500 mt-0.5" />}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] text-stone-400">
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                            <span className={cn(
                                                "text-[10px] font-semibold uppercase px-1 rounded",
                                                log.level === 'warning' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                                    log.level === 'success' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                        "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                                            )}>{log.level}</span>
                                        </div>
                                        <p className="text-stone-600 dark:text-stone-400 leading-snug group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                                            {log.message}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Live typing indicator */}
                            <div className="flex gap-3 pt-2 opacity-50">
                                <div className="w-2 h-2 rounded-full bg-stone-300 animate-pulse mt-1.5 ml-0.5" />
                                <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                            </div>
                        </div>
                    </ScrollArea>
                </div>

            </aside>
        </div>
    );
}
