import React, { useEffect, useState, useMemo } from 'react';
import { GamePlan, VisionImage, VisualPrompt } from '../types';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Download, 
  Maximize2, 
  X, 
  RefreshCw, 
  Check, 
  Layers, 
  User, 
  Box, 
  LayoutGrid, 
  SlidersHorizontal,
  Copy
} from 'lucide-react';

export type VisionCategory = 'Environment' | 'Character' | 'Prop' | 'UI';

interface VisionBoardProps {
  plan: GamePlan;
  images: VisionImage[];
  suggestedPrompts: VisualPrompt[];
  onFetchPrompts: (category?: string) => Promise<any> | void;
  onGenerateImage: (prompt: string, category: VisionCategory) => Promise<void>;
}

interface CategoryMeta {
  id: VisionCategory;
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  activeBtnClass: string;
  accentBorder: string;
  description: string;
}

const CATEGORY_CONFIG: Record<VisionCategory, CategoryMeta> = {
  Environment: {
    id: 'Environment',
    label: 'Environment',
    icon: Layers,
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    activeBtnClass: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/30',
    accentBorder: 'hover:border-emerald-500/50 hover:bg-emerald-950/20',
    description: 'Level biomes, vistas, volumetric fog & Lumen lighting'
  },
  Character: {
    id: 'Character',
    label: 'Character',
    icon: User,
    badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
    activeBtnClass: 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30',
    accentBorder: 'hover:border-purple-500/50 hover:bg-purple-950/20',
    description: 'Protagonists, bosses, NPCs & MetaHuman silhouettes'
  },
  Prop: {
    id: 'Prop',
    label: 'Prop',
    icon: Box,
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    activeBtnClass: 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/30',
    accentBorder: 'hover:border-amber-500/50 hover:bg-amber-950/20',
    description: 'Gameplay weapons, artifacts, terminals & Nanite meshes'
  },
  UI: {
    id: 'UI',
    label: 'UI',
    icon: LayoutGrid,
    badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    activeBtnClass: 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/30',
    accentBorder: 'hover:border-cyan-500/50 hover:bg-cyan-950/20',
    description: 'Diegetic HUDs, tactical gauges, codex & inventory frames'
  }
};

