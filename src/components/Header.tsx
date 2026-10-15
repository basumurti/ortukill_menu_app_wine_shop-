import React, { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { STORE_INFO } from '../data/initialMenu';
import logoImg from '../assets/images/ORTUKILLKEDIRI(2).png';

interface HeaderProps {
  totalCartItems?: number;
  totalCartPrice?: number;
  onOpenCart?: () => void;
  onOpenSheetsModal?: () => void;
  sheetsConfig?: any;
  isLoadingLive?: boolean;
  onRefreshProducts?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      style={{
        backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        backgroundColor: scrolled ? 'rgba(19,0,0,0.75)' : 'transparent',
        transition: 'background-color 300ms ease, backdrop-filter 300ms ease'
      }}
      className="relative z-20 w-full overflow-hidden"
    >
      {/* TOP ANNOUNCEMENT */}
      <div className="w-full bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white text-[11px] sm:text-xs py-1.5 px-4 border-b border-rose-900/30">
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center gap-1.5 truncate">
            <Truck className="w-3.5 h-3.5 text-rose-300" />

            <span className="tracking-wide font-semibold text-rose-100">
              {STORE_INFO.promoBanner}
            </span>
          </div>
        </div>
      </div>

      {/* FULL WIDTH HERO */}
      <div className="relative w-full overflow-hidden bg-[#120306]/80">
        {/* BACKGROUND GLOW */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[120%]
            h-[120%]
            rounded-full
            bg-rose-600/25
            blur-[100px]
            pointer-events-none
          "
        />

        {/* LOGO FULL WIDTH MENTOK KANAN KIRI */}
        <div
          className="relative w-full flex items-center justify-center will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        >
          <img
            src={logoImg}
            alt={STORE_INFO.name}
            className="
              w-full
              h-auto
              block
              select-none
              pointer-events-none
              drop-shadow-[0_20px_45px_rgba(244,63,94,0.65)]
            "
          />
        </div>

        {/* BOTTOM FADE */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-20
            bg-gradient-to-t
            from-[#120306]
            to-transparent
            pointer-events-none
          "
        />
      </div>
    </header>
  );
};
