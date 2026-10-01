import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Clock, 
  Copy, 
  Check, 
  Star, 
  ShieldCheck, 
  Truck, 
  TrendingUp,
  Award
} from 'lucide-react';
import { useHomepage } from '../context/HomepageContext';
import { useProduct } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { config } = useHomepage();
  const { products, categories, brands } = useProduct();
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Live Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    if (!config.heroSlides || config.heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % config.heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [config.heroSlides]);

  const copyCouponCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  // Filter products for various sections
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 4);
  const trendingProducts = products.filter(p => p.trending).slice(0, 8);
  const bestSellerProducts = products.filter(p => p.bestSeller || p.rating >= 4.8).slice(0, 8);
  const newArrivals = products.filter(p => p.isNewArrival || !p.featured).slice(0, 4);

  // Sort sections by order
  const activeSections = [...config.sections]
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const activeSlide = config.heroSlides[activeSlideIndex] || config.heroSlides[0];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Dynamic Sections Loop */}
      {activeSections.map(section => {
        switch (section.type) {
          
          // 1. HERO SLIDER
          case 'hero_slider':
            if (!activeSlide) return null;
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8 pt-4">
                <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${activeSlide.bgGradient || 'from-slate-900 to-indigo-950'} text-white shadow-2xl min-h-[460px] md:min-h-[520px] flex items-center`}>
                  
                  {/* Background overlay & artwork */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none" />
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 w-full">
                    {/* Left Copy */}
                    <div className="lg:col-span-7 space-y-4 text-left">
                      {activeSlide.tag && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider text-cyan-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{activeSlide.tag}</span>
                        </div>
                      )}

                      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-xl">
                        {activeSlide.title}
                      </h1>

                      <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                        {activeSlide.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-3">
                        <button
                          onClick={() => onNavigate('shop')}
                          className="py-3.5 px-7 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group cursor-pointer"
                        >
                          <span>{activeSlide.buttonText || 'Shop Collection'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {activeSlide.badgeText && (
                          <div className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-amber-300">
                            {activeSlide.badgeText}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Hero Image Card */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                        <img
                          src={activeSlide.imageUrl}
                          alt={activeSlide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  {config.heroSlides.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveSlideIndex(prev => (prev === 0 ? config.heroSlides.length - 1 : prev - 1))
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors z-20"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveSlideIndex(prev => (prev + 1) % config.heroSlides.length)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors z-20"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Dots Indicators */}
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                        {config.heroSlides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              activeSlideIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>
            );

          // 2. FEATURED CATEGORIES
          case 'categories':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                    {section.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">{section.subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All Categories</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onNavigate('shop', `category=${cat.slug}`)}
                      className="group p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {cat.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {cat.itemCount} Items
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );

          // 3. FLASH SALE
          case 'flash_sale':
            if (flashSaleProducts.length === 0) return null;
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-indigo-500/10 rounded-3xl border border-amber-500/20">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-md">
                        <Flame className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                            {section.title}
                          </h2>
                          <span className="px-2.5 py-0.5 bg-rose-600 text-white font-extrabold text-[11px] rounded-full uppercase tracking-wider">
                            Save up to 40%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{section.subtitle}</p>
                      </div>
                    </div>

                    {/* Countdown Clock */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Deals Expire In:</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-center">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </div>
                        <span className="font-bold text-slate-400">:</span>
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </div>
                        <span className="font-bold text-slate-400">:</span>
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {flashSaleProducts.map(p => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onQuickView={setQuickViewProduct}
                        onProductClick={slug => onNavigate('product', slug)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );

          // 4. PROMOTIONAL BANNERS
          case 'promotional_banners':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {config.promoBanners.map(banner => (
                    <div
                      key={banner.id}
                      onClick={() => onNavigate('shop')}
                      className={`relative rounded-3xl overflow-hidden p-6 text-white shadow-xl cursor-pointer group bg-gradient-to-br ${banner.bgClass} flex flex-col justify-between min-h-[220px]`}
                    >
                      <div className="relative z-10 space-y-1">
                        <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wide">
                          {banner.badge}
                        </span>
                        <h3 className="text-xl font-bold font-display pt-2 group-hover:translate-x-1 transition-transform">
                          {banner.title}
                        </h3>
                        <p className="text-xs text-white/80">{banner.subtitle}</p>
                      </div>

                      <div className="relative z-10 pt-4 flex items-center gap-1 text-xs font-bold underline underline-offset-4 group-hover:text-cyan-300 transition-colors">
                        <span>Shop Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>

                      {/* Side Artwork */}
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="absolute right-0 bottom-0 w-36 h-36 object-cover rounded-tl-3xl opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            );

          // 5. TRENDING PRODUCTS
          case 'trending':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Popular This Week</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Explore All</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trendingProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={setQuickViewProduct}
                      onProductClick={slug => onNavigate('product', slug)}
                    />
                  ))}
                </div>
              </section>
            );

          // 6. BEST SELLERS
          case 'best_sellers':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                      <Award className="w-4 h-4" />
                      <span>Customer Favorites</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                    {section.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">{section.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {bestSellerProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={setQuickViewProduct}
                      onProductClick={slug => onNavigate('product', slug)}
                    />
                  ))}
                </div>
              </section>
            );

          // 7. AUTHORIZED BRANDS
          case 'brands':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">{section.subtitle}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {brands.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => onNavigate('shop', `brand=${brand.slug}`)}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-2 group"
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {brand.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{brand.productCount} Items</span>
                    </button>
                  ))}
                </div>
              </section>
            );

          // 8. SPECIAL OFFERS & COUPONS
          case 'special_offers':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="p-8 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div>
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider">
                        VIP Coupons
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-black mt-3">
                        Instant Savings at Checkout
                      </h3>
                      <p className="text-xs text-slate-300 mt-2">
                        Click any coupon code below to copy directly to your clipboard and apply at checkout.
                      </p>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { code: 'RUPTHA20', desc: `20% Off All Orders Over ${formatPrice(100)}`, tag: 'Most Popular' },
                        { code: 'WELCOME10', desc: '10% Welcome Bonus on First Purchase', tag: 'New Members' },
                        { code: 'FLASH50', desc: `${formatPrice(50)} Instant Discount on ${formatPrice(300)}+`, tag: 'Big Spender' }
                      ].map(c => (
                        <div
                          key={c.code}
                          className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-amber-300">
                              {c.tag}
                            </span>
                            <div className="text-xs text-slate-200 mt-1 leading-snug">{c.desc}</div>
                          </div>

                          <button
                            onClick={() => copyCouponCode(c.code)}
                            className="w-full py-2 px-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            {copiedCoupon === c.code ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{c.code}</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );

          // 9. CUSTOMER REVIEWS
          case 'customer_reviews':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">{section.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Marcus Vance',
                      role: 'Verified Buyer',
                      rating: 5,
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                      comment: 'The Sony WH-1000XM5 headphones arrived within 24 hours in pristine tamper-sealed packaging. Audio depth is breathtaking.',
                      item: 'Sony WH-1000XM5 Headphones'
                    },
                    {
                      name: 'Elena Rostova',
                      role: 'Verified Buyer',
                      rating: 5,
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                      comment: 'The Nike Air Max Pulse fits like a glove. Solid arch support and vibrant crimson colorway. Ruptha Bazzar has earned a customer for life.',
                      item: 'Nike Air Max Pulse 2026'
                    },
                    {
                      name: 'David Chen',
                      role: 'Verified Buyer',
                      rating: 5,
                      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
                      comment: 'The minimalist oak desk was assembled in 10 minutes flat. Solid European wood with an unbelievable silky finish.',
                      item: 'Minimalist Solid Oak Desk'
                    }
                  ].map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.name}
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{rev.role} • {rev.item}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          // 10. BLOG / NEWS
          case 'blog':
            return (
              <section key={section.id} className="container mx-auto px-4 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">{section.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'The Evolution of Active Noise Cancellation in 2026',
                      category: 'Sound Architecture',
                      date: 'Sep 26, 2026',
                      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
                      readTime: '4 min read'
                    },
                    {
                      title: 'Why 280 GSM Organic Cotton Redefines the Daily T-Shirt',
                      category: 'Material Science',
                      date: 'Sep 21, 2026',
                      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
                      readTime: '3 min read'
                    },
                    {
                      title: 'Designing Biophilic Workspaces with European White Oak',
                      category: 'Living Spaces',
                      date: 'Sep 15, 2026',
                      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
                      readTime: '5 min read'
                    }
                  ].map((post, idx) => (
                    <div
                      key={idx}
                      className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                            {post.category}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewDetails={slug => {
          setQuickViewProduct(null);
          onNavigate('product', slug);
        }}
      />
    </div>
  );
};
