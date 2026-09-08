
import React, { useState, useEffect } from 'react';
import { NarrativeData, NPC, Quest, DialogueScript } from '../types';
import { BookOpen, Users, MessageCircle, Sword, Scroll, MapPin, Sparkles, Loader2, Bot, ChevronRight, User, Image as ImageIcon } from 'lucide-react';

interface NarrativeWeaverProps {
    narrative: NarrativeData;
    onFetchQuests: () => Promise<void>;
    onFetchNPCs: () => Promise<void>;
    onFetchDialogue: (npc: NPC) => Promise<DialogueScript[]>;
    onGenerateImage: (prompt: string, category: 'Environment' | 'Character' | 'Prop' | 'UI') => Promise<void>;
}

const NarrativeWeaver: React.FC<NarrativeWeaverProps> = ({ 
    narrative, 
    onFetchQuests, 
    onFetchNPCs, 
    onFetchDialogue,
    onGenerateImage
}) => {
    const [activeTab, setActiveTab] = useState<'quests' | 'npcs'>('quests');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
    const [loadingDialogue, setLoadingDialogue] = useState(false);
    const [generatingArt, setGeneratingArt] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const fetchInitial = async () => {
            if (activeTab === 'quests' && narrative.quests.length === 0) {
                setIsLoading(true);
                await onFetchQuests();
                setIsLoading(false);
            } else if (activeTab === 'npcs' && narrative.npcs.length === 0) {
                setIsLoading(true);
                await onFetchNPCs();
                setIsLoading(false);
            }
        };
        fetchInitial();
    }, [activeTab]);

    const handleGenerateDialogue = async (npc: NPC) => {
        setLoadingDialogue(true);
        try {
            await onFetchDialogue(npc);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingDialogue(false);
        }
    };

    const handleGenerateArt = async (npc: NPC) => {
        setGeneratingArt(true);
        try {
            await onGenerateImage(
                `${npc.name}, ${npc.role}, ${npc.visualDescription}. Unreal Engine 5 render, cinematic character portrait.`,
                'Character'
            );
            alert(`Visual for ${npc.name} added to Vision Board!`);
        } catch (e) {
            console.error(e);
        } finally {
            setGeneratingArt(false);
        }
    };

    const renderQuestCard = (quest: Quest) => (
        <div key={quest.id} className="glass-card p-6 rounded-xl border border-slate-700/50 hover:border-yellow-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-yellow-400 transition-colors">{quest.title}</h3>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    quest.type === 'Main' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    quest.type === 'Side' ? 'bg-slate-700 text-slate-300' :
                    'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                    {quest.type}
                </span>
            </div>
            
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{quest.description}</p>
            
            <div className="space-y-4">
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Scroll className="w-3 h-3" /> Objectives
                    </div>
                    <ul className="space-y-1">
                        {(quest.objectives || []).map((obj, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></span>
                                {obj}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(quest.rewards || []).map((reward, i) => (
                        <span key={i} className="text-xs font-mono text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> {reward}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderNPCCard = (npc: NPC) => (
        <div 
            key={npc.id} 
            onClick={() => setSelectedNPC(npc)}
            className={`cursor-pointer glass-card p-6 rounded-xl border transition-all relative overflow-hidden group ${
                selectedNPC?.id === npc.id 
                ? 'border-blue-500 bg-blue-900/10' 
                : 'border-slate-700/50 hover:border-blue-400/50 hover:bg-slate-800/60'
            }`}
        >
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">{npc.name}</h3>
                        <div className="text-xs text-blue-300 font-mono">{npc.role}</div>
                    </div>
                </div>
                <MapPin className="w-4 h-4 text-slate-600" />
            </div>
            
            <div className="mt-4 text-sm text-slate-400 line-clamp-2 relative z-10">
                {npc.personality}
            </div>

            {selectedNPC?.id === npc.id && (
                <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none animate-pulse"></div>
            )}
        </div>
    );

    const renderSelectedNPCDetails = () => {
        if (!selectedNPC) return null;
        
        const dialogues = narrative.dialogues[selectedNPC.id] || [];

        return (
            <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-500">
                <div className="glass-card p-6 rounded-xl border border-slate-700/50 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-blue-600/5 blur-3xl rounded-full pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-1">{selectedNPC.name}</h2>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-500/20">{selectedNPC.role}</span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{selectedNPC.location}</span>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleGenerateArt(selectedNPC); }}
                            disabled={generatingArt}
                            className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/30 text-xs font-bold flex items-center gap-2 transition-all"
                        >
                            {generatingArt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                            To Vision Board
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Backstory</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{selectedNPC.backstory}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Visuals</h4>
                            <p className="text-sm text-slate-400 leading-relaxed italic">{selectedNPC.visualDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Dialogue Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-emerald-400" /> Dialogue Scripts
                        </h3>
                        <button 
                            onClick={() => handleGenerateDialogue(selectedNPC)}
                            disabled={loadingDialogue}
                            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loadingDialogue ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                            Generate Script
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {dialogues.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-slate-700 rounded-xl">
                                <p className="text-slate-500 text-sm">No dialogue generated yet.</p>
                            </div>
                        ) : (
                            (dialogues || []).map((script) => (
                                <div key={script.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                                    <div className="text-xs font-mono text-emerald-500 mb-3 border-b border-white/5 pb-2">
                                        Context: {script.context}
                                    </div>
                                    <div className="space-y-3">
                                        {(script.lines || []).map((line, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="w-16 flex-shrink-0 text-xs font-bold text-slate-400 text-right mt-1">
                                                    {line.speaker}
                                                </div>
                                                <div className="flex-1 bg-black/20 p-2 rounded-lg text-sm text-slate-200 border border-white/5">
                                                    {line.text}
                                                    {line.emotion && (
                                                        <span className="ml-2 text-[10px] text-slate-500 italic">({line.emotion})</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Story Engine</h2>
                    <div className="space-y-2">
                        <button 
                            onClick={() => setActiveTab('quests')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'quests' 
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Sword className="w-4 h-4" /> Quest Log
                        </button>
                        <button 
                            onClick={() => setActiveTab('npcs')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'npcs' 
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Users className="w-4 h-4" /> Characters (NPCs)
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-slate-900/20 relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="font-mono text-sm tracking-widest uppercase">Weaving Narrative...</p>
                    </div>
                ) : (
                    <>
                        {/* QUESTS VIEW */}
                        {activeTab === 'quests' && (
                             <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
                                <div className="mb-6">
                                    <h1 className="text-3xl font-black text-white mb-2">Quest Log</h1>
                                    <p className="text-slate-400">Core narrative arcs and mission structures.</p>
                                </div>
                                <div className="grid gap-6">
                                    {(narrative.quests || []).map(renderQuestCard)}
                                </div>
                             </div>
                        )}

                        {/* NPC VIEW */}
                        {activeTab === 'npcs' && (
                            <div className="flex gap-8 h-full">
                                {/* NPC List */}
                                <div className="w-1/3 overflow-y-auto pr-2 space-y-4">
                                     <div className="mb-4">
                                        <h1 className="text-2xl font-black text-white mb-1">Cast</h1>
                                        <p className="text-xs text-slate-400">Select a character to view details.</p>
                                    </div>
                                    {(narrative.npcs || []).map(renderNPCCard)}
                                </div>

                                {/* NPC Details */}
                                <div className="flex-1">
                                    {selectedNPC ? renderSelectedNPCDetails() : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-xl">
                                            <Users className="w-16 h-16 mb-4 opacity-20" />
                                            <p className="text-sm font-medium">Select a character from the list</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NarrativeWeaver;
