
import React, { useState, useEffect, useMemo } from 'react';
import { GamePlan, BlueprintSpec, MaterialSpec, EnhancedInputSpec, NodeData, CppCode, TutorialLink, MetaSoundSpec, PcgSpec, BehaviorTreeSpec } from '../types';
import { BoxSelect, Cpu, Database, Palette, Gamepad2, Layout, ArrowRight, Loader2, Download, Zap, Code, FileCode2, Copy, Check, HelpCircle, ClipboardCopy, Plus, X, Sparkles, Terminal, Youtube, Music, Box, ShieldCheck, ShieldAlert, User, Shield, Layers, Settings, Activity, Brain, FunctionSquare } from 'lucide-react';
import BlueprintCanvas from './blueprint/BlueprintCanvas';
import BehaviorArchitect from './BehaviorArchitect';
import InputDesigner from './subsystems/InputDesigner';
import TutorialGallery from './TutorialGallery';
import { useGamePlan } from '../hooks/useGamePlan';

interface BlueprintArchitectProps {
  plan: GamePlan;
  onGenerateBlueprint: (name: string, desc: string) => Promise<BlueprintSpec>;
  onGenerateBehaviorTree: (name: string, desc: string) => Promise<BehaviorTreeSpec>;
  onGenerateMaterial: (name: string, desc: string) => Promise<MaterialSpec>;
  onGenerateInput: (name: string, desc: string) => Promise<EnhancedInputSpec>;
  onGenerateMetaSound: (name: string, desc: string) => Promise<MetaSoundSpec>;
  onGeneratePcg: (name: string, desc: string) => Promise<PcgSpec>;
  onGenerateCpp: (name: string, spec: BlueprintSpec) => Promise<CppCode>;
  onGenerateT3d: (name: string, spec: BlueprintSpec) => Promise<string>;
  selectedAsset: string | null;
  onSelectAsset: (name: string) => void;
  savedBlueprints: Record<string, BlueprintSpec>;
  savedBehaviorTrees: Record<string, BehaviorTreeSpec>;
  savedMaterials: Record<string, MaterialSpec>;
  savedInputs: Record<string, EnhancedInputSpec>;
  savedMetaSounds: Record<string, MetaSoundSpec>;
  savedPcgs: Record<string, PcgSpec>;
  savedCppCodes: Record<string, CppCode>;
}

type AssetType = 'Blueprint' | 'Material' | 'Input' | 'Widget' | 'MetaSound' | 'PCG' | 'BehaviorTree' | 'Unknown';

