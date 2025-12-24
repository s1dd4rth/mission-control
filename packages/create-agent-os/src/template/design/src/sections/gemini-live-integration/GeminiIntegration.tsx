import React, { useState, useEffect, useRef } from 'react';
import {
    Mic,
    MicOff,
    Settings,
    Activity,
    Wifi,
    Volume2,
    VolumeX,
    User,
    Bot,
    MoreHorizontal,
    Sparkles,
    Zap,
    Radio
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock Data Types
interface Persona {
    id: string;
    name: string;
    description: string;
    voiceId: string;
    active: boolean;
}

interface TranscriptItem {
    id: string;
    sender: 'user' | 'ai';
    name: string;
    text: string;
    timestamp: string;
    interventionType?: string;
}

const MOCK_DATA = {
    "connection": {
        "status": "listening",
        "latencyMs": 145,
        "uptime": "00:12:45",
        "region": "us-central1"
    },
    "personas": [
        {
            "id": "p_coach",
            "name": "Empathetic Coach",
            "description": "Warm, encouraging, focuses on psychological safety.",
            "voiceId": "en-US-Standard-C",
            "active": true
        },
        {
            "id": "p_keeper",
            "name": "Strict Timekeeper",
            "description": "Concise, focused on agenda and pacing.",
            "voiceId": "en-US-Standard-D",
            "active": false
        },
        {
            "id": "p_devil",
            "name": "Devil's Advocate",
            "description": "Challenger, encourages critical thinking.",
            "voiceId": "en-US-Standard-E",
            "active": false
        }
    ] as Persona[],
    "transcript": [
        {
            "id": "msg_1",
            "sender": "user",
            "name": "David Kim",
            "text": "I'm just not sure we have the budget for Q3 marketing if we do the re-brand.",
            "timestamp": "2023-11-20T14:20:10Z"
        },
        {
            "id": "msg_2",
            "sender": "user",
            "name": "Maria Garcia",
            "text": "But we can't delay the re-brand again. Clients are confused.",
            "timestamp": "2023-11-20T14:20:15Z"
        },
        {
            "id": "msg_3",
            "sender": "ai",
            "name": "Agent OS",
            "text": "I'm sensing a trade-off here between budget constraints and brand clarity. Would it help to list the risks of delaying the re-brand vs. the risks of a slim marketing budget?",
            "timestamp": "2023-11-20T14:20:25Z",
            "interventionType": "reframing"
        }
    ] as TranscriptItem[],
};

const AudioVisualizer = ({ isActive }: { isActive: boolean }) => {
    return (
        <div className="flex items-center justify-center gap-1 h-32 w-full">
            {[...Array(24)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-2 rounded-full transition-all duration-75",
                        isActive ? "bg-indigo-500" : "bg-stone-300 dark:bg-stone-800"
                    )}
                    style={{
                        height: isActive ? `${Math.max(20, Math.random() * 100)}%` : '10%',
                        opacity: isActive ? 1 : 0.5,
                        animation: isActive ? `pulse 0.5s infinite ${i * 0.05}s` : 'none'
                    }}
                />
            ))}
        </div>
    );
};

