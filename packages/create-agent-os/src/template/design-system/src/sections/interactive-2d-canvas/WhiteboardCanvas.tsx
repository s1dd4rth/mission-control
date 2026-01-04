import React, { useState, useRef, useEffect } from 'react';
import {
    MousePointer2,
    Hand,
    StickyNote,
    Square,
    Circle,
    Type,
    Image as ImageIcon,
    Eraser,
    Undo2,
    Redo2,
    Minus,
    Plus,
    MoreHorizontal,
    Share2,
    Download,
    Settings,
    Grid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock Data Types
interface CanvasObject {
    id: string;
    type: 'sticky' | 'shape' | 'text' | 'connector';
    content?: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    color?: string;
    fill?: string;
    stroke?: string;
    rotation?: number;
    shapeType?: 'circle' | 'rectangle';
    from?: string;
    to?: string;
}

interface Cursor {
    userId: string;
    userName: string;
    color: string;
    x: number;
    y: number;
}

const MOCK_DATA = {
    "objects": [
        {
            "id": "obj_1",
            "type": "sticky",
            "content": "Define Core User Personas",
            "x": 100,
            "y": 100,
            "width": 200,
            "height": 200,
            "color": "#fff740",
            "rotation": -2
        },
        {
            "id": "obj_2",
            "type": "sticky",
            "content": "Map out the user journey",
            "x": 350,
            "y": 100,
            "width": 200,
            "height": 200,
            "color": "#ff7eb9",
            "rotation": 2
        },
        {
            "id": "obj_3",
            "type": "shape",
            "shapeType": "circle",
            "x": 650,
            "y": 150,
            "width": 100,
            "height": 100,
            "fill": "#a7f3d0",
            "stroke": "#059669"
        },
        // Connector simulated as line for DOM implementation
        {
            "id": "obj_4",
            "type": "connector",
            "from": "obj_1",
            "to": "obj_2",
            "stroke": "#94a3b8",
            "x": 300,
            "y": 200,
            "width": 50,
            "rotation": 0
        }
    ] as CanvasObject[],
    "cursors": [
        {
            "userId": "p_2",
            "userName": "David Kim",
            "color": "#3b82f6",
            "x": 450,
            "y": 250
        },
        {
            "userId": "p_3",
            "userName": "Maria Garcia",
            "color": "#ec4899",
            "x": 180,
            "y": 180
        }
    ] as Cursor[],
    "viewport": {
        "zoom": 1,
        "x": 0,
        "y": 0,
        "gridVisible": true
    }
};

// Toolbar Component
const Toolbar = ({ activeTool, setActiveTool }: { activeTool: string, setActiveTool: (t: string) => void }) => {
    const tools = [
        { id: 'select', icon: MousePointer2, label: 'Select' },
        { id: 'hand', icon: Hand, label: 'Pan' },
        { id: 'sticky', icon: StickyNote, label: 'Sticky Note' },
        { id: 'shape', icon: Square, label: 'Shape' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'connector', icon: Minus, label: 'Connector', className: 'rotate-45' },
        { id: 'image', icon: ImageIcon, label: 'Image' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
    ];

    return (
        <div className="bg-white dark:bg-stone-900 shadow-lg border border-stone-200 dark:border-stone-800 rounded-lg p-1.5 flex flex-col gap-1">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={cn(
                        "p-2 rounded-md transition-colors relative group",
                        activeTool === tool.id
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                            : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 dark:text-stone-400"
                    )}
                    title={tool.label}
                >
                    <tool.icon size={20} className={tool.className} />
                </button>
            ))}
        </div>
    );
};

// Canvas Object Renderers
const StickyNoteObject = ({ object }: { object: CanvasObject }) => (
    <div
        className="absolute shadow-md p-4 flex items-center justify-center text-center font-handwriting text-stone-800 select-none cursor-move transition-transform hover:scale-[1.02] active:scale-95"
        style={{
            left: object.x,
            top: object.y,
            width: object.width,
            height: object.height,
            backgroundColor: object.color,
            transform: `rotate(${object.rotation}deg)`,
            fontFamily: '"Nevermind", "Comic Sans MS", cursive', // Simulated handwriting font
            fontSize: '24px',
            lineHeight: '1.4'
        }}
    >
        {object.content}
    </div>
);

