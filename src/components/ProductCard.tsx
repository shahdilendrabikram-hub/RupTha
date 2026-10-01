import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onProductClick: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onProductClick
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const inWishlist = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const savings = originalPrice ? originalPrice - price : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 1) {
      onQuickView(product);
    } else {
      addToCart(product, 1, product.variants?.[0]);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onProductClick(product.slug)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3.5">
        <img
          src={product.images[selectedImageIndex] || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Ribbon */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.discountPercentage && (
            <span className="px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] sm:text-xs rounded-full shadow-sm tracking-tight">
              -{product.discountPercentage}%
            </span>
          )}
          {product.isFlashSale && (
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full shadow-sm flex items-center gap-0.5 uppercase tracking-wide">
              <Zap className="w-2.5 h-2.5 fill-current" />
              Flash
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded-full shadow-sm uppercase tracking-wide">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Overlay on Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center justify-center transition-all duration-200 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={e => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 px-3 bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 backdrop-blur-md rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
            {product.name}
          </h3>

          {/* Variant Swatches (if available) */}
          {product.variants && product.variants.some(v => v.colorHex) && (
            <div className="flex items-center gap-1.5 mb-2.5">
              {product.variants
                .filter(v => v.colorHex)
                .slice(0, 4)
                .map((v, idx) => (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (v.image) {
                        const imgIdx = product.images.indexOf(v.image);
                        if (imgIdx !== -1) setSelectedImageIndex(imgIdx);
                      }
                    }}
                    title={v.color || 'Color option'}
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 transition-transform hover:scale-125 focus:ring-1 focus:ring-indigo-500"
                    style={{ backgroundColor: v.colorHex }}
                  />
                ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">+{product.variants.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Add to Cart Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-none">
                Save {formatPrice(savings)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 sm:px-3 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 hover:shadow-md transition-all active:scale-95"
            title="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
