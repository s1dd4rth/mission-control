import React, { useState } from 'react';
import {
    Users,
    BarChart3,
    AlertTriangle,
    Mic,
    MessageSquare,
    Smile,
    Hand,
    Clock,
    MoreHorizontal,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock Data Types
interface SpiderData {
    speaking: number;
    chatting: number;
    reacting: number;
    interrupting: number;
}

interface Participant {
    id: string;
    name: string;
    avatarUrl: string;
    speakingTime: string;
    speakingPercentage: number;
    status: 'dominating' | 'active' | 'quiet';
    lastSpoken: string;
    spiderData: SpiderData;
}

interface Alert {
    id: string;
    type: 'dominance' | 'disengagement';
    severity: 'high' | 'medium' | 'low';
    message: string;
    suggestion: string;
}

const MOCK_DATA = {
    "sessionMetrics": {
        "equityScore": 72,
        "totalSpeakingTime": "00:45:20",
        "status": "imbalanced"
    },
    "participants": [
        {
            "id": "u1",
            "name": "Sarah Chen",
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            "speakingTime": "00:22:15",
            "speakingPercentage": 49,
            "status": "dominating",
            "lastSpoken": "2s ago",
            "spiderData": {
                "speaking": 90,
                "chatting": 20,
                "reacting": 30,
                "interrupting": 65
            }
        },
        {
            "id": "u2",
            "name": "David Kim",
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            "speakingTime": "00:15:30",
            "speakingPercentage": 34,
            "status": "active",
            "lastSpoken": "2m ago",
            "spiderData": {
                "speaking": 60,
                "chatting": 40,
                "reacting": 50,
                "interrupting": 10
            }
        },
        {
            "id": "u3",
            "name": "Maria Garcia",
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            "speakingTime": "00:05:00",
            "speakingPercentage": 11,
            "status": "quiet",
            "lastSpoken": "15m ago",
            "spiderData": {
                "speaking": 20,
                "chatting": 80,
                "reacting": 90,
                "interrupting": 0
            }
        },
        {
            "id": "u4",
            "name": "James Wilson",
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
            "speakingTime": "00:02:35",
            "speakingPercentage": 6,
            "status": "quiet",
            "lastSpoken": "22m ago",
            "spiderData": {
                "speaking": 10,
                "chatting": 10,
                "reacting": 20,
                "interrupting": 0
            }
        }
    ] as Participant[],
    "alerts": [
        {
            "id": "a1",
            "type": "dominance",
            "severity": "high",
            "message": "Sarah Chen has spoken for 49% of the session.",
            "suggestion": "Prompt specific input from James or Maria."
        },
        {
            "id": "a2",
            "type": "disengagement",
            "severity": "medium",
            "message": "James Wilson has been silent for >20 mins.",
            "suggestion": "Check in via chat or direct question."
        }
    ] as Alert[]
};

// SVG Radar Chart Component
const RadarChart = ({ data, color }: { data: SpiderData, color: string }) => {
    const size = 100;
    const center = size / 2;
    const scale = size / 2 - 5; // padding

    const metrics = ['speaking', 'chatting', 'reacting', 'interrupting'];
    const points = metrics.map((metric, i) => {
        const value = (data as any)[metric] / 100;
        const angle = (Math.PI / 2) + (2 * Math.PI * i) / metrics.length;
        const r = value * scale;
        const x = center + r * Math.cos(angle);
        const y = center - r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const gridPoints = [0.25, 0.5, 0.75, 1].map(level => {
        return metrics.map((_, i) => {
            const angle = (Math.PI / 2) + (2 * Math.PI * i) / metrics.length;
            const r = level * scale;
            const x = center + r * Math.cos(angle);
            const y = center - r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    });

    return (
        <svg width={size} height={size} className="overflow-visible">
            {/* Grid */}
            {gridPoints.map((points, i) => (
                <polygon key={i} points={points} fill="none" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" />
            ))}
            {/* Axis Lines */}
            {metrics.map((_, i) => {
                const angle = (Math.PI / 2) + (2 * Math.PI * i) / metrics.length;
                const x = center + scale * Math.cos(angle);
                const y = center - scale * Math.sin(angle);
                return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" />
            })}

            {/* Data Polygon */}
            <polygon points={points} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
        </svg>
    );
};

export default function EquityTracker() {
    const [selectedMetric, setSelectedMetric] = useState('speaking');

    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans p-6 overflow-hidden">

            <div className="grid grid-cols-12 gap-6 w-full max-w-7xl mx-auto h-full">

                {/* Left Column: Metrics & List */}
                <div className="col-span-8 flex flex-col gap-6 h-full">

                    {/* Header Stats */}
                    <div className="grid grid-cols-3 gap-4 shrink-0">
                        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-stone-500 uppercase font-semibold">Equity Score</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-3xl font-bold text-stone-900 dark:text-stone-100">{MOCK_DATA.sessionMetrics.equityScore}</span>
                                        <span className="text-xs text-amber-500 font-medium">Imbalanced</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                                    <Users size={20} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-stone-500 uppercase font-semibold">Total Airtime</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-3xl font-bold text-stone-900 dark:text-stone-100">45m</span>
                                        <span className="text-xs text-stone-400">20s</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-stone-500 uppercase font-semibold">Active Alerts</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-3xl font-bold text-red-600 dark:text-red-500">{MOCK_DATA.alerts.length}</span>
                                        <span className="text-xs text-stone-400">Intervention needed</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center">
                                    <AlertTriangle size={20} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Participants Table */}
                    <Card className="flex-1 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 flex flex-col min-h-0">
                        <CardHeader className="pb-3 border-b border-stone-100 dark:border-stone-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Session Participants</CardTitle>
                                    <CardDescription>Real-time analysis of contribution dynamics</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <BarChart3 size={14} /> View Trends
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <ScrollArea className="flex-1">
                            <div className="divide-y divide-stone-100 dark:divide-stone-800">
                                {MOCK_DATA.participants.map((participant) => (
                                    <div key={participant.id} className="p-4 flex items-center gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                        {/* Avatar & Info */}
                                        <div className="flex items-center gap-3 w-48 shrink-0">
                                            <Avatar className="h-10 w-10 border border-stone-200 dark:border-stone-700">
                                                <AvatarImage src={participant.avatarUrl} />
                                                <AvatarFallback>{participant.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm text-stone-900 dark:text-stone-100">{participant.name}</p>
                                                <p className="text-xs text-stone-500 flex items-center gap-1">
                                                    {participant.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                                    {participant.status === 'dominating' && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                                    {participant.status === 'quiet' && <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
                                                    {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Airtime Bar */}
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="text-stone-500">Speaking Time</span>
                                                <span className="font-mono font-medium">{participant.speakingTime} ({participant.speakingPercentage}%)</span>
                                            </div>
                                            <Progress
                                                value={participant.speakingPercentage}
                                                className="h-2"
                                                indicatorClassName={cn(
                                                    participant.status === 'dominating' ? "bg-red-500" :
                                                        participant.status === 'quiet' ? "bg-stone-300" :
                                                            "bg-indigo-500"
                                                )}
                                            />
                                        </div>

                                        {/* Mini Spider Chart */}
                                        <div className="w-16 h-16 shrink-0 flex items-center justify-center opacity-75">
                                            <RadarChart
                                                data={participant.spiderData}
                                                color={
                                                    participant.status === 'dominating' ? '#ef4444' :
                                                        participant.status === 'active' ? '#6366f1' : '#a8a29e'
                                                }
                                            />
                                        </div>

                                        {/* Interactive Metrics */}
                                        <div className="flex gap-2 shrink-0">
                                            <Badge variant="secondary" className="gap-1 font-normal text-stone-500">
                                                <MessageSquare size={12} /> {participant.spiderData.chatting}%
                                            </Badge>
                                            <Badge variant="secondary" className="gap-1 font-normal text-stone-500">
                                                <Smile size={12} /> {participant.spiderData.reacting}%
                                            </Badge>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

                {/* Right Column: Alerts & Suggestions */}
                <div className="col-span-4 flex flex-col gap-6 h-full">
                    <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 h-1/2 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-amber-700 dark:text-amber-500 flex items-center gap-2">
                                <AlertTriangle size={18} /> Engagement Alerts
                            </CardTitle>
                        </CardHeader>
                        <ScrollArea className="flex-1 px-6 pb-6">
                            <div className="space-y-3">
                                {MOCK_DATA.alerts.map((alert) => (
                                    <div key={alert.id} className="bg-white dark:bg-amber-950/40 p-3 rounded-lg border border-amber-100 dark:border-amber-900/50 shadow-sm">
                                        <div className="flex items-start justify-between mb-1">
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] uppercase border-0 font-bold px-1.5 py-0.5",
                                                alert.severity === 'high' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {alert.type}
                                            </Badge>
                                            <span className="text-[10px] text-stone-400">Just now</span>
                                        </div>
                                        <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-2 leading-snug">
                                            {alert.message}
                                        </p>
                                        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-xs text-amber-800 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                            Draft Prompt: "{alert.suggestion}"
                                        </div>
                                        <Button size="sm" className="w-full mt-2 bg-white text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-sm">
                                            Intervene
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>

                    <Card className="h-1/2 flex flex-col bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                        <CardHeader>
                            <CardTitle className="text-stone-700 dark:text-stone-300 flex items-center gap-2">
                                <TrendingUp size={18} /> Participation Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-stone-600 dark:text-stone-400 space-y-4">
                            <p>
                                To improve the Equity Score (72), consider:
                            </p>
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Asking James for his opinion on the backend architecture.</li>
                                <li>Using a "Round Robin" structure for the next topic.</li>
                                <li>Reminding the group about the "One voice at a time" norm.</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">
                                Apply "Round Robin" Mode
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