export default function GeminiIntegration() {
    const [isMicOn, setIsMicOn] = useState(true);
    const [activePersona, setActivePersona] = useState("p_coach");
    const [transcript, setTranscript] = useState(MOCK_DATA.transcript);

    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans overflow-hidden">

            {/* Sidebar / Configuration */}
            <aside className="w-80 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col z-20 shadow-md">
                <div className="p-6 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-indigo-600 text-white rounded-lg">
                            <Sparkles size={20} className="fill-current" />
                        </div>
                        <div>
                            <h1 className="font-bold text-stone-900 dark:text-stone-100 leading-tight">Gemini Live</h1>
                            <p className="text-xs text-stone-500">Multimodal Facilitator</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* Connection Status */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Connection Status</label>
                        <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="text-sm font-medium text-stone-700 dark:text-stone-200 uppercase">Live</span>
                            </div>
                            <Badge variant="outline" className="font-mono text-[10px] text-stone-400">
                                {MOCK_DATA.connection.latencyMs}ms
                            </Badge>
                        </div>
                    </div>

                    {/* Persona Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Facilitator Persona</label>
                        <Select value={activePersona} onValueChange={setActivePersona}>
                            <SelectTrigger className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_DATA.personas.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <span className="font-medium">{p.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-stone-500 leading-snug">
                            {MOCK_DATA.personas.find(p => p.id === activePersona)?.description}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Audio Controls</label>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-stone-700 dark:text-stone-300">Input (Mic)</span>
                            <Switch checked={isMicOn} onCheckedChange={setIsMicOn} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-stone-700 dark:text-stone-300">Output (Speaker)</span>
                            <Switch defaultChecked />
                        </div>
                        <div className="pt-4">
                            <div className="h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[45%]" />
                            </div>
                            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                                <span>Input Gain</span>
                                <span>45%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-400 flex items-center justify-center gap-2">
                    <Zap size={12} /> Powered by Gemini 1.5 Pro
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-stone-50 dark:bg-stone-950">

                {/* Header */}
                <header className="h-16 px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-white dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-800 gap-1.5 shadow-sm">
                            <Radio size={12} className="text-stone-400" />
                            Full Duplex Audio
                        </Badge>
                        <div className="h-4 w-px bg-stone-300 dark:bg-stone-700" />
                        <span className="text-sm text-stone-500">Session ID: <span className="font-mono text-stone-700 dark:text-stone-300">#GEM-8821</span></span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-stone-400 hover:text-stone-700">
                        <Settings size={20} />
                    </Button>
                </header>

                {/* Visualization Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-stone-950 opacity-50 z-0" />
                    <div className="absolute w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

                    {/* Visualizer */}
                    <div className="relative z-10 w-full max-w-2xl px-8">
                        <div className="text-center mb-8">
                            <h2 className={cn(
                                "text-2xl font-semibold transition-all duration-300",
                                isMicOn ? "text-stone-800 dark:text-stone-100" : "text-stone-400"
                            )}>
                                {isMicOn ? "Adjusting to conversation flow..." : "Microphone Muted"}
                            </h2>
                        </div>

                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                            <CardContent className="p-8">
                                <AudioVisualizer isActive={isMicOn} />
                            </CardContent>
                        </Card>

                        <div className="flex justify-center mt-8 gap-4">
                            <Button
                                size="lg"
                                variant={isMicOn ? "default" : "destructive"}
                                className={cn(
                                    "rounded-full w-16 h-16 shadow-lg transition-all duration-200 hover:scale-105",
                                    isMicOn ? "bg-indigo-600 hover:bg-indigo-700" : ""
                                )}
                                onClick={() => setIsMicOn(!isMicOn)}
                            >
                                {isMicOn ? <Mic size={28} /> : <MicOff size={28} />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Transcript Panel */}
                <div className="h-1/3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                    <div className="px-6 py-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                            <Activity size={14} /> Live Transcript
                        </h3>
                        <Badge variant="secondary" className="text-[10px]">Real-time</Badge>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {transcript.map((item) => (
                                <div key={item.id} className={cn("flex gap-4", item.sender === 'ai' ? "flex-row-reverse" : "")}>
                                    <Avatar className="w-8 h-8 mt-1 border border-stone-100 dark:border-stone-700 shadow-sm">
                                        {item.sender === 'ai' ? (
                                            <AvatarImage src="" className="bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5" />
                                        ) : (
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} />
                                        )}
                                        <AvatarFallback className={item.sender === 'ai' ? "bg-indigo-600 text-white" : "bg-stone-200 text-stone-600"}>
                                            {item.sender === 'ai' ? <Sparkles size={14} /> : item.name[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className={cn("flex flex-col max-w-[80%]", item.sender === 'ai' ? "items-end" : "items-start")}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">{item.name}</span>
                                            <span className="text-[10px] text-stone-400 font-mono">
                                                {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                            item.sender === 'ai'
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : "bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-tl-none"
                                        )}>
                                            {item.text}
                                        </div>
                                        {item.interventionType && (
                                            <Badge variant="outline" className="mt-1 text-[10px] border-indigo-200 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800">
                                                {item.interventionType}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            <div className="flex gap-4 opacity-50">
                                <Avatar className="w-8 h-8 mt-1 border border-stone-100 shadow-sm opacity-0">
                                    <AvatarFallback>DK</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-1 h-8 px-2">
                                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </main>
        </div>
    );
}
