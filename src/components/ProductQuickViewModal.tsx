import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewDetails: (slug: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onViewDetails
}) => {
  if (!product) return null;

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    selectedVariant?.image || product.images[0]
  );
  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant?.price || product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.image) setSelectedImage(v.image);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Gallery View */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Selection */}
          <div className="flex flex-col">
            <div className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 mb-1 tracking-wider">
              {product.brand} • SKU: {selectedVariant?.sku || product.sku}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
              {product.name}
            </h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
              <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
              </span>
            </div>

            {/* Price Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl mb-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {product.discountPercentage && (
                <span className="ml-auto px-2 py-0.5 bg-rose-600 text-white font-extrabold text-xs rounded-full">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
              {product.shortDescription || product.description}
            </p>

            {/* Variants Selector: Color / Size */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 mb-5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Edition / Variant:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVariantSelect(v)}
                      className={`p-2 rounded-xl text-left border text-xs font-medium transition-all flex items-center gap-2 ${
                        selectedVariant?.id === v.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      <div className="truncate">
                        <div className="font-bold truncate">{v.name}</div>
                        <div className="text-[10px] text-slate-500">{formatPrice(v.price)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 mt-auto">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Buy Now with 1-Click
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onViewDetails(product.slug);
                  }}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Free delivery over {formatPrice(75)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
