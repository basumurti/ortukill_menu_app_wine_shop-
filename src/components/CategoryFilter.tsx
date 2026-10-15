import React from 'react';
import { CATEGORIES } from '../data/initialMenu';
import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  categories?: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  hasCartItems?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  hasCartItems = false
}) => {
  const categoryList = categories && categories.length > 0 ? categories : CATEGORIES;
  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 max-w-[94vw] sm:max-w-2xl w-auto pointer-events-auto ${
        hasCartItems ? 'bottom-20 md:bottom-6' : 'bottom-5'
      }`}
    >
      {/* Floating Island Capsule Container - Lapisan z-30 (di bawah pop up modal) */}
      <div className="bg-[#cacaca]/90 backdrop-blur-2xl border-2 border-red-600 shadow-2xl shadow-black/80 rounded-full p-2 px-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar ring-2 ring-red-500/40">
        {/* Category Label Icon */}
        <div className="flex items-center gap-1.5 pl-1 pr-2.5 text-rose-950 font-extrabold text-xs shrink-0 border-r border-stone-400">
          <Layers className="w-3.5 h-3.5 text-rose-700" />
          <span className="hidden sm:inline text-[11px] uppercase font-mono tracking-wider text-rose-950">Kategori:</span>
        </div>

        {/* Horizontal Category Pills */}
        <div className="flex items-center gap-1.5 min-w-max py-0.5">
          {categoryList.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'SEMUA' ? categoryCounts['ALL'] || 0 : categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ease-out flex items-center gap-1.5 whitespace-nowrap active:scale-95 transform-gpu cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/60 border border-amber-300/80 scale-105 backdrop-blur-md ring-2 ring-rose-500/40 glow-red'
                    : 'text-stone-800 hover:text-black hover:bg-stone-300/80 border border-transparent hover:border-stone-400/50'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-price font-extrabold transition-all duration-300 ${
                    isSelected
                      ? 'bg-black/30 backdrop-blur-sm text-amber-200 border border-amber-300/40'
                      : 'bg-stone-300/90 text-stone-900 border border-stone-400/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

