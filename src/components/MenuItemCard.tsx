import React from 'react';
import { Product } from '../types/menu';
import { Plus, Minus, Check } from 'lucide-react';

interface MenuItemCardProps {
  product: Product;
  quantityInCart: number;
  useRedPrice: boolean;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  index?: number;
}

// iOS spring-like easing, close to UIKit's default spring curve
const IOS_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  product,
  quantityInCart,
  useRedPrice,
  onAddToCart,
  onRemoveFromCart,
  index
}) => {
  // Always use redPrice as requested by the user
  const displayPrice = product.redPrice ?? product.regularPrice;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Keep full product name matching Google Sheet (including volume such as 620ML, 330ML)
  const { displayName, displayAbv } = React.useMemo(() => {
    return {
      displayName: product.name,
      displayAbv: product.abv
    };
  }, [product.name, product.abv]);

  const isSelected = quantityInCart > 0;

  return (
    <div
      onClick={() => {
        if (!isSelected) {
          onAddToCart(product);
        }
      }}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
        transitionTimingFunction: IOS_SPRING,
        backdropFilter: 'blur(18px) saturate(1000%)',
        WebkitBackdropFilter: 'blur(18px) saturate(100%)'
      }}
      className={`group relative rounded-[28px] sm:rounded-[35px] px-3.5 sm:px-4 py-3 sm:py-3.5 flex flex-row items-center justify-between gap-2.5 sm:gap-4 md:gap-6 transition-all duration-300 select-none ${
        !isSelected ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${
        isSelected
          ? 'bg-[var(--card-tint-selected)] ring-1 ring-[var(--card-ring-selected)] shadow-[0_4px_14px_rgba(0,0,0,0.35)]'
          : 'bg-[var(--card-tint)] ring-1 ring-[var(--card-ring)] hover:bg-white/[0.16] shadow-[0_4px_14px_rgba(0,0,0,0.3)]'
      }`}
    >
      {/* Selected accessory — iOS-style checkmark circle */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 text-white stroke-[3]" />
        </div>
      )}

      {/* Left: Title + ABV tag */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
        <span
          className={`text-[13px] sm:text-[15px] md:text-[16px] leading-snug sm:leading-tight tracking-[-0.01em] line-clamp-2 sm:truncate transition-colors ${
            isSelected ? 'text-[var(--text-primary)] font-semibold' : 'text-white/90 font-medium'
          }`}
          title={displayName}
        >
          {displayName}
        </span>

        {displayAbv && (
          <span
            className={`shrink-0 text-[10px] sm:text-[11px] font-medium tabular-nums px-1.5 py-[1px] rounded-md ${
              isSelected
                ? 'bg-wine-500/25 text-wine-100'
                : 'bg-white/10 text-[var(--text-muted)]'
            }`}
          >
            {displayAbv}
          </span>
        )}
      </div>

      {/* Right: Price + Stepper */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
        <div
          className={`text-[12.5px] sm:text-[14px] md:text-[15px] font-semibold tabular-nums tracking-[-0.01em] transition-colors whitespace-nowrap ${
            isSelected ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          {formatRupiah(displayPrice)}
        </div>

        {!isSelected ? (
          // iOS "+" affordance — plain filled circle with brand accent
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            style={{ transitionTimingFunction: IOS_SPRING }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white flex items-center justify-center shadow-sm active:scale-90 transition-all duration-200 shrink-0 cursor-pointer"
            aria-label="Tambah Pesanan"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          </button>
        ) : (
          // iOS UIStepper-style pill: minus | count | plus, hairline dividers
          <div className="flex items-center h-7 sm:h-8 rounded-full bg-black/35 overflow-hidden shrink-0 ring-1 ring-[var(--card-ring-selected)]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromCart(product);
              }}
              style={{ transitionTimingFunction: IOS_SPRING }}
              className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-wine-100 active:bg-white/10 active:scale-90 transition-all duration-150 cursor-pointer"
              aria-label="Kurangi Jumlah"
            >
              <Minus className="w-3 sm:w-3.5 h-3 sm:h-3.5 stroke-[3]" />
            </button>

            <span className="w-5 sm:w-6 text-center text-xs sm:text-[13px] font-semibold tabular-nums text-white border-x border-white/10">
              {quantityInCart}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              style={{ transitionTimingFunction: IOS_SPRING }}
              className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-wine-100 active:bg-white/10 active:scale-90 transition-all duration-150 cursor-pointer"
              aria-label="Tambah Jumlah"
            >
              <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};