const BlueprintArchitect: React.FC<BlueprintArchitectProps> = ({ 
  plan, 
  onGenerateBlueprint,
  onGenerateBehaviorTree,
  onGenerateMaterial,
  onGenerateInput,
  onGenerateMetaSound,
  onGeneratePcg,
  onGenerateCpp,
  onGenerateT3d,
  selectedAsset,
  onSelectAsset,
  savedBlueprints = {},
  savedBehaviorTrees = {},
  savedMaterials = {},
  savedInputs = {},
  savedMetaSounds = {},
  savedPcgs = {},
  savedCppCodes = {}
}) => {
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearchingTutorials, setIsSearchingTutorials] = useState(false);
  const [viewMode, setViewMode] = useState<'blueprint' | 'cpp'>('blueprint');
  const [copiedCode, setCopiedCode] = useState<'header' | 'source' | 't3d' | null>(null);
  
  const { fetchTutorialsForContext } = useGamePlan();

  const [isCreatingAsset, setIsCreatingAsset] = useState(false);
  const [customAssets, setCustomAssets] = useState<{name: string, desc: string, type: AssetType, folder: string}[]>([]);
  const [newAssetForm, setNewAssetForm] = useState({
      name: '',
      type: 'Blueprint' as AssetType,
      desc: '',
      folder: '/Game/Custom'
  });

  const assets = useMemo(() => {
    const planPhases = plan?.phases || [];
    const planAssets = planPhases.flatMap(phase => 
        (phase.tasks || [])
          .filter(t => t.assetName && t.assetName.length > 2)
          .map(t => {
              let type: AssetType = 'Unknown';
              const n = t.assetName;
              if (n.startsWith('BP_') || n.startsWith('ABP_')) type = 'Blueprint';
              else if (n.startsWith('WBP_')) type = 'Widget';
              else if (n.startsWith('M_') || n.startsWith('MI_')) type = 'Material';
              else if (n.startsWith('IA_') || n.startsWith('IMC_')) type = 'Input';
              else if (n.startsWith('MS_')) type = 'MetaSound';
              else if (n.startsWith('PCG_')) type = 'PCG';
              else if (n.startsWith('BT_') || n.startsWith('BB_')) type = 'BehaviorTree';
              else if (n.startsWith('BPC_')) type = 'Blueprint';
              else if (n.startsWith('GM_')) type = 'Blueprint';
              
              return { name: n, desc: t.description, folder: t.folderPath, type };
          })
      );
      return [...planAssets, ...customAssets];
  }, [plan, customAssets]);

  const uniqueAssets = useMemo(() => {
     return Array.from(new Map(assets.map(item => [item.name, item])).values());
  }, [assets]);

  const activeAssetType: AssetType = useMemo(() => {
      if (!selectedAsset) return 'Unknown';
      return uniqueAssets.find(a => a.name === selectedAsset)?.type || 'Unknown';
  }, [selectedAsset, uniqueAssets]);

  useEffect(() => {
    const triggerGeneration = async () => {
        if (!selectedAsset) return;
        if (isGenerating) return;

        const assetData = uniqueAssets.find(b => b.name === selectedAsset);
        if (!assetData) return;

        if (assetData.type === 'Blueprint' || assetData.type === 'Widget') {
            if (savedBlueprints && savedBlueprints[selectedAsset]) return;
        } else if (assetData.type === 'BehaviorTree') {
            if (savedBehaviorTrees && savedBehaviorTrees[selectedAsset]) return;
        } else if (assetData.type === 'Material') {
            if (savedMaterials && savedMaterials[selectedAsset]) return;
        } else if (assetData.type === 'Input') {
            if (savedInputs && savedInputs[selectedAsset]) return;
        } else if (assetData.type === 'MetaSound') {
            if (savedMetaSounds && savedMetaSounds[selectedAsset]) return;
        } else if (assetData.type === 'PCG') {
            if (savedPcgs && savedPcgs[selectedAsset]) return;
        }

        setIsGenerating(true);
        try {
            if (assetData.type === 'Blueprint' || assetData.type === 'Widget') {
                await onGenerateBlueprint(assetData.name, assetData.desc);
            } else if (assetData.type === 'BehaviorTree') {
                await onGenerateBehaviorTree(assetData.name, assetData.desc);
            } else if (assetData.type === 'Material') {
                await onGenerateMaterial(assetData.name, assetData.desc);
            } else if (assetData.type === 'Input') {
                await onGenerateInput(assetData.name, assetData.desc);
            } else if (assetData.type === 'MetaSound') {
                await onGenerateMetaSound(assetData.name, assetData.desc);
            } else if (assetData.type === 'PCG') {
                await onGeneratePcg(assetData.name, assetData.desc);
            }
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    triggerGeneration();
  }, [selectedAsset, uniqueAssets, savedBlueprints, savedBehaviorTrees, savedMaterials, savedInputs, savedMetaSounds, savedPcgs]); 
  
  const handleGenerateCpp = async () => {
      if (!selectedAsset || !savedBlueprints[selectedAsset]) return;
      setIsGenerating(true);
      try {
          await onGenerateCpp(selectedAsset, savedBlueprints[selectedAsset]);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleCopyT3d = async () => {
      if (!selectedAsset || !savedBlueprints[selectedAsset]) return;
      setIsGenerating(true);
      try {
          const t3d = await onGenerateT3d(selectedAsset, savedBlueprints[selectedAsset]);
          await navigator.clipboard.writeText(t3d);
          setCopiedCode('t3d');
          setTimeout(() => setCopiedCode(null), 2000);
      } catch (e) {
          console.error("Generation failed", e);
      } finally {
          setIsGenerating(false);
      }
  };
  
  const copyToClipboard = async (text: string, type: 'header' | 'source') => {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
  };

  const getIcon = (assetName: string, type: AssetType) => {
      if (assetName.startsWith('BP_')) return <User className="w-3.5 h-3.5" />; 
      if (assetName.startsWith('BPC_')) return <Settings className="w-3.5 h-3.5" />; 
      if (assetName.startsWith('GM_')) return <Shield className="w-3.5 h-3.5" />; 
      if (assetName.startsWith('WBP_')) return <Layout className="w-3.5 h-3.5" />; 
      
      switch(type) {
          case 'BehaviorTree': return <Brain className="w-3.5 h-3.5" />;
          case 'Blueprint': return <Cpu className="w-3.5 h-3.5" />;
          case 'Material': return <Palette className="w-3.5 h-3.5" />;
          case 'Input': return <Gamepad2 className="w-3.5 h-3.5" />;
          case 'MetaSound': return <Music className="w-3.5 h-3.5" />;
          case 'PCG': return <Box className="w-3.5 h-3.5" />;
          default: return <BoxSelect className="w-3.5 h-3.5" />;
      }
  };

  const renderBlueprintView = (spec: BlueprintSpec) => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-slate-800 pb-6 flex items-end justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold uppercase rounded border border-blue-500/30 tracking-widest">
                        Parent: {spec.parentClass}
                    </span>
                    {spec.activeMode && (
                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase rounded border border-indigo-500/30 tracking-widest flex items-center gap-1.5">
                            <Activity className="w-3 h-3" /> Mode: {spec.activeMode}
                        </span>
                    )}
                </div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{spec.assetName}</h2>
            </div>
            
            <div className="flex gap-4 mb-1">
                <button
                    onClick={handleCopyT3d}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-600 transition-all text-xs font-bold shadow-lg"
                >
                    {isGenerating && copiedCode !== 't3d' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : copiedCode === 't3d' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                    {copiedCode === 't3d' ? 'Copied to Unreal' : 'Copy Nodes'}
                </button>

                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-700 flex gap-1 shadow-inner">
                    <button
                        onClick={() => setViewMode('blueprint')}
                        className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            viewMode === 'blueprint' 
                            ? 'bg-blue-600 text-white shadow-xl' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Blueprint
                    </button>
                    <button
                        onClick={() => setViewMode('cpp')}
                        className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            viewMode === 'cpp' 
                            ? 'bg-emerald-600 text-white shadow-xl' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        C++
                    </button>
                </div>
            </div>
        </div>

        {viewMode === 'blueprint' ? (
            <>
                <div className="glass-card p-1 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                    <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
                        <h4 className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                            <Zap className="w-4 h-4 text-blue-400" /> Event Graph Logic
                        </h4>
                        <div className="text-[10px] text-slate-600 font-mono">Hierarchical Integration</div>
                    </div>
                    <div className="space-y-6 p-6 bg-black/20">
                        {(spec.eventGraph || []).map((graph, i) => (
                            <div key={i} className="mb-12 last:mb-0 animate-in slide-in-from-left-2 fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-xs font-bold text-slate-400 mb-4 pl-3 border-l-2 border-blue-500 py-1 bg-blue-500/5 rounded-r-lg max-w-2xl">
                                    {graph.description}
                                </div>
                                <BlueprintCanvas 
                                    eventName={graph.eventName}
                                    initialNodes={graph.nodes}
                                    initialConnections={graph.connections}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Functions Specification */}
                    <div className="glass-card p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                        <h4 className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                            <FunctionSquare className="w-4 h-4 text-blue-400" /> Encapsulated Functions
                        </h4>
                        <div className="space-y-4">
                            {spec.functions.map((fn, i) => (
                                <div key={i} className="bg-slate-900/60 p-4 rounded-xl border border-white/5 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-blue-200">{fn.name}</span>
                                        <div className="flex gap-1 flex-wrap justify-end">
                                            {fn.parameters.map((p, pi) => (
                                                <span key={pi} className="text-[9px] font-mono bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">{fn.logicDescription}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variables Specification */}
                    <div className="glass-card p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                        <h4 className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                            <Database className="w-4 h-4 text-purple-400" /> Internal State (Variables)
                        </h4>
                        <div className="space-y-3">
                            {(spec.variables || []).map((v, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all group shadow-sm">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-purple-200 font-bold">{v.name}</span>
                                            <span className="text-[9px] font-black bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-widest">{v.type}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 leading-relaxed font-light">{v.tooltip}</div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono bg-black/40 px-2 py-0.5 rounded">{v.default}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            renderCppView(spec.assetName)
        )}
      </div>
  );

  const renderCppView = (assetName: string) => {
      const code = savedCppCodes[assetName];
      if (!code) {
          return (
              <div className="flex flex-col items-center justify-center h-[500px] glass-card rounded-xl border-slate-700/50 bg-slate-950/40">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
                      <FileCode2 className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Generate Native C++</h3>
                  <button onClick={handleGenerateCpp} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all">
                      {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
                      Transpile to C++ Source
                  </button>
              </div>
          );
      }
      return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12">
              <div className="glass-card rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[700px] shadow-2xl">
                  <div className="bg-slate-950/90 px-5 py-4 border-b border-white/5 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500 tracking-widest">{assetName}.h</span>
                      <button onClick={() => copyToClipboard(code.header, 'header')} className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-400">Copy</button>
                  </div>
                  <div className="flex-1 overflow-auto bg-[#1a1c24] p-6 font-mono text-[13px] leading-relaxed">
                      <pre className="text-blue-300">{code.header}</pre>
                  </div>
              </div>
              <div className="glass-card rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[700px] shadow-2xl">
                  <div className="bg-slate-950/90 px-5 py-4 border-b border-white/5 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500 tracking-widest">{assetName}.cpp</span>
                      <button onClick={() => copyToClipboard(code.source, 'source')} className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-400">Copy</button>
                  </div>
                  <div className="flex-1 overflow-auto bg-[#1a1c24] p-6 font-mono text-[13px] leading-relaxed">
                      <pre className="text-emerald-200">{code.source}</pre>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="flex h-full">
      <div className="w-72 border-r border-slate-800 bg-slate-900/40 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">System Library</h3>
            <button onClick={() => setIsCreatingAsset(true)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
            {uniqueAssets.map((asset) => (
                <button
                    key={asset.name}
                    onClick={() => onSelectAsset(asset.name)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all group relative overflow-hidden active:scale-[0.98] ${
                        selectedAsset === asset.name 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-xl' 
                        : 'bg-slate-800/40 border-slate-700/30 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className={`${selectedAsset === asset.name ? 'text-white' : 'text-blue-400'}`}>
                            {getIcon(asset.name, asset.type)}
                        </div>
                        <span className="font-mono font-bold truncate text-[13px]">{asset.name}</span>
                    </div>
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 relative bg-slate-950/10">
        {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-blue-400">
                <Loader2 className="w-20 h-20 animate-spin mb-10" />
                <p className="font-mono text-xs tracking-[0.4em] uppercase text-slate-400">Architecting Hierarchical Subsystems</p>
            </div>
        ) : selectedAsset && savedBlueprints[selectedAsset] && renderBlueprintView(savedBlueprints[selectedAsset])}
      </div>
    </div>
  );
};

export default BlueprintArchitect;
