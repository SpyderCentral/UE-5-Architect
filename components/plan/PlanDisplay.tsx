
import React from 'react';
import { GamePlan } from '../../types';
import PhaseCard from './PhaseCard';
import { Layout, Box, GitBranch, ShieldCheck } from 'lucide-react';

interface PlanDisplayProps {
  plan: GamePlan;
  onNavigateToBlueprint: (assetName: string) => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onNavigateToBlueprint }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 mb-3 tracking-tight">
                    {plan.title}
                </h2>
                <p className="text-slate-400 text-lg font-light leading-relaxed max-w-4xl">
                    {plan.summary}
                </p>
            </div>
            
            <div className="flex flex-wrap gap-2 shrink-0">
                {(plan.targetPlatformRecommendations || []).map((rec, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                        <Layout className="w-3 h-3 text-blue-400" />
                        {rec}
                    </div>
                ))}
            </div>
        </div>

        {/* Technical Dependencies HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Plugins Manifest */}
            <div className="glass-card p-6 rounded-2xl bg-blue-600/5 border-blue-500/20">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <Box className="w-4 h-4" /> Required Engine Plugins
                </h3>
                <div className="flex flex-wrap gap-2">
                    {plan.requiredPlugins && plan.requiredPlugins.length > 0 ? (
                        plan.requiredPlugins.map((plugin, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-900 border border-blue-500/30 rounded-lg text-[10px] font-bold text-blue-300">
                                {plugin}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-500 italic">No specialized plugins required for this configuration.</span>
                    )}
                </div>
            </div>

            {/* Migration Notes */}
            <div className="glass-card p-6 rounded-2xl bg-purple-600/5 border-purple-500/20">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" /> Migration & Handshake
                </h3>
                <div className="space-y-2">
                    {plan.migrationNotes && plan.migrationNotes.length > 0 ? (
                        plan.migrationNotes.map((note, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                                <ShieldCheck className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                <span>{note}</span>
                            </div>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-500 italic">No critical migration steps detected.</span>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-2">
          {(plan.phases || []).map((phase, index) => (
            <PhaseCard 
                key={index} 
                phase={phase} 
                index={index} 
                onNavigateToBlueprint={onNavigateToBlueprint}
            />
          ))}
      </div>
    </div>
  );
};

export default PlanDisplay;
