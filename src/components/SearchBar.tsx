import React from 'react';
import { Search, X, SlidersHorizontal, Camera } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'name';
  onSortChange: (sort: 'popular' | 'price-asc' | 'price-desc' | 'name') => void;
  onOpenVerticalMenu?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenVerticalMenu
}) => {
  return (
    <div className="relative z-30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 px-4 sm:px-6 my-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari minuman (misal: Anggur Merah, Singaraja, Iceland, Kawa Kawa...)"
          className="w-full pl-10 pr-10 py-3 bg-[#240309] border-2 border-rose-600/70 rounded-2xl text-xs sm:text-sm text-white placeholder-rose-300/60 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-lg font-medium opacity-100"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-300 hover:text-white p-1 rounded-full hover:bg-rose-900/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Controls: Copy to PNG & Sort Dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Tombol Copy to PNG */}
        <button
          type="button"
          onClick={onOpenVerticalMenu}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 text-white font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-rose-950/60 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap border-2 border-rose-400/80"
          title="Tampilkan Menu Vertikal & Copy to PNG"
        >
          <Camera className="w-4 h-4 stroke-[2.5]" />
          <span>Copy to PNG</span>
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-rose-300 shrink-0 hidden sm:inline" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            style={{ backgroundColor: '#85002d' }}
            className="bg-[#85002d] opacity-100 border-2 border-rose-400 text-xs sm:text-sm text-white rounded-2xl px-3.5 py-3 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/40 font-bold shadow-xl cursor-pointer hover:bg-[#990034] transition-colors"
          >
            <option value="popular" className="bg-[#24040a] text-white py-1">Urutkan: Terpopuler</option>
            <option value="price-asc" className="bg-[#24040a] text-white py-1">Harga: Terendah &rarr; Tertinggi</option>
            <option value="price-desc" className="bg-[#24040a] text-white py-1">Harga: Tertinggi &rarr; Terendah</option>
            <option value="name" className="bg-[#24040a] text-white py-1">Nama: A &rarr; Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};
