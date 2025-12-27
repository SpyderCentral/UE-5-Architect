
import React from 'react';
import { Phase } from '../../types';
import TaskCard from './TaskCard';
import { Clock, Cpu, Lightbulb, BookOpen } from 'lucide-react';

interface PhaseCardProps {
  phase: Phase;
  index: number;
  onNavigateToBlueprint: (assetName: string) => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, index, onNavigateToBlueprint }) => {
  return (
    <div 
        className="relative pl-10 pb-16 last:pb-0 animate-in fade-in duration-700 fill-mode-forwards group"
        style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Vertical Timeline Line */}
      <div className="absolute left-0 top-3 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-slate-800 to-transparent group-last:hidden"></div>

      {/* Timeline Node Icon */}
      <div className="absolute -left-[14px] top-1 w-7 h-7 rounded-lg bg-slate-950 border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 flex items-center justify-center">
        <span className="text-[10px] font-black text-white">{index + 1}</span>
      </div>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-blue-100 transition-colors">
            {phase.phaseName}
          </h3>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
                <Clock className="w-3 h-3 text-blue-400" />
                {phase.duration}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Phase Goal Block */}
            <div className="lg:col-span-2 glass-card p-5 rounded-2xl bg-blue-500/5 border-blue-500/20 shadow-lg">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Engineering Goal
                </div>
                <p className="text-[15px] text-slate-300 leading-relaxed font-light italic">
                    "{phase.goal}"
                </p>
            </div>

            {/* Key Concepts Block */}
            <div className="glass-card p-5 rounded-2xl bg-slate-900/60 border-slate-700/50">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    Technical Concepts
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {(phase.keyConcepts || []).map((concept, i) => (
                        <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded border border-white/5 uppercase tracking-tighter">
                            {concept}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-5">
          <div className="flex items-center gap-3 px-2 mb-4">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Workflow Checklist</span>
              <div className="h-px flex-1 bg-white/5"></div>
          </div>
          {(phase.tasks || []).map((task, tIndex) => (
            <div 
                key={tIndex} 
                className="slide-in-up"
                style={{ animationDelay: `${(index * 100) + (tIndex * 50)}ms` }}
            >
                <TaskCard 
                    task={task} 
                    onNavigateToBlueprint={onNavigateToBlueprint}
                />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PhaseCard;
