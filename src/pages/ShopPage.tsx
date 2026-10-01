import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Star, 
  Grid, 
  List, 
  RotateCcw, 
  Check, 
  Sparkles,
  Zap,
  ArrowUpDown
} from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { Product } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { findDidYouMean } from '../utils/searchEngine';

interface ShopPageProps {
  initialQuery?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialQuery = '', onNavigate }) => {
  const { products, categories, brands } = useProduct();
  const { formatPrice } = useCurrency();

  // Parse initial query params if passed (e.g., 'category=footwear' or 'q=nike')
  const initialParams = useMemo(() => {
    const params = new URLSearchParams(initialQuery);
    return {
      q: params.get('q') || '',
      category: params.get('category') || 'all',
      brand: params.get('brand') || 'all',
      isFlashSale: params.get('isFlashSale') === 'true' || params.get('sale') === 'true',
      sort: params.get('sort') || 'featured'
    };
  }, [initialQuery]);

  const [searchTerm, setSearchTerm] = useState(initialParams.q);
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialParams.brand !== 'all' ? [initialParams.brand] : []
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [flashSaleOnly, setFlashSaleOnly] = useState(initialParams.isFlashSale);
  const [sortBy, setSortBy] = useState(initialParams.sort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state when initialQuery changes
  useEffect(() => {
    setSearchTerm(initialParams.q);
    setSelectedCategory(initialParams.category);
    setSelectedBrands(initialParams.brand !== 'all' ? [initialParams.brand] : []);
    setFlashSaleOnly(initialParams.isFlashSale);
  }, [initialParams]);

  // Typo tolerance "Did you mean"
  const didYouMean = useMemo(() => {
    if (!searchTerm || searchTerm.length < 3) return null;
    return findDidYouMean(searchTerm);
  }, [searchTerm]);

  const toggleBrand = (brandSlug: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandSlug)
        ? prev.filter(b => b !== brandSlug)
        : [...prev, brandSlug]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(2000);
    setMinRating(0);
    setInStockOnly(false);
    setFlashSaleOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedBrands.length > 0 ||
    minPrice > 0 ||
    maxPrice < 2000 ||
    minRating > 0 ||
    inStockOnly ||
    flashSaleOnly;

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(p => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.searchKeywords.some(k => k.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        p => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p =>
        selectedBrands.some(b => b.toLowerCase() === p.brand.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= minPrice && price <= maxPrice;
    });

    // Rating filter
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Flash sale filter
    if (flashSaleOnly) {
      result = result.filter(p => p.isFlashSale);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else {
      // featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    flashSaleOnly,
    sortBy
  ]);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner / Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1">
            <span>Home</span> / <span className="text-slate-800 dark:text-slate-200">Catalog</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Browse Products</span>
            {flashSaleOnly && (
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-full uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                Flash Sales
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredProducts.length} curated item(s) ready for instant dispatch
          </p>
        </div>

        {/* View Toggle & Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-10 pl-8 pr-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Drops</option>
            </select>
          </div>

          {/* Grid vs List View */}
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-400'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Typo Correction Banner */}
      {didYouMean && didYouMean !== searchTerm.toLowerCase() && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              Showing results for "<strong>{searchTerm}</strong>". Did you mean:{' '}
              <button
                onClick={() => setSearchTerm(didYouMean)}
                className="font-bold underline text-indigo-600 dark:text-indigo-400 ml-1"
              >
                {didYouMean}
              </button>
              ?
            </span>
          </div>
          <button
            onClick={() => setSearchTerm(didYouMean)}
            className="px-2.5 py-1 bg-amber-200 dark:bg-amber-900/60 rounded-lg font-bold text-[11px]"
          >
            Search with suggestion
          </button>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1">Active Filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Query: "{searchTerm}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </span>
          )}
          {selectedBrands.map(b => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            >
              Brand: {b}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(b)} />
            </span>
          ))}
          {flashSaleOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Flash Deals
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFlashSaleOnly(false)} />
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {minRating}★ & above
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Facets + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Facets */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 sticky top-28">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              <span>Faceted Navigation</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-500 hover:underline font-bold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search Term inside sidebar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Filter by Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Categories Facet */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.slug
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[11px] text-slate-400">{c.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands Facet */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Brands
            </label>
            <div className="space-y-2">
              {brands.map(brand => {
                const isChecked = selectedBrands.includes(brand.name);
                return (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(brand.name)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="flex-1">{brand.name}</span>
                    <span className="text-[10px] text-slate-400">({brand.productCount})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Max Price
              </label>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="20"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{formatPrice(20)}</span>
              <span>{formatPrice(1000)}</span>
              <span>{formatPrice(2000)}+</span>
            </div>
          </div>

          {/* Ratings Filter */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Minimum Rating
            </label>
            <div className="space-y-1.5">
              {[4.5, 4.0, 3.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                    minRating === rating
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span>{rating} Stars & Above</span>
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock & Flash Deal Toggles */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>In-Stock Items Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={flashSaleOnly}
                onChange={e => setFlashSaleOnly(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span className="font-semibold text-amber-600 dark:text-amber-400">Flash Deals Only ⚡</span>
            </label>
          </div>

        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn't find items matching your exact filter criteria. Try clearing some filters or searching for generic terms like "Nike", "Sony", or "Headphones".
              </p>
              <button
                onClick={clearAllFilters}
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={setQuickViewProduct}
                  onProductClick={slug => onNavigate('product', slug)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

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