const VisionBoard: React.FC<VisionBoardProps> = ({ 
    plan, 
    images = [], 
    suggestedPrompts = [], 
    onFetchPrompts, 
    onGenerateImage 
}) => {
  const [activePrompt, setActivePrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState<VisionCategory>('Environment');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingCategory, setIsFetchingCategory] = useState(false);
  const [selectedImage, setSelectedImage] = useState<VisionImage | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<'All' | VisionCategory>('All');

  // Initial load: fetch suggestions for the default or all categories
  useEffect(() => {
    if ((suggestedPrompts || []).length === 0) {
      handleFetchCategoryPrompts('Environment');
    }
  }, []);

  // Filter AI suggestions by the currently selected category
  const categorySuggestions = useMemo(() => {
    return (suggestedPrompts || []).filter(p => {
      const pCat = (p.category || '').trim().toLowerCase();
      const targetCat = activeCategory.toLowerCase();
      return pCat === targetCat;
    });
  }, [suggestedPrompts, activeCategory]);

  const handleFetchCategoryPrompts = async (cat: VisionCategory) => {
    setIsFetchingCategory(true);
    try {
      await onFetchPrompts(cat);
    } catch (e) {
      console.error('Failed to fetch visual prompts for category', cat, e);
    } finally {
      setIsFetchingCategory(false);
    }
  };

  const handleCategoryChange = (cat: VisionCategory) => {
    setActiveCategory(cat);
    // Check if we already have suggestions for this category
    const hasPrompts = (suggestedPrompts || []).some(
      p => (p.category || '').trim().toLowerCase() === cat.toLowerCase()
    );
    if (!hasPrompts) {
      handleFetchCategoryPrompts(cat);
    }
  };

  const handleGenerate = async () => {
    if (!activePrompt || isGenerating) return;
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
    const matchedCategory = (['Environment', 'Character', 'Prop', 'UI'] as const).find(
      c => c.toLowerCase() === (p.category || '').toLowerCase()
    );
    if (matchedCategory) {
      setActiveCategory(matchedCategory);
    }
  };

  const handleCopyPrompt = (e: React.MouseEvent, promptText: string, idx: number) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(promptText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filter gallery images
  const filteredGalleryImages = useMemo(() => {
    if (galleryFilter === 'All') return images || [];
    return (images || []).filter(
      img => (img.category || '').toLowerCase() === galleryFilter.toLowerCase()
    );
  }, [images, galleryFilter]);

  const currentConfig = CATEGORY_CONFIG[activeCategory];
  const ActiveIcon = currentConfig.icon;

  return (
    <div className="flex h-full">
      {/* Left Sidebar: Studio Controls */}
      <div className="w-88 xl:w-96 border-r border-slate-800 bg-slate-900/60 flex flex-col p-5 overflow-y-auto shrink-0">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Art Director Studio
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
            UE5 Concept Engine
          </span>
        </div>
        
        {/* Custom Generator */}
        <div className="space-y-4 mb-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-300 font-bold block">
                Category
              </label>
              <span className="text-[10px] text-slate-500 italic">
                {currentConfig.description}
              </span>
            </div>

            {/* Category Selectors */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as VisionCategory[]).map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const Icon = cfg.icon;
                const isSelected = activeCategory === cat;
                const count = (suggestedPrompts || []).filter(
                  p => (p.category || '').toLowerCase() === cat.toLowerCase()
                ).length;

                return (
                  <button
                    key={cat}
                    id={`vision-category-btn-${cat.toLowerCase()}`}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-xs font-semibold py-2 px-3 rounded-lg border flex items-center justify-between transition-all ${
                      isSelected 
                        ? cfg.activeBtnClass 
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {cfg.label}
                    </span>
                    {count > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-slate-400 font-bold block">Prompt</label>
              {activePrompt && (
                <button 
                  onClick={() => setActivePrompt('')}
                  className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea 
              value={activePrompt}
              onChange={(e) => setActivePrompt(e.target.value)}
              placeholder={`Describe your vision for ${plan.title} (${activeCategory})...`}
              className="w-full h-28 bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none font-sans leading-relaxed"
            />
          </div>

          <button
            id="vision-generate-art-button"
            onClick={handleGenerate}
            disabled={isGenerating || !activePrompt.trim()}
            className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isGenerating || !activePrompt.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40' 
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                <span>Rendering UE5 Concept...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {activeCategory} Art</span>
              </>
            )}
          </button>
        </div>

        {/* Category AI Suggestions Section */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ActiveIcon className="w-3.5 h-3.5 text-purple-400" />
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {activeCategory} AI Suggestions
              </h4>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${currentConfig.badgeClass}`}>
                {categorySuggestions.length}
              </span>
            </div>

            <button
              id="vision-refresh-category-btn"
              onClick={() => handleFetchCategoryPrompts(activeCategory)}
              disabled={isFetchingCategory}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-purple-300 px-2 py-1 rounded-md hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all disabled:opacity-50"
              title={`Ask AI to generate fresh ${activeCategory} prompts`}
            >
              <RefreshCw className={`w-3 h-3 ${isFetchingCategory ? 'animate-spin text-purple-400' : ''}`} />
              <span>{isFetchingCategory ? 'Generating...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Suggestions List */}
          {isFetchingCategory && categorySuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center space-y-2.5">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <div className="text-xs font-semibold text-slate-300">
                Crafting {activeCategory} Prompts
              </div>
              <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed">
                Analyzing {plan.title} aesthetic & UE5 pipeline for {activeCategory.toLowerCase()} concepts...
              </p>
            </div>
          ) : categorySuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">
                No {activeCategory} suggestions found yet.
              </p>
              <button
                id="vision-fetch-category-empty-btn"
                onClick={() => handleFetchCategoryPrompts(activeCategory)}
                disabled={isFetchingCategory}
                className="px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate {activeCategory} Prompts
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {categorySuggestions.map((p, i) => {
                const isSelectedPrompt = activePrompt === p.prompt;
                return (
                  <div 
                    key={i}
                    onClick={() => handleUseSuggestion(p)}
                    className={`group cursor-pointer rounded-xl p-3 border transition-all relative ${
                      isSelectedPrompt
                        ? 'bg-purple-950/30 border-purple-500/80 shadow-md shadow-purple-950/40'
                        : `bg-slate-950/60 border-slate-800/80 ${currentConfig.accentBorder}`
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${currentConfig.badgeClass}`}>
                          {p.category}
                        </span>
                        {isSelectedPrompt && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleCopyPrompt(e, p.prompt, i)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                          title="Copy prompt"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <ArrowRight className={`w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5 ${
                          isSelectedPrompt ? 'text-purple-400' : ''
                        }`} />
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-200 group-hover:text-white mb-1 transition-colors">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                      {p.prompt}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Gallery */}
      <div className="flex-1 bg-[#0b0f19] p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Gallery Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>Concept Gallery</span>
                <span className="text-xs font-normal text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  {images.length} assets rendered
                </span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Visualizing environments, characters, props, and UI for <span className="text-slate-200 font-semibold">{plan.title}</span>
              </p>
            </div>

            {/* Gallery Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </span>
              {(['All', 'Environment', 'Character', 'Prop', 'UI'] as const).map((tab) => {
                const isSelected = galleryFilter === tab;
                const count = tab === 'All' 
                  ? images.length 
                  : images.filter(img => (img.category || '').toLowerCase() === tab.toLowerCase()).length;

                return (
                  <button
                    key={tab}
                    id={`gallery-filter-${tab.toLowerCase()}`}
                    onClick={() => setGalleryFilter(tab)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500/80 text-purple-200 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{tab}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-purple-900/60 text-purple-200' : 'bg-black/40 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empty Gallery State */}
          {images.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 text-center px-4">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/60">
                <ImageIcon className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-300 mb-1">Your concept canvas is empty</h3>
              <p className="text-slate-500 max-w-md text-xs leading-relaxed mb-4">
                Select a category on the left, pick an AI suggestion or write a custom prompt, and click "Generate Art" to visualize your game.
              </p>
              <button
                onClick={() => {
                  if (categorySuggestions.length > 0) {
                    handleUseSuggestion(categorySuggestions[0]);
                  }
                }}
                className="text-xs px-4 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-medium flex items-center gap-2 transition-all shadow-md shadow-purple-950/30"
              >
                <Sparkles className="w-3.5 h-3.5" /> Try First AI Suggestion
              </button>
            </div>
          )}

          {/* Filtered Empty State */}
          {images.length > 0 && filteredGalleryImages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 text-center px-4">
              <p className="text-slate-400 text-xs mb-2">
                No concepts generated yet in the <span className="font-semibold text-white">{galleryFilter}</span> category.
              </p>
              <button
                onClick={() => {
                  setActiveCategory(galleryFilter as VisionCategory);
                  setGalleryFilter('All');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 underline font-medium"
              >
                Switch Art Director to {galleryFilter} or view All
              </button>
            </div>
          )}

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGalleryImages.map((img) => {
              const catConfig = CATEGORY_CONFIG[img.category as VisionCategory] || CATEGORY_CONFIG.Environment;
              return (
                <div 
                  key={img.id} 
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl hover:border-slate-600 transition-all cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img.base64} 
                    alt={img.prompt} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md ${catConfig.badgeClass}`}>
                        {img.category}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(img);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md transition-colors"
                        title="Enlarge"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {img.prompt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-5xl w-full flex flex-col items-center justify-center gap-6">
            <img 
              src={selectedImage.base64} 
              alt={selectedImage.prompt} 
              className="max-h-[75vh] w-auto rounded-xl shadow-2xl border border-white/10 object-contain"
            />
            <div className="text-center max-w-2xl">
              <span className={`inline-block text-xs font-bold border px-3 py-1 rounded-full mb-3 ${
                (CATEGORY_CONFIG[selectedImage.category as VisionCategory] || CATEGORY_CONFIG.Environment).badgeClass
              }`}>
                {selectedImage.category}
              </span>
              <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed">
                {selectedImage.prompt}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setActivePrompt(selectedImage.prompt);
                    if (['Environment', 'Character', 'Prop', 'UI'].includes(selectedImage.category)) {
                      setActiveCategory(selectedImage.category as VisionCategory);
                    }
                    setSelectedImage(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-full border border-slate-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Use Prompt in Studio
                </button>
                <a 
                  href={selectedImage.base64} 
                  download={`concept-${(selectedImage.category || 'art').toLowerCase()}-${selectedImage.timestamp || Date.now()}.png`}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-slate-200 transition-colors shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" /> Download Asset
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionBoard;
