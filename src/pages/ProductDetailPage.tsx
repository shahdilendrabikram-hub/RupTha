import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Sparkles
} from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductVariant } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { getProductBySlug, products, addReview } = useProduct();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const { currency, formatPrice, exchangeRate } = useCurrency();

  const product = getProductBySlug(slug) || products[0];

  const inWishlist = isInWishlist(product.id);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    selectedVariant?.image || product.images[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'shipping'>('desc');

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Frequently bought together bundle checkbox
  const [includeBundleItem, setIncludeBundleItem] = useState(true);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const price = selectedVariant?.price || product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const savings = originalPrice ? originalPrice - price : 0;

  // Frequently bought together companion product
  const companionProduct = products.find(p => p.id !== product.id && (product.frequentlyBoughtWith?.includes(p.id) || true));
  const companionPrice = companionProduct ? (companionProduct.discountPrice || companionProduct.price) : 0;
  const bundleTotalPrice = price + (includeBundleItem && companionProduct ? companionPrice : 0);

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.image) setSelectedImage(v.image);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    setIsCartOpen(true);
  };

  const handleAddBundleToCart = () => {
    addToCart(product, 1, selectedVariant);
    if (includeBundleItem && companionProduct) {
      addToCart(companionProduct, 1, companionProduct.variants?.[0]);
    }
    showToast('Bundle added to your cart!', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    addReview(product.id, {
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true
    });

    setReviewTitle('');
    setReviewComment('');
    setIsSubmittingReview(false);
  };

  // Related items
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-semibold text-slate-400 flex items-center gap-2">
        <button onClick={() => onNavigate('home')} className="hover:text-indigo-600">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('shop', `category=${product.category}`)} className="hover:text-indigo-600 capitalize">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Top Section: Gallery + Purchase Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Gallery Showcase (Left - 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.discountPercentage && (
                <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-full shadow-md">
                  -{product.discountPercentage}% OFF
                </span>
              )}
              {product.isFlashSale && (
                <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-md uppercase tracking-wider">
                  Flash Deal
                </span>
              )}
            </div>

            {/* Wishlist and Share Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  inWishlist
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-rose-500'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 backdrop-blur-md shadow-md transition-colors"
                title="Share product link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Order Panel (Right - 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              <span>{product.brand}</span>
              <span className="text-slate-400 font-mono">SKU: {selectedVariant?.sku || product.sku}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings and Reviews Summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                ({product.reviewCount} verified ratings)
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Read Reviews
              </button>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-slate-100/70 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {savings > 0 && (
                <span className="ml-auto px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/20">
                  Save {formatPrice(savings)}
                </span>
              )}
            </div>
            {currency === 'NPR' && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <span>🇳🇵 Nepali Currency (NPR)</span>
                <span>•</span>
                <span>≈ ${price.toFixed(2)} USD (at 1 USD = रू {exchangeRate} NPR)</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <span>Color & Edition:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold normal-case">
                  {selectedVariant?.name || 'Default'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleVariantSelect(v)}
                    className={`p-2.5 rounded-2xl text-left border text-xs font-medium transition-all flex items-center gap-2.5 ${
                      selectedVariant?.id === v.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-slate-300"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <div className="truncate flex-1">
                      <div className="font-bold truncate">{v.name}</div>
                      <div className="text-[11px] text-slate-400">{formatPrice(v.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>In Stock • Ready to dispatch immediately from Bay Area Hub</span>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-12 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-sm text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-12 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Direct Buy Now */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-sm font-extrabold shadow-md transition-all text-center cursor-pointer"
            >
              Instant 1-Click Checkout
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{product.shippingInfo}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{product.returnPolicy}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{product.warranty}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Frequently Bought Together Bundle */}
      {companionProduct && (
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Frequently Bought Together</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Product 1 */}
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{formatPrice(price)}</div>
                </div>
              </div>

              <Plus className="w-5 h-5 text-slate-400 shrink-0" />

              {/* Product 2 */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBundleItem}
                  onChange={e => setIncludeBundleItem(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <img
                  src={companionProduct.images[0]}
                  alt={companionProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{companionProduct.name}</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{formatPrice(companionPrice)}</div>
                </div>
              </label>
            </div>

            {/* Total and Bundle Action */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400">Bundle Price:</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {formatPrice(bundleTotalPrice)}
                </div>
              </div>
              <button
                onClick={handleAddBundleToCart}
                className="py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                Add Both to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section: Description, Specifications, Reviews, Shipping */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-4 sm:gap-8">
          {[
            { id: 'desc', label: 'Full Description' },
            { id: 'specs', label: 'Specifications & Matrix' },
            { id: 'reviews', label: `Reviews (${product.reviews?.length || product.reviewCount})` },
            { id: 'shipping', label: 'Shipping & Returns' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="space-y-4 max-w-3xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>{product.description}</p>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">Authenticity Guaranteed</h4>
                <p className="text-xs text-slate-500">Every Ruptha Bazzar order is inspected and accompanied by an official serialization authenticity certificate.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">Responsible Materials</h4>
                <p className="text-xs text-slate-500">Packaging consists of 100% recyclable, FSC-certified cardboard printed with water-based soy inks.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications Table */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white w-1/3">Brand</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{product.brand}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Product Code / SKU</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono">{product.sku} ({product.productCode})</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Department</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 capitalize">{product.category} / {product.subcategory}</td>
                </tr>
                {Object.entries(product.specifications || {}).map(([key, value], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? '' : 'bg-slate-50 dark:bg-slate-900/50'}>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{key}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Customer Feedback
              </h3>

              {(!product.reviews || product.reviews.length === 0) ? (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center text-xs text-slate-400">
                  Be the first to review "{product.name}"!
                </div>
              ) : (
                product.reviews.map(r => (
                  <div
                    key={r.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">{r.date}</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {r.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {r.comment}
                    </p>

                    <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{r.userName}</span>
                      {r.verifiedPurchase && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          • Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>Write a Product Review</span>
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    placeholder="e.g. Incredible audio clarity & battery"
                    className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Detailed Comments
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Describe your tactile experience, comfort, aesthetics..."
                    className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  Submit Review
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Tab 4: Shipping & Returns */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h4 className="font-bold text-slate-900 dark:text-white">Shipping Protocol</h4>
            <p>{product.shippingInfo}</p>
            <h4 className="font-bold text-slate-900 dark:text-white pt-2">Return Policy</h4>
            <p>{product.returnPolicy}</p>
            <h4 className="font-bold text-slate-900 dark:text-white pt-2">Warranty Claim Procedure</h4>
            <p>{product.warranty}</p>
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Related Curations
            </h2>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={() => {}}
                onProductClick={slug => onNavigate('product', slug)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
