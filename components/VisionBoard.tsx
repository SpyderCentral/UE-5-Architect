
import React, { useEffect, useState } from 'react';
import { GamePlan, VisionImage, VisualPrompt } from '../types';
import { Image as ImageIcon, Sparkles, Loader2, ArrowRight, Download, Maximize2, X } from 'lucide-react';

interface VisionBoardProps {
  plan: GamePlan;
  images: VisionImage[];
  suggestedPrompts: VisualPrompt[];
  onFetchPrompts: () => void;
  onGenerateImage: (prompt: string, category: 'Environment' | 'Character' | 'Prop' | 'UI') => Promise<void>;
}

const VisionBoard: React.FC<VisionBoardProps> = ({ 
    plan, 
    images, 
    suggestedPrompts, 
    onFetchPrompts, 
    onGenerateImage 
}) => {
  const [activePrompt, setActivePrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Environment' | 'Character' | 'Prop' | 'UI'>('Environment');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<VisionImage | null>(null);

  useEffect(() => {
      onFetchPrompts();
  }, []);

  const handleGenerate = async () => {
      if (!activePrompt) return;
      setIsGenerating(true);
      try {
          await onGenerateImage(activePrompt, activeCategory);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleUseSuggestion = (p: VisualPrompt) => {
      setActivePrompt(p.prompt);
      setActiveCategory(p.category);
  };

  return (
    <div className="flex h-full">
        {/* Left Sidebar: Studio Controls */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col p-6 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Art Director
            </h3>
            
            {/* Custom Generator */}
            <div className="space-y-4 mb-8">
                <div>
                    <label className="text-xs text-slate-400 font-bold mb-1.5 block">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Environment', 'Character', 'Prop', 'UI'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat as any)}
                                className={`text-[10px] font-bold py-1.5 rounded border transition-all ${
                                    activeCategory === cat 
                                    ? 'bg-blue-600 border-blue-500 text-white' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs text-slate-400 font-bold mb-1.5 block">Prompt</label>
                    <textarea 
                        value={activePrompt}
                        onChange={(e) => setActivePrompt(e.target.value)}
                        placeholder="Describe your vision..."
                        className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50 resize-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !activePrompt}
                    className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isGenerating || !activePrompt 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
                    }`}
                >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {isGenerating ? 'Rendering...' : 'Generate Art'}
                </button>
            </div>

            {/* Suggestions */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">AI Suggestions</h4>
                {suggestedPrompts.length === 0 ? (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Loader2 className="w-3 h-3 animate-spin" /> Analyzing Plan...
                    </div>
                ) : (
                    <div className="space-y-3">
                        {suggestedPrompts.map((p, i) => (
                            <div 
                                key={i}
                                onClick={() => handleUseSuggestion(p)}
                                className="group cursor-pointer bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/50 hover:bg-purple-900/10 p-3 rounded-lg transition-all"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold text-purple-300 bg-purple-900/30 px-1.5 py-0.5 rounded">{p.category}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-1" />
                                </div>
                                <div className="text-xs font-semibold text-slate-300 group-hover:text-white mb-1">{p.title}</div>
                                <div className="text-[10px] text-slate-500 line-clamp-2">{p.prompt}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right Area: Gallery */}
        <div className="flex-1 bg-[#0b0f19] p-8 overflow-y-auto">
             <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-white mb-2">Concept Gallery</h2>
                    <p className="text-slate-400 text-sm">Visualizing the world of {plan.title}</p>
                </div>

                {images.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700">
                            <ImageIcon className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Your canvas is empty</h3>
                        <p className="text-slate-500 max-w-sm text-center">
                            Use the Art Director tools on the left to generate concept art for your game.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl hover:border-slate-600 transition-all">
                            <img src={img.base64} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <span className="text-[10px] font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded w-fit mb-2 backdrop-blur-sm border border-purple-500/30">{img.category}</span>
                                <p className="text-xs text-slate-200 line-clamp-2 mb-3">{img.prompt}</p>
                                <button 
                                    onClick={() => setSelectedImage(img)}
                                    className="self-end p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
            <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="max-w-7xl w-full h-full flex flex-col items-center justify-center gap-6">
                    <img 
                        src={selectedImage.base64} 
                        alt={selectedImage.prompt} 
                        className="max-h-[80vh] w-auto rounded-lg shadow-2xl border border-white/10"
                    />
                    <div className="text-center max-w-2xl">
                        <span className="inline-block text-xs font-bold text-purple-400 border border-purple-500/30 bg-purple-900/20 px-3 py-1 rounded-full mb-3">
                            {selectedImage.category}
                        </span>
                        <p className="text-slate-300 text-sm mb-4">{selectedImage.prompt}</p>
                        <a 
                            href={selectedImage.base64} 
                            download={`concept-${selectedImage.category.toLowerCase()}-${selectedImage.timestamp}.png`}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Download
                        </a>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default VisionBoard;
