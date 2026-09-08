
import React from 'react';
import { OverseerReport, SubsystemStatus } from '../types';
import { ShieldCheck, ShieldAlert, Zap, AlertTriangle, CheckCircle2, Layout, Database, Cpu, Brain, GitBranch, Target, Loader2, Sparkles } from 'lucide-react';

interface OverseerPanelProps {
    report?: OverseerReport;
    onGenerate: () => void;
    isLoading: boolean;
}

const OverseerPanel: React.FC<OverseerPanelProps> = ({ report, onGenerate, isLoading }) => {
    
    const getPillarIcon = (pillar: SubsystemStatus['pillar']) => {
        switch (pillar) {
            case 'Logic': return <Cpu className="w-4 h-4" />;
            case 'Visuals': return <Zap className="w-4 h-4" />;
            case 'AI': return <Brain className="w-4 h-4" />;
            case 'Systems': return <Database className="w-4 h-4" />;
            default: return <Layout className="w-4 h-4" />;
        }
    };

    const getStatusStyles = (status: SubsystemStatus['status']) => {
        switch (status) {
            case 'Nominal': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'Incomplete': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'Critical Gap': return 'bg-red-500/10 border-red-500/20 text-red-400';
            default: return 'bg-slate-800 border-slate-700 text-slate-500';
        }
    };

    return (
        <div className="h-full p-8 max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-4">
                        <ShieldCheck className="w-10 h-10 text-blue-500" /> Production Overseer
                    </h1>
                    <p className="text-slate-400 text-lg font-light max-w-2xl">
                        A production-grade agent cross-referencing your roadmap with your architectural assets to ensure a shipping-ready project.
                    </p>
                </div>
                <button 
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3 group disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                    Refresh Audit
                </button>
            </div>

            {!report && !isLoading ? (
                <div className="h-96 flex flex-col items-center justify-center text-center opacity-30 border border-dashed border-slate-800 rounded-3xl p-12">
                    <ShieldAlert className="w-16 h-16 mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Technical Audit Required</h2>
                    <p className="max-w-md">Initialize the Overseer to scan your roadmap requirements against your created assets.</p>
                </div>
            ) : isLoading ? (
                <div className="h-96 flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                        <div className="w-20 h-20 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin relative z-10"></div>
                    </div>
                    <p className="text-blue-400 font-mono text-sm tracking-[0.4em] uppercase">Auditing Technical Grid...</p>
                </div>
            ) : report && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
                    {/* Top Gauge Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 glass-card p-8 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                                <GitBranch className="w-32 h-32 text-blue-400" />
                            </div>
                            <div className="relative mb-6">
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                    <circle 
                                        cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                        strokeDasharray={465}
                                        strokeDashoffset={465 - (465 * report.overallReadiness / 100)}
                                        strokeLinecap="round"
                                        className="text-blue-500 transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white">{report.overallReadiness}%</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Complete</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Project Integrity</h3>
                            <p className="text-xs text-slate-400 leading-relaxed italic">"{report.summary}"</p>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(report.subsystems || []).map((sub, i) => (
                                <div key={i} className="glass-card p-6 rounded-2xl border border-slate-800/50 bg-slate-900/20 flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {getPillarIcon(sub.pillar)}
                                            </div>
                                            <span className="text-sm font-black text-white uppercase tracking-wider">{sub.pillar}</span>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(sub.status)}`}>
                                            {sub.status}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${sub.score}%` }} />
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed font-light">{sub.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Missing Critical Assets */}
                        <div className="glass-card p-8 rounded-3xl border border-slate-700/50 shadow-xl bg-slate-900/10">
                            <h4 className="flex items-center gap-3 text-xs font-black text-red-400 uppercase tracking-[0.2em] mb-8">
                                <AlertTriangle className="w-4 h-4" /> Missing Dependencies
                            </h4>
                            <div className="space-y-4">
                                {(report.missingCriticalAssets || []).length === 0 ? (
                                    <div className="py-12 text-center opacity-40">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                        <p className="text-sm font-bold uppercase tracking-widest">All Core Assets Allocated</p>
                                    </div>
                                ) : (
                                    (report.missingCriticalAssets || []).map((asset, i) => (
                                        <div key={i} className="flex gap-5 p-5 rounded-2xl bg-red-500/5 border border-red-500/10 group hover:border-red-500/30 transition-all">
                                            <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-900 flex flex-col items-center justify-center border border-white/5">
                                                <span className="text-[8px] font-black text-slate-600 uppercase mb-0.5">{asset.type}</span>
                                                <Target className="w-5 h-5 text-red-500/50" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-200 mb-1 group-hover:text-red-400 transition-colors">{asset.name}</div>
                                                <p className="text-xs text-slate-500 italic leading-relaxed">"{asset.reason}"</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Technical Debt */}
                            <div className="glass-card p-8 rounded-3xl border border-slate-700/50 shadow-xl bg-slate-900/10 flex flex-col">
                                <h4 className="flex items-center gap-3 text-xs font-black text-amber-400 uppercase tracking-[0.2em] mb-8">
                                    <Zap className="w-4 h-4" /> Structural Bottlenecks
                                </h4>
                                <ul className="space-y-4 flex-1">
                                    {(report.technicalDebtAlerts || []).map((alert, i) => (
                                        <li key={i} className="flex items-start gap-4 text-xs text-slate-400 leading-relaxed font-light bg-black/20 p-4 rounded-xl border border-white/5">
                                            <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            {alert}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Suggested Next Action */}
                            <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Priority Command</h4>
                                <p className="text-lg font-bold text-white mb-6 leading-tight">
                                    {report.suggestedNextAction}
                                </p>
                                <button className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all">
                                    Execute Protocol <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverseerPanel;