const ShapeObject = ({ object }: { object: CanvasObject }) => (
    <div
        className="absolute flex items-center justify-center select-none cursor-move"
        style={{
            left: object.x,
            top: object.y,
            width: object.width,
            height: object.height,
            backgroundColor: object.fill,
            border: `2px solid ${object.stroke}`,
            borderRadius: object.shapeType === 'circle' ? '50%' : '4px',
        }}
    />
);

const ConnectorObject = ({ object }: { object: CanvasObject }) => (
    <svg
        className="absolute pointer-events-none"
        style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: -1
        }}
    >
        {/* Hardcoded path for visual check based on mock objects positions */}
        <path
            d="M 300 200 C 325 200, 325 200, 350 200"
            stroke={object.stroke}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
        />
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={object.stroke} />
            </marker>
        </defs>
    </svg>
);


// Cursor Renderer
const CursorOverlay = ({ cursor }: { cursor: Cursor }) => (
    <div
        className="absolute pointer-events-none transition-all duration-100 ease-linear z-50"
        style={{ left: cursor.x, top: cursor.y }}
    >
        <MousePointer2
            className="w-4 h-4"
            style={{ fill: cursor.color, color: cursor.color }}
        />
        <div
            className="ml-4 px-2 py-0.5 rounded text-xs text-white font-medium whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
        >
            {cursor.userName}
        </div>
    </div>
);

export default function WhiteboardCanvas() {
    const [activeTool, setActiveTool] = useState('select');
    const [zoom, setZoom] = useState(100);

    return (
        <div className="h-screen w-full bg-stone-100 dark:bg-stone-950 relative overflow-hidden font-sans">

            {/* Dot Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Floating Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                <div className="pointer-events-auto bg-white dark:bg-stone-900 shadow-sm border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-2 flex items-center gap-3">
                    <h1 className="font-semibold text-stone-800 dark:text-stone-200">Product Strategy Brainstorm</h1>
                    <span className="text-stone-300">|</span>
                    <div className="flex -space-x-2">
                        <Avatar className="w-6 h-6 border-2 border-white dark:border-stone-900">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-white dark:border-stone-900">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" />
                            <AvatarFallback>DK</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-white dark:border-stone-900">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" />
                            <AvatarFallback>MG</AvatarFallback>
                        </Avatar>
                        <div className="w-6 h-6 border-2 border-white dark:border-stone-900 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-[10px] text-stone-500 font-medium">
                            +2
                        </div>
                    </div>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white dark:bg-stone-900"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white"><Download className="w-4 h-4 mr-2" /> Export</Button>
                </div>
            </div>

            {/* Main Toolbar */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
            </div>

            {/* Canvas Area (Simulated) */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing transform-gpu">
                {/* Objects */}
                {MOCK_DATA.objects.map(obj => {
                    if (obj.type === 'connector') return <ConnectorObject key={obj.id} object={obj} />;
                    if (obj.type === 'shape') return <ShapeObject key={obj.id} object={obj} />;
                    if (obj.type === 'sticky') return <StickyNoteObject key={obj.id} object={obj} />;
                    return null;
                })}

                {/* Cursors */}
                {MOCK_DATA.cursors.map(cursor => (
                    <CursorOverlay key={cursor.userId} cursor={cursor} />
                ))}
            </div>

            {/* Zoom / Reference Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                <div className="bg-white dark:bg-stone-900 shadow-sm border border-stone-200 dark:border-stone-800 rounded-lg p-1 flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(10, z - 10))}><Minus size={16} /></Button>
                    <span className="w-12 text-center text-xs font-medium text-stone-600 dark:text-stone-300">{zoom}%</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(200, z + 10))}><Plus size={16} /></Button>
                </div>

                <div className="bg-white dark:bg-stone-900 shadow-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                    <div className="w-16 h-10 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 relative overflow-hidden">
                        {/* Minimap content */}
                        <div className="absolute top-1 left-1 w-4 h-4 bg-indigo-500/20 rounded-sm" />
                        <div className="absolute top-2 right-4 w-2 h-2 bg-stone-400/20 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Help / Undo Controls */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
                <div className="bg-white dark:bg-stone-900 shadow-sm border border-stone-200 dark:border-stone-800 rounded-lg p-1 flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Undo2 size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Redo2 size={16} /></Button>
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-white dark:bg-stone-900 rounded-lg"><Settings size={18} /></Button>
            </div>

        </div>
    );
}
