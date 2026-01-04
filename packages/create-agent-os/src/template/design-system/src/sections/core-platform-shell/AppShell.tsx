import React, { useState } from 'react';
import {
    Menu,
    Bell,
    Search,
    LayoutDashboard,
    Activity,
    PieChart,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    MoreVertical,
    Plus
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Mock Data Types matching data.json
interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
}

interface Workspace {
    id: string;
    name: string;
    plan: string;
    memberCount: number;
}

interface Notification {
    id: string;
    type: 'invitation' | 'system' | 'mention';
    message: string;
    isRead: boolean;
    timestamp: string;
}

// Mock Data
const MOCK_DATA: { user: User; workspace: Workspace; notifications: Notification[] } = {
    "user": {
        "id": "usr_123456789",
        "name": "Sarah Chen",
        "email": "sarah.chen@acme-corp.com",
        "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        "role": "Facilitator"
    },
    "workspace": {
        "id": "ws_987654321",
        "name": "Acme Innovation Lab",
        "plan": "Enterprise",
        "memberCount": 42
    },
    "notifications": [
        {
            "id": "notif_1",
            "type": "invitation",
            "message": "Product Strategy Sync starting in 5 mins",
            "isRead": false,
            "timestamp": "2023-11-15T09:55:00Z"
        },
        {
            "id": "notif_2",
            "type": "system",
            "message": "Orchestration templates updated",
            "isRead": true,
            "timestamp": "2023-11-14T14:30:00Z"
        },
        {
            "id": "notif_3",
            "type": "mention",
            "message": "Alex mentioned you in 'Q4 Roadmap'",
            "isRead": true,
            "timestamp": "2023-11-13T11:20:00Z"
        }
    ]
};

const NavItem = ({ icon: Icon, label, isActive, isCollapsed }: { icon: any, label: string, isActive?: boolean, isCollapsed?: boolean }) => (
    <button
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
        title={isCollapsed ? label : undefined}
    >
        <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
        {!isCollapsed && <span className="text-sm font-medium truncate">{label}</span>}
    </button>
);

