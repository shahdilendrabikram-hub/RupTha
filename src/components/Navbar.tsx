import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Mic, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Package, 
  MapPin, 
  LogOut, 
  LogIn, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useHomepage } from '../context/HomepageContext';
import { useProduct } from '../context/ProductContext';
import { useCurrency } from '../context/CurrencyContext';
import { computeAutocomplete, SearchAutocompleteResults } from '../utils/searchEngine';
import { VoiceSearchModal } from './VoiceSearchModal';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, role, switchRole, logout, openAuthModal } = useAuth();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { config } = useHomepage();
  const { products, categories, brands } = useProduct();
  const { currency, toggleCurrency, formatPrice, exchangeRate, currencyConfig } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Compute live autocomplete
  const autocomplete: SearchAutocompleteResults = computeAutocomplete(
    searchQuery,
    products,
    categories,
    brands
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, customTerm?: string) => {
    if (e) e.preventDefault();
    const term = customTerm !== undefined ? customTerm : searchQuery;
    if (term.trim()) {
      setIsSearchFocused(false);
      onNavigate('shop', `q=${encodeURIComponent(term.trim())}`);
    }
  };

  const handleVoiceSearchResult = (text: string) => {
    setSearchQuery(text);
    handleSearchSubmit(undefined, text);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        {/* Top Announcement Bar */}
        {showAnnouncement && config.announcementText && (
          <div className="relative py-2 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white text-xs font-medium text-center">
            <div className="container mx-auto flex items-center justify-center gap-2 pr-6">
              <span>{config.announcementText}</span>
              {config.announcementLinkText && (
                <button
                  onClick={() => onNavigate('shop', 'sale=true')}
                  className="inline-flex items-center gap-1 underline underline-offset-2 font-bold hover:text-indigo-200 transition-colors cursor-pointer"
                >
                  {config.announcementLinkText} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Navbar */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                  <span className="font-extrabold text-xl tracking-tighter">R</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Ruptha Bazzar
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 -mt-1">
                    Marketplace
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Dynamic Categories Dropdown */}
            <div className="hidden xl:flex items-center">
              <div className="relative group">
                <button
                  onClick={() => onNavigate('shop')}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>All Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onNavigate('shop', `category=${cat.slug}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors text-sm text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <div className="flex items-center gap-3">
                        <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white leading-tight">{cat.name}</div>
                          <div className="text-[11px] text-slate-400">{cat.itemCount} items</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <button
                      onClick={() => onNavigate('shop')}
                      className="w-full text-center py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All Departments →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Search Bar with Autocomplete & Voice Search */}
            <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search products, brands (Nike, Sony, Apple), categories, SKU..."
                  className="w-full h-11 pl-11 pr-24 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

                {/* Clear / Voice Search Button */}
                <div className="absolute right-3 flex items-center gap-1.5">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    title="Voice Search"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Autocomplete Dropdown Popup */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                  {/* Typo tolerance 'Did you mean?' */}
                  {autocomplete.didYouMean && autocomplete.didYouMean !== searchQuery.toLowerCase() && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                      <span>Did you mean: <strong className="font-bold underline cursor-pointer" onClick={() => handleSearchSubmit(undefined, autocomplete.didYouMean!)}>{autocomplete.didYouMean}</strong>?</span>
                      <button
                        onClick={() => handleSearchSubmit(undefined, autocomplete.didYouMean!)}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Search instead
                      </button>
                    </div>
                  )}

                  {/* Quick Suggestions */}
                  {autocomplete.suggestedTerms.length > 0 && (
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Trending Searches
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {autocomplete.suggestedTerms.map(term => (
                          <button
                            key={term}
                            onClick={() => handleSearchSubmit(undefined, term)}
                            className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Products */}
                  {autocomplete.matchedProducts.length > 0 && (
                    <div className="p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Product Matches ({autocomplete.matchedProducts.length})
                      </div>
                      <div className="space-y-1">
                        {autocomplete.matchedProducts.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setIsSearchFocused(false);
                              onNavigate('product', p.slug);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors group"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {p.name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {p.brand} • <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatPrice(p.discountPrice || p.price)}</span>
                              </div>
                            </div>
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                              View →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Categories & Brands */}
                  {autocomplete.matchedCategories.length > 0 && (
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>In category: <strong className="text-slate-900 dark:text-white">{autocomplete.matchedCategories[0].name}</strong></span>
                      <button
                        onClick={() => handleSearchSubmit()}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Search All ({products.length}) Results
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Action Icons & User Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Role Switcher Pill: Admin / Customer quick toggle */}
              <button
                onClick={() => {
                  if (role === 'admin') {
                    switchRole('customer');
                    onNavigate('home');
                  } else {
                    switchRole('admin');
                    onNavigate('admin');
                  }
                }}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  role === 'admin'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'
                }`}
                title="Switch between Customer Experience and Admin Suite"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{role === 'admin' ? 'Admin Suite' : 'Customer View'}</span>
              </button>

              {/* Currency Switcher Pill (NPR नेपाली रुपैयाँ / USD) */}
              <button
                onClick={toggleCurrency}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500/50 text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
                title={`Currency: ${currencyConfig.name} (${currencyConfig.nativeName}). Click to toggle (1 USD = रू ${exchangeRate})`}
              >
                <span className="text-sm leading-none">{currencyConfig.flag}</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">{currencyConfig.symbol}</span>
                <span className="hidden sm:inline">{currency}</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Toggle light or dark theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist Button with Badge */}
              <button
                onClick={() => onNavigate('profile', 'tab=wishlist')}
                className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button with Count Badge & Subtotal */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 p-2 sm:px-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full sm:rounded-xl transition-colors"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Cart</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </button>

              {/* User Account / Profile Menu */}
              <div ref={userMenuRef} className="relative">
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full sm:rounded-xl transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}

                {/* Account Dropdown */}
                {isUserMenuOpen && user && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg">
                        <span>Tier: {user.membershipTier} Member</span>
                        <span>{user.rewardPoints} Pts</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('profile', 'tab=orders');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>My Orders & Tracking</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('profile', 'tab=profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Account Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('profile', 'tab=addresses');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Saved Addresses</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Secondary Category Ribbon */}
          <nav className="hidden md:flex items-center gap-6 py-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onNavigate('shop')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap ${
                currentView === 'shop' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => onNavigate('shop', 'isFlashSale=true')}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flash Deals ⚡</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate('shop', `category=${cat.slug}`)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => onNavigate('profile', 'tab=tracking')}
              className="ml-auto flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track My Package</span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400">Navigation</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('home');
                }}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-left text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('shop');
                }}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-left text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Shop Catalog
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('shop', 'isFlashSale=true');
                }}
                className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-left text-sm font-semibold text-amber-600 dark:text-amber-400"
              >
                Flash Sales ⚡
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-left text-sm font-semibold text-indigo-600 dark:text-indigo-400"
              >
                Admin Suite
              </button>
            </div>

            {/* Currency Selector inside Mobile Menu */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currencyConfig.flag}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {currencyConfig.name} ({currencyConfig.nativeName})
                  </div>
                  <div className="text-[10px] text-slate-500">
                    1 USD = रू {exchangeRate.toFixed(2)} NPR
                  </div>
                </div>
              </div>
              <button
                onClick={toggleCurrency}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Switch to {currency === 'NPR' ? 'USD ($)' : 'NPR (रू)'}
              </button>
            </div>

            <div className="font-bold text-xs uppercase tracking-wider text-slate-400 pt-2">Categories</div>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('shop', `category=${cat.slug}`);
                  }}
                  className="w-full text-left py-2 px-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-slate-400">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onResult={handleVoiceSearchResult}
      />
    </>
  );
};
