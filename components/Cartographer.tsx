
import React, { useState } from 'react';
import { LevelLayout, PointOfInterest } from '../types';
import { Map, Plus, Target, Ghost, Coins, Skull, HelpCircle, Navigation, Loader2, LayoutGrid, ZoomIn, ZoomOut, Maximize, ExternalLink, Globe, Gauge, Activity, Grid3X3, Box } from 'lucide-react';

interface CartographerProps {
    layouts: LevelLayout[];
    onGenerateLayout: () => Promise<void>;
    onUpdatePosition: (layoutId: string, poiId: string, x: number, y: number) => void;
    onAnalyzePerformance?: (layout: LevelLayout) => void;
}

const Cartographer: React.FC<CartographerProps> = ({ layouts, onGenerateLayout, onUpdatePosition, onAnalyzePerformance }) => {
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(layouts[0]?.id || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);
    const [zoom, setZoom] = useState(100);

    const activeLayout = layouts.find(l => l.id === selectedLayoutId);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            await onGenerateLayout();
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAudit = async () => {
        if (!activeLayout || !onAnalyzePerformance) return;
        setIsAuditing(true);
        try {
            await onAnalyzePerformance(activeLayout);
            alert("Theoretical Performance Report generated and saved to 'Diagnose' tab.");
        } finally {
            setIsAuditing(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('poiId', id);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const poiId = e.dataTransfer.getData('poiId');
        if (!poiId || !selectedLayoutId) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        onUpdatePosition(selectedLayoutId, poiId, x, y);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const getIcon = (type: PointOfInterest['type']) => {
        switch (type) {
            case 'Spawn': return <Navigation className="w-4 h-4 text-emerald-400" />;
            case 'Enemy': return <Ghost className="w-4 h-4 text-red-400" />;
            case 'Boss': return <Skull className="w-4 h-4 text-purple-400" />;
            case 'Loot': return <Coins className="w-4 h-4 text-yellow-400" />;
            case 'Puzzle': return <HelpCircle className="w-4 h-4 text-blue-400" />;
            case 'NavMesh': return <Grid3X3 className="w-4 h-4 text-emerald-300" />;
            case 'Volume': return <Box className="w-4 h-4 text-blue-300" />;
            default: return <Target className="w-4 h-4 text-slate-400" />;
        }
    };

    const getPoiStyle = (type: PointOfInterest['type']) => {
        if (type === 'NavMesh') return 'bg-emerald-950/40 border-emerald-500 border-2 rounded-lg w-16 h-12 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]';
        if (type === 'Volume') return 'bg-blue-900/30 border-blue-400/50 border-2 dashed rounded-md w-10 h-10 flex items-center justify-center';
        return 'p-1.5 rounded-full border shadow-lg bg-slate-900 border-white/20';
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-72 border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Map className="w-4 h-4" /> World Maps
                    </h2>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg mb-4"
                    >
                        {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Generate New Level
                    </button>

                    <div className="space-y-2">
                        {layouts.map(layout => (
                            <button
                                key={layout.id}
                                onClick={() => setSelectedLayoutId(layout.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    selectedLayoutId === layout.id
                                    ? 'bg-slate-800 text-white border border-slate-600'
                                    : 'text-slate-400 hover:bg-slate-800/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{layout.name}</span>
                                    {layout.location?.includes('Grounded') && <Globe className="w-3 h-3 text-blue-400" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {activeLayout && (
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key locations</h3>
                            <div className="text-[9px] font-mono text-slate-600">{activeLayout.pointsOfInterest.length} POIs</div>
                        </div>
                        <div className="space-y-3">
                            {activeLayout.pointsOfInterest.map(poi => (
                                <div key={poi.id} className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex flex-col gap-2 group/poi">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">{getIcon(poi.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-slate-200 truncate">{poi.name}</div>
                                            <div className="text-[10px] text-slate-500 leading-tight mt-1">{poi.description}</div>
                                        </div>
                                    </div>
                                    {poi.mapUri && (
                                        <a 
                                            href={poi.mapUri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mt-1 flex items-center gap-1.5 text-[9px] font-bold text-blue-400 hover:text-white transition-colors bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20"
                                        >
                                            <ExternalLink className="w-2.5 h-2.5" />
                                            View Real-World Reference
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Map View */}
            <div className="flex-1 bg-[#0b0f19] p-8 overflow-hidden relative flex flex-col">
                {activeLayout ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="mb-4 flex justify-between items-end">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-black text-white">{activeLayout.name}</h1>
                                    {activeLayout.location?.includes('Grounded') && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                                            <Globe className="w-3 h-3" /> Grounded Design
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm max-w-2xl mt-1 line-clamp-2">{activeLayout.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleAudit}
                                    disabled={isAuditing}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg text-xs font-bold border border-emerald-500/20 transition-all shadow-lg active:scale-95 group"
                                    title="Run Theoretical Performance Audit"
                                >
                                    {isAuditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gauge className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />}
                                    Theoretical Audit
                                </button>

                                <div className="flex bg-slate-900 rounded-lg border border-white/5 overflow-hidden">
                                    <button onClick={() => setZoom(z => Math.max(z - 25, 50))} className="p-2 hover:bg-white/5 text-slate-400 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
                                    <span className="px-3 py-2 text-[10px] font-mono text-slate-500 border-x border-white/5 flex items-center min-w-[50px] justify-center">{zoom}%</span>
                                    <button onClick={() => setZoom(z => Math.min(z + 25, 200))} className="p-2 hover:bg-white/5 text-slate-400 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="flex-1 bg-slate-950 rounded-xl overflow-auto border border-slate-700 shadow-2xl group select-none custom-scrollbar relative">
                            {activeLayout.imageBase64 ? (
                                <div 
                                    className="relative transition-all duration-300 origin-top-left"
                                    style={{ 
                                        width: `${zoom}%`, 
                                        minWidth: '100%',
                                        aspectRatio: '16/9'
                                    }}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <img 
                                        src={activeLayout.imageBase64} 
                                        alt="Map" 
                                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                        draggable={false}
                                    />
                                    
                                    {/* POI Markers */}
                                    {activeLayout.pointsOfInterest.map(poi => (
                                        <div
                                            key={poi.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, poi.id)}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move hover:scale-110 transition-transform z-10"
                                            style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                                            title={poi.name}
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-black/50 blur-sm rounded-full"></div>
                                                <div className={`relative ${getPoiStyle(poi.type)} transition-colors`}>
                                                    {getIcon(poi.type)}
                                                    {poi.type === 'NavMesh' && <span className="absolute -top-6 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">AI ZONE</span>}
                                                </div>
                                            </div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
                                                {poi.name}
                                                {poi.mapUri && <Globe className="w-2.5 h-2.5 text-blue-400" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-3xl">
                        <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm font-medium">Select or Generate a Level Layout</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cartographer;
