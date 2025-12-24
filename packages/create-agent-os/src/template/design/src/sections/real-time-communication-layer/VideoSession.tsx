import React, { useState } from 'react';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    MoreVertical,
    PhoneOff,
    Settings,
    Users,
    MessageSquare,
    Wifi,
    WifiOff,
    Activity,
    Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';

// Mock Data Types
interface Participant {
    id: string;
    name: string;
    isLocal: boolean;
    isMuted: boolean;
    isVideoOff: boolean;
    volume: number;
    avatarUrl: string;
    connectionQuality: 'excellent' | 'good' | 'poor';
}

interface NetworkStats {
    latency: number;
    packetLoss: number;
    bandwidth: string;
    serverRegion: string;
}

const MOCK_DATA = {
    "session": {
        "id": "sess_rtc_live_01",
        "startTime": "2023-11-20T14:00:00Z",
        "duration": "15:30",
        "status": "connected"
    },
    "participants": [
        {
            "id": "p_1",
            "name": "You",
            "isLocal": true,
            "isMuted": false,
            "isVideoOff": false,
            "volume": 0,
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            "connectionQuality": "excellent"
        },
        {
            "id": "p_2",
            "name": "David Kim",
            "isLocal": false,
            "isMuted": false,
            "isVideoOff": false,
            "volume": 65,
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            "connectionQuality": "good"
        },
        {
            "id": "p_3",
            "name": "Maria Garcia",
            "isLocal": false,
            "isMuted": true,
            "isVideoOff": true,
            "volume": 0,
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            "connectionQuality": "excellent"
        },
        {
            "id": "p_4",
            "name": "James Wilson",
            "isLocal": false,
            "isMuted": false,
            "isVideoOff": false,
            "volume": 12,
            "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
            "connectionQuality": "poor"
        }
    ] as Participant[],
    "networkStats": {
        "latency": 45,
        "packetLoss": 0.1,
        "bandwidth": "2.4 Mbps",
        "serverRegion": "us-east-1"
    } as NetworkStats,
    "devices": {
        "audioInputs": ["MacBook Pro Microphone", "AirPods Pro"],
        "audioOutputs": ["MacBook Pro Speakers", "AirPods Pro"],
        "videoInputs": ["FaceTime HD Camera", "Logitech Brio"]
    }
};

const ConnectionBadge = ({ quality, latency }: { quality: string, latency: number }) => {
    const getColor = () => {
        switch (quality) {
            case 'excellent': return 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800';
            case 'good': return 'text-yellow-500 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
            case 'poor': return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
            default: return 'text-stone-500 bg-stone-50 border-stone-200';
        }
    };

    return (
        <div className={`flex items-center gap-2 px-2 py-1 rounded-full border text-xs font-medium ${getColor()}`}>
            {quality === 'poor' ? <WifiOff size={14} /> : <Wifi size={14} />}
            <span>{latency}ms</span>
        </div>
    );
};

