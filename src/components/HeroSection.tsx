import React from 'react';
import { STORE_INFO } from '../data/initialMenu';
import { Flame } from 'lucide-react';
import heroBannerImg from '../assets/images/ortukill_hero_banner_1790250232337.jpg';

interface HeroSectionProps {
  useRedPrice: boolean;
  onToggleRedPrice: () => void;
  totalProductsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  useRedPrice,
  onToggleRedPrice,
  totalProductsCount
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-900/40 bg-[#19060a] shadow-2xl my-4 mx-4 sm:mx-6">
      {/* Background Hero Image with Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0 opacity-30 bg-cover bg-center mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000"
        style={{ backgroundImage: `url("${heroBannerImg}")` }}
      />
      
      {/* Radial Gradient Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-900/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 px-5 py-8 sm:p-10 max-w-4xl">
        {/* Kicker Tag */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 backdrop-blur-md">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 fill-rose-500" />
          <span className="tracking-wider">OFFICIAL DIGITAL PRICE LIST & DIRECT ORDER</span>
        </div>

        {/* Title */}
        <h1 className="font-cinzel font-black text-xl sm:text-3xl md:text-4xl lg:text-5xl text-rose-50 tracking-wide leading-tight mb-2 sm:mb-3">
          {STORE_INFO.name}
        </h1>

        {/* Tagline Prose */}
        <p className="text-rose-200/90 text-xs sm:text-sm md:text-base max-w-2xl font-normal leading-relaxed">
          {STORE_INFO.tagline}. Pesan minuman favoritmu secara cepat &amp; praktis dengan total harga terhitung otomatis. Langsung checkout ke WhatsApp CS!
        </p>
      </div>
    </div>
  );
};