export default function AppShell() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false); // Simulated theme toggle

    return (
        <div className={`flex h-screen w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>

            {/* Sidebar */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col transition-all duration-300 shadow-sm relative z-20`}
            >
                {/* Workspace Header */}
                <div className="h-16 flex items-center px-4 border-b border-stone-200 dark:border-stone-800 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                            {MOCK_DATA.workspace.name.substring(0, 2).toUpperCase()}
                        </div>
                        {!isCollapsed && (
                            <div className="min-w-0">
                                <h3 className="font-semibold text-sm truncate">{MOCK_DATA.workspace.name}</h3>
                                <p className="text-xs text-stone-500 truncate">{MOCK_DATA.workspace.plan} Plan • {MOCK_DATA.workspace.memberCount} Members</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4 px-3">
                    <div className="space-y-1">
                        <div onClick={() => setActiveTab('dashboard')}>
                            <NavItem icon={LayoutDashboard} label="Dashboard" isActive={activeTab === 'dashboard'} isCollapsed={isCollapsed} />
                        </div>
                        <div onClick={() => setActiveTab('orchestration')}>
                            <NavItem icon={Activity} label="Live Orchestration" isActive={activeTab === 'orchestration'} isCollapsed={isCollapsed} />
                        </div>
                        <div onClick={() => setActiveTab('analytics')}>
                            <NavItem icon={PieChart} label="Analytics" isActive={activeTab === 'analytics'} isCollapsed={isCollapsed} />
                        </div>
                        <div onClick={() => setActiveTab('memory')}>
                            <NavItem icon={BookOpen} label="Wisdom Network" isActive={activeTab === 'memory'} isCollapsed={isCollapsed} />
                        </div>
                    </div>

                    <div className="my-6 border-t border-stone-100 dark:border-stone-800" />

                    <div className="space-y-1">
                        {!isCollapsed && <p className="px-3 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">System</p>}
                        <div onClick={() => setActiveTab('settings')}>
                            <NavItem icon={Settings} label="Settings" isActive={activeTab === 'settings'} isCollapsed={isCollapsed} />
                        </div>
                    </div>
                </ScrollArea>

                {/* User Footer */}
                <div className="p-3 border-t border-stone-200 dark:border-stone-800">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
                                <Avatar className="h-9 w-9 border border-stone-200 dark:border-stone-700">
                                    <AvatarImage src={MOCK_DATA.user.avatarUrl} alt={MOCK_DATA.user.name} />
                                    <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                                {!isCollapsed && (
                                    <>
                                        <div className="text-left min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">{MOCK_DATA.user.name}</p>
                                            <p className="text-xs text-stone-500 truncate">{MOCK_DATA.user.role}</p>
                                        </div>
                                        <MoreVertical className="w-4 h-4 text-stone-400" />
                                    </>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20">
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full p-1 shadow-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors z-30"
                >
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-stone-50 dark:bg-stone-950 relative overflow-hidden">

                {/* Top Header */}
                <header className="h-16 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 sticky top-0 z-10">

                    {/* Left: Breadcrumbs / Title */}
                    <div>
                        <h1 className="text-lg font-semibold capitalize text-stone-900 dark:text-stone-100">
                            {activeTab.replace('-', ' ')}
                        </h1>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">

                        {/* Search */}
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 w-64 bg-stone-100 dark:bg-stone-800 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-stone-900 transition-all outline-none"
                            />
                        </div>

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-stone-900" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                                    <span className="font-semibold text-sm">Notifications</span>
                                    <span className="text-xs text-indigo-600 font-medium cursor-pointer">Mark all read</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {MOCK_DATA.notifications.map(notif => (
                                        <div key={notif.id} className={`px-4 py-3 border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
                                            <p className="text-sm text-stone-800 dark:text-stone-200">{notif.message}</p>
                                            <p className="text-xs text-stone-400 mt-1">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-6 md:p-8">

                    {activeTab === 'dashboard' && (
                        <div className="max-w-6xl mx-auto space-y-6">

                            {/* Welcome Banner */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-bold mb-2">Good morning, {MOCK_DATA.user.name.split(' ')[0]}!</h2>
                                    <p className="text-indigo-100 max-w-xl text-lg">You have 3 upcoming meetings today. The "Product Strategy Sync" is about to start.</p>
                                    <div className="mt-6 flex gap-3">
                                        <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-semibold shadow-none">
                                            Join Meeting Now
                                        </Button>
                                        <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:text-white">
                                            View Calendar
                                        </Button>
                                    </div>
                                </div>
                                {/* Abstract Shapes */}
                                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                                <div className="absolute right-40 -top-20 w-48 h-48 bg-purple-500/30 rounded-full blur-2xl" />
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Participation Equity</CardTitle>
                                        <Activity className="h-4 w-4 text-emerald-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">94%</div>
                                        <p className="text-xs text-muted-foreground">+2.5% from last week</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Orchestrations</CardTitle>
                                        <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">12</div>
                                        <p className="text-xs text-muted-foreground">Across 4 workspaces</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Cognitive Load Saved</CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-purple-500"
                                        >
                                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">18 hrs</div>
                                        <p className="text-xs text-muted-foreground">Estimated this month</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Meetings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Meetings</CardTitle>
                                        <CardDescription>
                                            Review orchestrations from the last 24 hours.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                            <Activity size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">Design Review: Agent OS</p>
                                                            <p className="text-xs text-stone-500">Yesterday • 45m • 8 Participants</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm">View Report</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group">
                                            <Plus className="w-6 h-6 text-stone-400 group-hover:text-indigo-500" />
                                            <span>New Meeting</span>
                                        </Button>
                                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all group">
                                            <LayoutDashboard className="w-6 h-6 text-stone-400 group-hover:text-purple-500" />
                                            <span>View Templates</span>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    )}

                    {activeTab === 'orchestration' && (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50/50 dark:bg-stone-900/50">
                            <div className="text-center">
                                <Activity className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-stone-500">Canvas Placeholder</h3>
                                <p className="text-stone-400">The infinite 2D canvas will be rendered here.</p>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
