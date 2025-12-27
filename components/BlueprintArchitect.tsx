
import React, { useState, useEffect, useMemo } from 'react';
import { GamePlan, BlueprintSpec, MaterialSpec, EnhancedInputSpec, NodeData, CppCode, TutorialLink, MetaSoundSpec, PcgSpec, BehaviorTreeSpec } from '../types';
import { BoxSelect, Cpu, Database, Palette, Gamepad2, Layout, ArrowRight, Loader2, Download, Zap, Code, FileCode2, Copy, Check, HelpCircle, ClipboardCopy, Plus, X, Sparkles, Terminal, Youtube, Music, Box, ShieldCheck, ShieldAlert, User, Shield, Layers, Settings, Activity, Brain, GitMerge } from 'lucide-react';
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

  const handleGenerateCompanionBT = () => {
      if (!selectedAsset) return;
      const parentAsset = uniqueAssets.find(a => a.name === selectedAsset);
      if (!parentAsset) return;

      const btName = `BT_${selectedAsset.replace('BP_', '')}`;
      const newBT = {
          name: btName,
          desc: `AI behavior tree logic for ${selectedAsset}. Target logic: ${parentAsset.desc}. Root node must be a Selector.`,
          type: 'BehaviorTree' as AssetType,
          folder: parentAsset.folder
      };

      setCustomAssets(prev => [...prev, newBT]);
      onSelectAsset(newBT.name);
  };

  const handleSearchTutorials = async (customQuery?: string) => {
      if (!selectedAsset && !customQuery) return;
      setIsSearchingTutorials(true);
      try {
          const assetData = uniqueAssets.find(a => a.name === selectedAsset);
          const finalQuery = customQuery || `UE5 tutorial ${selectedAsset} ${assetData?.desc || ''}`;
          await fetchTutorialsForContext(
              finalQuery,
              'blueprint',
              selectedAsset || 'global_search'
          );
      } finally {
          setIsSearchingTutorials(false);
      }
  };

  const performCopy = (text: string) => {
    try {
        window.focus();
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error("Fallback copy failed", err);
        return false;
    }
  };

  const handleCopyT3d = async () => {
      if (!selectedAsset || !savedBlueprints[selectedAsset]) return;
      setIsGenerating(true);
      try {
          const t3d = await onGenerateT3d(selectedAsset, savedBlueprints[selectedAsset]);
          try {
              window.focus();
              if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(t3d);
                setCopiedCode('t3d');
                setTimeout(() => setCopiedCode(null), 2000);
              } else { throw new Error("Clipboard API unavailable"); }
          } catch (e) {
              if (performCopy(t3d)) {
                  setCopiedCode('t3d');
                  setTimeout(() => setCopiedCode(null), 2000);
              }
          }
      } catch (e) {
          console.error("Generation failed", e);
      } finally {
          setIsGenerating(false);
      }
  };
  
  const copyToClipboard = async (text: string, type: 'header' | 'source') => {
      try {
          window.focus();
          if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(text);
              setCopiedCode(type);
              setTimeout(() => setCopiedCode(null), 2000);
          } else { throw new Error("Clipboard API unavailable"); }
      } catch (e) {
          if (performCopy(text)) {
              setCopiedCode(type);
              setTimeout(() => setCopiedCode(null), 2000);
          }
      }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newAssetForm.name || !newAssetForm.desc) return;
      
      const newAsset = {
          name: newAssetForm.name,
          desc: newAssetForm.desc,
          type: newAssetForm.type,
          folder: newAssetForm.folder
      };

      setCustomAssets(prev => [...prev, newAsset]);
      onSelectAsset(newAsset.name);
      setIsCreatingAsset(false);
      setNewAssetForm({ name: '', type: 'Blueprint', desc: '', folder: '/Game/Custom' });
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
                    {spec.validationReport && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded border border-emerald-500/30 tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Ludus Academy Verified
                        </span>
                    )}
                </div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{spec.assetName}</h2>
            </div>
            
            <div className="flex gap-4 mb-1">
                {(spec.parentClass === 'Character' || spec.parentClass === 'Pawn') && (
                    <button
                        onClick={handleGenerateCompanionBT}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-900/30 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl border border-purple-500/30 transition-all text-xs font-bold shadow-lg"
                        title="Generate a linked Behavior Tree for this Character"
                    >
                        <Brain className="w-3.5 h-3.5" />
                        AI Logic (BT)
                    </button>
                )}

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
                        <div className="text-[10px] text-slate-600 font-mono">Interactive Node Flow</div>
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

                {spec.validationReport && (
                    <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-xl animate-in slide-in-from-bottom-2">
                        <h4 className="flex items-center gap-3 text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">
                            <ShieldCheck className="w-4 h-4" /> Triple-Agent Synthesis Log
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Technical Auditor</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><Check className="w-3 h-3" /> {spec.validationReport.technicalAuditor.status}</div>
                                <div className="text-[9px] text-slate-500 font-mono leading-tight">{(spec.validationReport.technicalAuditor.findings || [])[0]}</div>
                            </div>
                            <div className="space-y-3 border-x border-white/5 px-6">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Flow Validator</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><Check className="w-3 h-3" /> {spec.validationReport.logicFlowValidator.status}</div>
                                <div className="text-[9px] text-slate-500 font-mono leading-tight">{(spec.validationReport.logicFlowValidator.findings || [])[0]}</div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Functional Engineer</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400"><Check className="w-3 h-3" /> {spec.validationReport.functionalEngineer.status}</div>
                                <div className="text-[9px] text-slate-500 font-mono leading-tight">{(spec.validationReport.functionalEngineer.findings || [])[0]}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                            <h4 className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                                <BoxSelect className="w-4 h-4 text-emerald-400" /> Component Hierarchy
                            </h4>
                            <div className="flex flex-wrap gap-2.5">
                                {(spec.components || []).map((comp, i) => (
                                    <span key={i} className="text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg shadow-sm">
                                        {comp}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                            <h4 className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                                <Database className="w-4 h-4 text-purple-400" /> Class Defaults & Variables
                            </h4>
                            <div className="space-y-3">
                                {(spec.variables || []).map((v, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all group shadow-sm">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-purple-200 font-bold">{v.name}</span>
                                                <span className="text-[9px] font-black bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-widest">{v.type}</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed font-light">
                                                <HelpCircle className="w-3 h-3 mt-0.5 opacity-40 shrink-0" />
                                                <span>{v.tooltip}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <div className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">Initial Value</div>
                                            <div className="text-[10px] text-slate-400 font-mono bg-black/40 px-2 py-0.5 rounded">{v.default}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 rounded-2xl border border-slate-700/50 shadow-xl h-fit">
                            <TutorialGallery 
                                tutorials={spec.tutorials || []} 
                                isLoading={isSearchingTutorials}
                                onSearch={handleSearchTutorials}
                                defaultQuery={spec.assetName}
                            />
                        </div>
                    </div>
                </div>
            </>
        ) : (
            renderCppView(spec.assetName)
        )}
      </div>
  );

  const renderMaterialView = (spec: MaterialSpec) => {
    const canvasNodes: NodeData[] = (spec.nodes || []).map((n, i) => ({
        id: n.id,
        name: n.name,
        type: n.type as any,
        x: 0, 
        y: 0,
        inputs: (n.properties || []).map(p => ({ name: p, type: 'float' as const })),
        outputs: (n.properties || []).map(p => ({ name: p, type: 'float' as const }))
    }));
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="border-b border-slate-800 pb-6 flex justify-between items-end gap-8">
             <div className="flex-1 min-w-0">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight truncate">{spec.assetName}</h2>
                <div className="flex gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded border border-emerald-500/20">{spec.domain}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700">{spec.blendMode}</span>
                </div>
             </div>
             <div className="w-80 shrink-0 glass-card p-4 rounded-xl border border-slate-700/50 shadow-lg">
                <TutorialGallery 
                    tutorials={spec.tutorials || []}
                    isLoading={isSearchingTutorials}
                    onSearch={handleSearchTutorials}
                    defaultQuery={spec.assetName}
                />
             </div>
          </div>
          <div className="glass-card p-1 rounded-2xl border border-slate-700/50 overflow-hidden h-[650px] relative shadow-2xl">
               <BlueprintCanvas 
                  eventName="Material Graph"
                  initialNodes={canvasNodes}
                  initialConnections={spec.connections || []}
                  mode="material"
               />
          </div>
      </div>
    );
  };

  const renderMetaSoundView = (spec: MetaSoundSpec) => {
    const canvasNodes: NodeData[] = (spec.nodes || []).map((n) => ({
        id: n.id,
        name: n.name,
        type: 'audio',
        x: 0, 
        y: 0,
        inputs: (n.inputs || []).map(i => ({ name: i.name, type: i.type as any })),
        outputs: (n.outputs || []).map(o => ({ name: o.name, type: o.type as any }))
    }));

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="border-b border-slate-800 pb-6 flex justify-between items-end gap-8">
             <div className="flex-1 min-w-0">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight truncate">{spec.assetName}</h2>
                <p className="text-slate-400 text-sm line-clamp-1">{spec.description}</p>
             </div>
             <div className="w-80 shrink-0 glass-card p-4 rounded-xl border border-slate-700/50 shadow-lg">
                <TutorialGallery 
                    tutorials={spec.tutorials || []}
                    isLoading={isSearchingTutorials}
                    onSearch={handleSearchTutorials}
                    defaultQuery={spec.assetName}
                />
             </div>
          </div>
          <div className="bg-orange-500/10 p-5 rounded-xl border border-orange-500/20 flex items-start gap-4 mb-6">
              <Zap className="w-5 h-5 text-orange-400 mt-1" />
              <div>
                  <h4 className="text-sm font-bold text-orange-300 mb-1">DSP Audio Logic</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{spec.dspLogic}</p>
              </div>
          </div>
          <div className="glass-card p-1 rounded-2xl border border-slate-700/50 overflow-hidden h-[650px] relative shadow-2xl">
               <BlueprintCanvas 
                  eventName="MetaSound Source"
                  initialNodes={canvasNodes}
                  initialConnections={spec.connections || []}
                  mode="audio"
               />
          </div>
      </div>
    );
  };

  const renderPcgView = (spec: PcgSpec) => {
    const canvasNodes: NodeData[] = (spec.nodes || []).map((n) => ({
        id: n.id,
        name: n.name,
        type: 'pcg',
        x: 0, 
        y: 0,
        inputs: [{ name: 'In', type: 'pcg_data' }],
        outputs: [{ name: 'Out', type: 'pcg_data' }]
    }));

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="border-b border-slate-800 pb-6 flex justify-between items-end gap-8">
             <div className="flex-1 min-w-0">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight truncate">{spec.assetName}</h2>
                <p className="text-slate-400 text-sm line-clamp-1">{spec.description}</p>
             </div>
             <div className="w-80 shrink-0 glass-card p-4 rounded-xl border border-slate-700/50 shadow-lg">
                <TutorialGallery 
                    tutorials={spec.tutorials || []}
                    isLoading={isSearchingTutorials}
                    onSearch={handleSearchTutorials}
                    defaultQuery={spec.assetName}
                />
             </div>
          </div>
          <div className="bg-cyan-500/10 p-5 rounded-xl border border-cyan-500/20 flex items-start gap-4 mb-6">
              <Sparkles className="w-5 h-5 text-cyan-400 mt-1" />
              <div>
                  <h4 className="text-sm font-bold text-cyan-300 mb-1">Procedural Pipeline</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{spec.proceduralLogic}</p>
              </div>
          </div>
          <div className="glass-card p-1 rounded-2xl border border-slate-700/50 overflow-hidden h-[650px] relative shadow-2xl">
               <BlueprintCanvas 
                  eventName="PCG Graph"
                  initialNodes={canvasNodes}
                  initialConnections={spec.connections || []}
                  mode="pcg"
               />
          </div>
      </div>
    );
  };

  const renderInputView = (spec: EnhancedInputSpec) => (
      <div className="space-y-8">
          <div className="flex justify-end mb-4">
              <div className="w-80 glass-card p-4 rounded-xl border border-slate-700/50 shadow-lg">
                <TutorialGallery 
                    tutorials={spec.tutorials || []}
                    isLoading={isSearchingTutorials}
                    onSearch={handleSearchTutorials}
                    defaultQuery={spec.contextName}
                />
              </div>
          </div>
          <InputDesigner spec={spec} />
      </div>
  );

  const renderCppView = (assetName: string) => {
      const code = savedCppCodes[assetName];
      if (!code) {
          return (
              <div className="flex flex-col items-center justify-center h-[500px] glass-card rounded-xl border-slate-700/50 bg-slate-950/40">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                      <FileCode2 className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Generate Native C++</h3>
                  <p className="text-slate-400 text-sm max-w-md text-center mb-8 leading-relaxed font-light">
                      Automagically transpile your visual Blueprint logic into high-performance Unreal Engine 5 C++ code. Perfect for optimization.
                  </p>
                  <button 
                    onClick={handleGenerateCpp}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                  >
                      {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
                      Transpile to C++ Source
                  </button>
              </div>
          );
      }
      return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
              <div className="bg-slate-900/50 p-5 rounded-xl border border-blue-500/20 flex items-start gap-4 shadow-lg">
                  <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/30">
                      <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-blue-300 mb-1 tracking-wide uppercase">Architectural Analysis</h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">{code.explanation}</p>
                  </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
            {uniqueAssets.map((asset) => {
                let isCached = false;
                if (asset.type === 'Blueprint' || asset.type === 'Widget') isCached = !!(savedBlueprints && savedBlueprints[asset.name]);
                if (asset.type === 'BehaviorTree') isCached = !!(savedBehaviorTrees && savedBehaviorTrees[asset.name]);
                if (asset.type === 'Material') isCached = !!(savedMaterials && savedMaterials[asset.name]);
                if (asset.type === 'Input') isCached = !!(savedInputs && savedInputs[asset.name]);
                if (asset.type === 'MetaSound') isCached = !!(savedMetaSounds && savedMetaSounds[asset.name]);
                if (asset.type === 'PCG') isCached = !!(savedPcgs && savedPcgs[asset.name]);

                return (
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
                        <div className="text-[10px] opacity-60 truncate relative z-10 font-mono tracking-tight">{asset.folder}</div>
                        <div className="absolute right-3 top-4 flex gap-1.5 z-20">
                           {isCached && <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>}
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 relative bg-slate-950/10">
        {isCreatingAsset && (
             <div className="max-w-xl mx-auto glass-card p-10 rounded-3xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300 mt-12 bg-slate-950/80 backdrop-blur-3xl">
                 <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">Define New Asset</h3>
                     <button onClick={() => setIsCreatingAsset(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                 </div>
                 <form onSubmit={handleCreateAsset} className="space-y-6">
                     <input type="text" value={newAssetForm.name} onChange={(e) => setNewAssetForm({...newAssetForm, name: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-sm text-white font-mono" placeholder="Asset Name (e.g. BP_HeroCharacter)" />
                     <select value={newAssetForm.type} onChange={(e) => setNewAssetForm({...newAssetForm, type: e.target.value as AssetType})} className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-sm text-white">
                        <option value="Blueprint">Blueprint (Actor/Pawn/Character)</option>
                        <option value="BehaviorTree">Behavior Tree & Blackboard</option>
                        <option value="Material">Material</option>
                        <option value="MetaSound">MetaSound</option>
                        <option value="PCG">PCG Graph</option>
                        <option value="Input">Enhanced Input</option>
                        <option value="Widget">User Widget (UMG)</option>
                     </select>
                     <textarea value={newAssetForm.desc} onChange={(e) => setNewAssetForm({...newAssetForm, desc: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-sm text-white h-40" placeholder="Technical Description (e.g. A character with wall-climb ability and stamina component)..." />
                     <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs">Initialize Asset</button>
                 </form>
             </div>
        )}

        {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-blue-400 animate-in duration-500">
                <Loader2 className="w-20 h-20 animate-spin mb-10" />
                <p className="font-mono text-xs tracking-[0.4em] uppercase text-slate-400">Architecting Neural Subsystems</p>
            </div>
        ) : selectedAsset && (
            <div className="max-w-6xl mx-auto">
                {(activeAssetType === 'Blueprint' || activeAssetType === 'Widget') && savedBlueprints && savedBlueprints[selectedAsset] && renderBlueprintView(savedBlueprints[selectedAsset])}
                {activeAssetType === 'BehaviorTree' && savedBehaviorTrees && savedBehaviorTrees[selectedAsset] && <BehaviorArchitect spec={savedBehaviorTrees[selectedAsset]} />}
                {activeAssetType === 'Material' && savedMaterials && savedMaterials[selectedAsset] && renderMaterialView(savedMaterials[selectedAsset])}
                {activeAssetType === 'Input' && savedInputs && savedInputs[selectedAsset] && renderInputView(savedInputs[selectedAsset])}
                {activeAssetType === 'MetaSound' && savedMetaSounds && savedMetaSounds[selectedAsset] && renderMetaSoundView(savedMetaSounds[selectedAsset])}
                {activeAssetType === 'PCG' && savedPcgs && savedPcgs[selectedAsset] && renderPcgView(savedPcgs[selectedAsset])}
            </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintArchitect;