const ParticipantTile = ({ participant }: { participant: Participant }) => {
    return (
        <div className="relative aspect-video bg-stone-900 rounded-xl overflow-hidden shadow-sm border border-stone-800 group">
            {/* Video Placeholder or Avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
                {participant.isVideoOff ? (
                    <Avatar className="w-24 h-24 border-2 border-stone-700">
                        <AvatarImage src={participant.avatarUrl} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600">
                        {/* Simulated Video Stream Gradient */}
                        <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 opacity-50" />
                    </div>
                )}
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium drop-shadow-md">
                        {participant.name} {participant.isLocal && "(You)"}
                    </span>
                    {participant.isMuted && <MicOff size={14} className="text-red-400" />}
                </div>
                <ConnectionBadge quality={participant.connectionQuality} latency={30 + Math.random() * 50} />
            </div>

            {/* Audio Visualizer (Active Speaker) */}
            {!participant.isMuted && participant.volume > 0 && (
                <div className="absolute top-3 right-3 flex items-end gap-0.5 h-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-emerald-500 rounded-full animate-pulse"
                            style={{
                                height: `${Math.random() * 100}%`,
                                animationDuration: `${0.2 + Math.random() * 0.3}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Speaking border */}
            {!participant.isMuted && participant.volume > 20 && (
                <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none" />
            )}
        </div>
    );
};

export default function VideoSession() {
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    // Update local participant state based on controls
    const participants = MOCK_DATA.participants.map(p =>
        p.isLocal ? { ...p, isMuted: !micOn, isVideoOff: !videoOn } : p
    );

    return (
        <div className="flex flex-col h-screen bg-stone-950 text-stone-100 overflow-hidden font-sans">

            {/* Top Bar */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-stone-900 bg-stone-950/90 backdrop-blur">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-sm">Product Strategy Sync</h1>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {MOCK_DATA.session.duration}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800">
                        <Activity size={14} className="text-emerald-500" />
                        <span className="text-xs text-stone-400">Region: {MOCK_DATA.networkStats.serverRegion}</span>
                        <span className="w-px h-3 bg-stone-800 mx-1" />
                        <span className="text-xs text-stone-400">{MOCK_DATA.networkStats.bandwidth}</span>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-stone-400 hover:text-white hover:bg-stone-800">
                                <Settings size={20} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-stone-900 border-stone-800 text-stone-100">
                            <DialogHeader>
                                <DialogTitle>Audio & Video Settings</DialogTitle>
                                <DialogDescription className="text-stone-400">
                                    Configure your devices for the session.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="audio-input">Microphone</Label>
                                    <Select defaultValue={MOCK_DATA.devices.audioInputs[0]}>
                                        <SelectTrigger id="audio-input" className="bg-stone-800 border-stone-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-stone-800 border-stone-700 text-stone-100">
                                            {MOCK_DATA.devices.audioInputs.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="audio-output">Speakers</Label>
                                    <Select defaultValue={MOCK_DATA.devices.audioOutputs[0]}>
                                        <SelectTrigger id="audio-output" className="bg-stone-800 border-stone-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-stone-800 border-stone-700 text-stone-100">
                                            {MOCK_DATA.devices.audioOutputs.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="video-input">Camera</Label>
                                    <Select defaultValue={MOCK_DATA.devices.videoInputs[0]}>
                                        <SelectTrigger id="video-input" className="bg-stone-800 border-stone-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-stone-800 border-stone-700 text-stone-100">
                                            {MOCK_DATA.devices.videoInputs.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Main Grid */}
            <main className="flex-1 p-4 overflow-hidden">
                <div className="h-full grid grid-cols-2 gap-4 auto-rows-fr max-w-6xl mx-auto items-center justify-center">
                    {participants.map(p => (
                        <ParticipantTile key={p.id} participant={p} />
                    ))}
                </div>
            </main>

            {/* Control Bar */}
            <footer className="h-20 shrink-0 flex items-center justify-center gap-4 px-6 pb-6 mt-auto">
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl">
                    <Button
                        size="icon"
                        variant={micOn ? "secondary" : "destructive"}
                        className={`rounded-xl h-12 w-12 ${micOn ? 'bg-stone-800 text-white hover:bg-stone-700' : ''}`}
                        onClick={() => setMicOn(!micOn)}
                    >
                        {micOn ? <Mic /> : <MicOff />}
                    </Button>

                    <Button
                        size="icon"
                        variant={videoOn ? "secondary" : "destructive"}
                        className={`rounded-xl h-12 w-12 ${videoOn ? 'bg-stone-800 text-white hover:bg-stone-700' : ''}`}
                        onClick={() => setVideoOn(!videoOn)}
                    >
                        {videoOn ? <Video /> : <VideoOff />}
                    </Button>

                    <div className="w-px h-8 bg-stone-800 mx-2" />

                    <Button size="icon" variant="ghost" className="rounded-xl h-12 w-12 text-stone-400 hover:text-white hover:bg-stone-800">
                        <Monitor />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-xl h-12 w-12 text-stone-400 hover:text-white hover:bg-stone-800">
                        <Users />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-xl h-12 w-12 text-stone-400 hover:text-white hover:bg-stone-800">
                        <MessageSquare />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-xl h-12 w-12 text-stone-400 hover:text-white hover:bg-stone-800">
                        <MoreVertical />
                    </Button>

                    <div className="w-px h-8 bg-stone-800 mx-2" />

                    <Button
                        variant="destructive"
                        className="rounded-xl h-12 px-6 bg-red-600 hover:bg-red-700"
                    >
                        <PhoneOff className="mr-2 h-5 w-5" />
                        End
                    </Button>
                </div>
            </footer>
        </div>
    );
}
