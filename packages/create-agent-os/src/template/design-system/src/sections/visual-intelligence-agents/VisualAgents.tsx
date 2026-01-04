import React, { useState } from 'react';
import {
    Bot,
    Sparkles,
    Layers,
    List,
    Check,
    X,
    MoreHorizontal,
    MousePointer2,
    Brain,
    Zap,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock Data Types
interface Position {
    x: number;
    y: number;
}

interface Agent {
    id: string;
    name: string;
    status: string;
    currentAction: string;
    position: Position;
    color: string;
}

interface QueueItem {
    id: string;
    type: string;
    content: string;
    confidence: number;
    generatedBy: string;
}

interface Cluster {
    id: string;
    label: string;
    itemIds: string[];
    bounds: { x: number, y: number, width: number, height: number };
    color: string;
}

interface ActivityLog {
    id: string;
    timestamp: string;
    agentId: string;
    message: string;
}

const MOCK_DATA = {
    "agents": [
        {
            "id": "ag_1",
            "name": "Scribe Bot",
            "status": "listening",
            "currentAction": "Transcribing insights...",
            "position": { "x": 120, "y": 280 },
            "color": "indigo"
        },
        {
            "id": "ag_2",
            "name": "Cluster Bot",
            "status": "working",
            "currentAction": "grouping_notes",
            "position": { "x": 450, "y": 180 },
            "color": "emerald"
        }
    ] as Agent[],
    "generationQueue": [
        {
            "id": "q_1",
            "type": "sticky",
            "content": "Risk: Legacy database migration timeline",
            "confidence": 0.95,
            "generatedBy": "ag_1"
        },
        {
            "id": "q_2",
            "type": "sticky",
            "content": "Opportunity: Use GraphQL for new frontend",
            "confidence": 0.88,
            "generatedBy": "ag_1"
        }
    ] as QueueItem[],
    "clusters": [
        {
            "id": "c_1",
            "label": "Backend Architecture",
            "itemIds": ["n_10", "n_11", "n_12"],
            "bounds": { "x": 380, "y": 120, "width": 320, "height": 240 },
            "color": "blue"
        }
    ] as Cluster[],
    "activityLogs": [
        {
            "id": "l_1",
            "timestamp": "2023-11-20T14:35:10Z",
            "agentId": "ag_1",
            "message": "Captured 2 new insights regarding 'Middleware'."
        },
        {
            "id": "l_2",
            "timestamp": "2023-11-20T14:35:15Z",
            "agentId": "ag_2",
            "message": "Detected theme 'API Security' (Similarity: 92%)."
        },
        {
            "id": "l_3",
            "timestamp": "2023-11-20T14:35:20Z",
            "agentId": "ag_2",
            "message": "Auto-grouped 3 items under 'Backend Architecture'."
        }
    ] as ActivityLog[]
};

const AgentCursor = ({ agent }: { agent: Agent }) => {
    const colorMap = {
        indigo: "text-indigo-600 fill-indigo-600 bg-indigo-100 border-indigo-200",
        emerald: "text-emerald-600 fill-emerald-600 bg-emerald-100 border-emerald-200",
        blue: "text-blue-600 fill-blue-600 bg-blue-100 border-blue-200",
    };

    const style = (colorMap as any)[agent.color] || colorMap.blue;

    return (
        <div
            className="absolute flex flex-col items-start gap-1 transition-all duration-1000 ease-in-out z-20"
            style={{ left: agent.position.x, top: agent.position.y }}
        >
            <MousePointer2 className={cn("h-5 w-5 -rotate-12", style.split(" ")[0], style.split(" ")[1])} />
            <div className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm border whitespace-nowrap flex items-center gap-1", style.split(" ").slice(2).join(" "))}>
                {agent.name}
                {agent.status === 'working' && <span className="animate-spin text-xs">⚙️</span>}
            </div>
        </div>
    );
};

export default function VisualAgents() {
    const [queue, setQueue] = useState(MOCK_DATA.generationQueue);

    const handleApprove = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans overflow-hidden">

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden bg-stone-100 dark:bg-stone-900/50">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.2]"
                    style={{ backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                {/* Mock Existing Notes (Background) */}
                <div className="absolute top-40 left-32 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/20 shadow-sm border border-yellow-200 dark:border-yellow-800 p-2 rotate-1 text-[10px] text-stone-600 dark:text-stone-400 font-handwriting">
                    Need to clarify the user roles before starting the sprint.
                </div>
                <div className="absolute top-80 left-96 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/20 shadow-sm border border-yellow-200 dark:border-yellow-800 p-2 -rotate-2 text-[10px] text-stone-600 dark:text-stone-400 font-handwriting">
                    Auth service needs an update.
                </div>

                {/* Clusters */}
                {MOCK_DATA.clusters.map(cluster => (
                    <div
                        key={cluster.id}
                        className="absolute border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-3xl bg-blue-50/30 dark:bg-blue-900/10 flex flex-col items-center justify-start pt-2"
                        style={{
                            left: cluster.bounds.x,
                            top: cluster.bounds.y,
                            width: cluster.bounds.width,
                            height: cluster.bounds.height
                        }}
                    >
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                            {cluster.label}
                        </span>
                        {/* Mock Items inside cluster */}
                        <div className="grid grid-cols-2 gap-4 w-full px-4">
                            <div className="w-full bg-white dark:bg-stone-800 shadow-sm p-2 text-[8px] h-16 border border-stone-200 dark:border-stone-700">Microservices</div>
                            <div className="w-full bg-white dark:bg-stone-800 shadow-sm p-2 text-[8px] h-16 border border-stone-200 dark:border-stone-700">API Gateway</div>
                            <div className="w-full bg-white dark:bg-stone-800 shadow-sm p-2 text-[8px] h-16 border border-stone-200 dark:border-stone-700">Database Sharding</div>
                        </div>
                    </div>
                ))}

                {/* Agents */}
                {MOCK_DATA.agents.map(agent => (
                    <AgentCursor key={agent.id} agent={agent} />
                ))}

                {/* Floating Generation Queue */}
                <div className="absolute top-6 right-6 w-80 z-30 flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1 pl-1">
                        <Sparkles size={16} className="text-indigo-500 fill-indigo-100" />
                        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 shadow-sm bg-white/50 dark:bg-stone-900/50 backdrop-blur px-2 py-0.5 rounded">Insight Generation Queue</h3>
                    </div>

                    {queue.map(item => (
                        <div key={item.id} className="bg-white dark:bg-stone-900 border border-indigo-100 dark:border-indigo-900/30 shadow-lg rounded-lg overflow-hidden animate-in slide-in-from-right-10 fade-in duration-500">
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="text-[10px] font-normal border-indigo-200 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20">
                                        {item.type}
                                    </Badge>
                                    <span className="text-[10px] text-stone-400">{Math.round(item.confidence * 100)}% conf</span>
                                </div>
                                <p className="text-sm text-stone-800 dark:text-stone-200 font-medium leading-snug">
                                    "{item.content}"
                                </p>
                            </div>
                            <div className="flex border-t border-indigo-50 dark:border-indigo-900/20">
                                <button className="flex-1 py-2 text-xs font-medium text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors" onClick={() => handleApprove(item.id)}>
                                    <X size={14} className="inline mr-1" /> Dismiss
                                </button>
                                <div className="w-px bg-indigo-50 dark:bg-indigo-900/20" />
                                <button
                                    className="flex-1 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                    onClick={() => handleApprove(item.id)}
                                >
                                    <Check size={14} className="inline mr-1" /> Add to Canvas
                                </button>
                            </div>
                        </div>
                    ))}
                    {queue.length === 0 && (
                        <div className="bg-white/50 dark:bg-stone-800/50 backdrop-blur border border-stone-200 dark:border-stone-700 rounded-lg p-4 text-center text-xs text-stone-500">
                            Waiting for new insights...
                        </div>
                    )}
                </div>

            </div>

            {/* Right Sidebar: Agent Activity */}
            <aside className="w-72 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 flex flex-col z-10 shadow-xl">
                <div className="p-4 border-b border-stone-100 dark:border-stone-800">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Bot size={18} className="text-indigo-600" />
                        Active Agents
                    </h2>
                </div>

                <div className="p-4 space-y-4">
                    {MOCK_DATA.agents.map(agent => (
                        <div key={agent.id} className="flex items-start gap-3">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                agent.color === 'indigo' ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                                <Bot size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-sm font-medium">{agent.name}</span>
                                    <span className="text-[10px] uppercase text-stone-400 font-bold">{agent.status}</span>
                                </div>
                                <p className="text-xs text-stone-500 truncate">{agent.currentAction}</p>
                                <div className="mt-2 h-1 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div className={cn("h-full w-2/3 animate-pulse",
                                        agent.color === 'indigo' ? "bg-indigo-500" : "bg-emerald-500"
                                    )} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-4 bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-800">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Activity Log</h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="divide-y divide-stone-100 dark:divide-stone-800">
                            {MOCK_DATA.activityLogs.map(log => (
                                <div key={log.id} className="p-4 text-xs">
                                    <div className="flex items-center gap-2 mb-1 text-stone-400">
                                        <Clock size={10} />
                                        <span className="font-mono">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                            {MOCK_DATA.agents.find(a => a.id === log.agentId)?.name || 'Agent'}:
                                        </span>{' '}
                                        {log.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

            </aside>
        </div>
    );
}
