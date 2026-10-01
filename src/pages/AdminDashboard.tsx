import React, { useState } from 'react';
import { 
  Package, 
  Layers, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  ImageIcon, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  RotateCcw,
  Sliders,
  X
} from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import { useHomepage } from '../context/HomepageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { Product, ProductVariant, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import { AdminImageSearchModal } from '../components/AdminImageSearchModal';

interface AdminDashboardProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useProduct();
  const { config, updateConfig, toggleSection, reorderSection, updateSectionTitle, updateHeroSlide, resetToDefault } = useHomepage();
  const { role, switchRole } = useAuth();
  const { showToast } = useToast();
  const { currency, setCurrency, exchangeRate, setExchangeRate, formatPrice, currencyConfig } = useCurrency();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'homepage' | 'orders'>('products');

  // Product Manager State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Image Search Modal Trigger State
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [imageSearchTargetField, setImageSearchTargetField] = useState<'product_gallery' | 'hero_slide'>('product_gallery');
  const [imageSearchQuery, setImageSearchQuery] = useState('');

  // Editing Product Form Data
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('electronics');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState(99.99);
  const [formDiscountPrice, setFormDiscountPrice] = useState(79.99);
  const [formStock, setFormStock] = useState(25);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formIsFlashSale, setFormIsFlashSale] = useState(false);
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);

  // Orders state
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Open Product Edit Modal
  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsCreatingProduct(false);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormSku(p.sku);
    setFormPrice(p.price);
    setFormDiscountPrice(p.discountPrice || p.price);
    setFormStock(p.stock);
    setFormShortDesc(p.shortDescription);
    setFormDesc(p.description);
    setFormImages([...p.images]);
    setFormIsFlashSale(!!p.isFlashSale);
    setFormVariants(p.variants ? JSON.parse(JSON.stringify(p.variants)) : []);
  };

  const openCreateProduct = () => {
    setEditingProduct(null);
    setIsCreatingProduct(true);
    setFormName('');
    setFormBrand('Ruptha Bazzar');
    setFormCategory('electronics');
    setFormSku(`RB-${Math.floor(100 + Math.random() * 900)}`);
    setFormPrice(99.99);
    setFormDiscountPrice(79.99);
    setFormStock(30);
    setFormShortDesc('');
    setFormDesc('');
    setFormImages([]);
    setFormIsFlashSale(false);
    setFormVariants([]);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku) return;

    const imagesToSave = formImages.length > 0 ? formImages : [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ];

    const discountPercentage = formPrice > formDiscountPrice
      ? Math.round(((formPrice - formDiscountPrice) / formPrice) * 100)
      : undefined;

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: formName,
        brand: formBrand,
        category: formCategory,
        sku: formSku,
        price: Number(formPrice),
        discountPrice: Number(formDiscountPrice),
        discountPercentage,
        stock: Number(formStock),
        shortDescription: formShortDesc,
        description: formDesc,
        images: imagesToSave,
        isFlashSale: formIsFlashSale,
        variants: formVariants
      });
      setEditingProduct(null);
    } else {
      await addProduct({
        name: formName,
        productCode: `RUPTHA-${Math.floor(1000 + Math.random() * 9000)}`,
        brand: formBrand,
        category: formCategory,
        subcategory: 'General',
        sku: formSku,
        price: Number(formPrice),
        discountPrice: Number(formDiscountPrice),
        discountPercentage,
        taxRate: 0.08,
        stock: Number(formStock),
        shortDescription: formShortDesc,
        description: formDesc,
        images: imagesToSave,
        variants: formVariants,
        specifications: { 'Warranty': '1 Year Standard', 'Condition': 'Brand New' },
        tags: [formBrand.toLowerCase(), formCategory.toLowerCase()],
        searchKeywords: [formName.toLowerCase()],
        warranty: '1-Year Ruptha Bazzar Guarantee',
        shippingInfo: 'Standard 3-5 days delivery',
        returnPolicy: '30-day returns'
      });
      setIsCreatingProduct(false);
    }
  };

  // Trigger Google Image Search
  const handleOpenGoogleImageSearch = () => {
    const q = formName || `${formBrand} ${formCategory}` || 'Running shoes';
    setImageSearchQuery(q);
    setImageSearchTargetField('product_gallery');
    setIsImageSearchOpen(true);
  };

  const handleSelectedImagesFromGoogle = (urls: string[]) => {
    setFormImages(prev => [...prev, ...urls]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Add Variant helper
  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      sku: `${formSku}-VAR-${formVariants.length + 1}`,
      name: `Variant ${formVariants.length + 1}`,
      size: 'Standard',
      color: 'Default',
      price: formDiscountPrice || formPrice,
      stock: 10
    };
    setFormVariants([...formVariants, newVariant]);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {
      // local
    }
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} status changed to ${newStatus}`, 'success');
  };

  // Filter products for manager table
  const displayedProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl space-y-8">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-black">Ruptha Bazzar Operations & Admin Suite</h1>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full uppercase">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live product catalog control, dynamic Google image search ingestion, and homepage builder.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Storefront View
          </button>
          <button
            onClick={() => {
              switchRole('customer');
              onNavigate('home');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Switch to Customer
          </button>
        </div>
      </div>

      {/* Nepali Currency Conversion & Exchange Rate Bar */}
      <div className="p-4 bg-gradient-to-r from-red-500/10 via-indigo-500/10 to-blue-500/10 border border-indigo-200 dark:border-indigo-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            🇳🇵
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Store Currency: Nepali Rupee (NPR - रू)</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-extrabold text-[10px] rounded-full">Active</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Conversion Rate: 1 USD = रू {exchangeRate.toFixed(2)} NPR • All store prices dynamically converted to Nepali currency
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Rate (रू per $1):</label>
          <input
            type="number"
            value={exchangeRate}
            onChange={e => setExchangeRate(Number(e.target.value))}
            className="w-20 h-8 px-2 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border rounded-lg"
            step="0.5"
          />
          <button
            onClick={() => showToast(`Exchange rate updated: 1 USD = रू ${exchangeRate} NPR`, 'success')}
            className="px-3 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Save Rate
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2 pb-2">
        {[
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'homepage', label: 'Dynamic Homepage Builder', icon: Layers },
          { id: 'orders', label: `Orders & Logistics (${orders.length})`, icon: ShoppingBag },
          { id: 'analytics', label: 'Store Analytics', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products by SKU, brand, name..."
                className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={openCreateProduct}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Catalog Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Discount</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Variants</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-slate-400">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">{p.sku}</td>
                      <td className="p-4 capitalize">{p.category}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatPrice(p.discountPrice || p.price)}
                        </span>
                        {p.discountPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock > 10
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                        }`}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="p-4 text-[11px] text-slate-500">
                        {p.variants?.length || 0} variant(s)
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC HOMEPAGE BUILDER */}
      {activeTab === 'homepage' && (
        <div className="space-y-8">
          
          {/* Announcement Bar Settings */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              1. Top Announcement Bar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Text</label>
                <input
                  type="text"
                  value={config.announcementText}
                  onChange={e => updateConfig({ announcementText: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Button Link Text</label>
                <input
                  type="text"
                  value={config.announcementLinkText}
                  onChange={e => updateConfig({ announcementLinkText: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Hero Slider Slides Editor */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                2. Hero Slider Slides ({config.heroSlides.length})
              </h3>
            </div>

            <div className="space-y-4">
              {config.heroSlides.map((slide, idx) => (
                <div key={slide.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Slide #{idx + 1}: {slide.title}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={slide.title}
                      onChange={e => updateHeroSlide(slide.id, { title: e.target.value })}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={slide.subtitle}
                      onChange={e => updateHeroSlide(slide.id, { subtitle: e.target.value })}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={slide.imageUrl}
                      onChange={e => updateHeroSlide(slide.id, { imageUrl: e.target.value })}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl font-mono text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Tag / Pill"
                      value={slide.tag}
                      onChange={e => updateHeroSlide(slide.id, { tag: e.target.value })}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Re-orderable & Toggleable Homepage Sections */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  3. Homepage Sections Layout & Visibility
                </h3>
                <p className="text-xs text-slate-400">
                  Reorder sections or toggle them on/off instantly without editing code.
                </p>
              </div>
              <button
                onClick={resetToDefault}
                className="px-3 py-1.5 text-xs text-rose-500 hover:underline font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Layout</span>
              </button>
            </div>

            <div className="space-y-2">
              {[...config.sections]
                .sort((a, b) => a.order - b.order)
                .map((sec, idx, arr) => (
                  <div
                    key={sec.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      sec.enabled
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                        : 'bg-slate-100/50 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-mono font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{sec.title}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                          Type: {sec.type}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => reorderSection(sec.id, 'up')}
                        className="p-1.5 rounded-lg border hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        disabled={idx === arr.length - 1}
                        onClick={() => reorderSection(sec.id, 'down')}
                        className="p-1.5 rounded-lg border hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Visibility */}
                      <button
                        onClick={() => toggleSection(sec.id)}
                        className={`p-1.5 rounded-lg border flex items-center gap-1 text-xs font-semibold ${
                          sec.enabled
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-500/30'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-500/30'
                        }`}
                      >
                        {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{sec.enabled ? 'Enabled' : 'Hidden'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ORDERS & LOGISTICS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Change Status</th>
                    <th className="p-4 text-right">Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                        {o.orderNumber}
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {o.shippingAddress.recipientName}
                        </div>
                        <div className="text-[10px] text-slate-400">{o.shippingAddress.city}, {o.shippingAddress.state}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {formatPrice(o.total)}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold text-[10px] uppercase">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="h-8 px-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs font-semibold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onNavigate('tracking', o.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                        >
                          Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(142890.40)}</div>
            <div className="text-xs text-emerald-600 font-semibold">+18.4% from last month</div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Total Orders</span>
              <ShoppingBag className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">1,842</div>
            <div className="text-xs text-indigo-600 font-semibold">99.4% fulfillment rate</div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Active Products</span>
              <Package className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{products.length}</div>
            <div className="text-xs text-slate-400">Across {categories.length} departments</div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Customers</span>
              <Users className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">6,420</div>
            <div className="text-xs text-cyan-600 font-semibold">+340 joined this week</div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {(editingProduct || isCreatingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsCreatingProduct(false);
              }}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Nike Air Max Pulse"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    placeholder="e.g. NK-AMP-001"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <span>Regular Price ($)</span>
                    {formPrice > 0 && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold normal-case">
                        {formatPrice(formPrice)}
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <span>Sale Price ($)</span>
                    {formDiscountPrice > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold normal-case">
                        {formatPrice(formDiscountPrice)}
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formDiscountPrice}
                    onChange={e => setFormDiscountPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Dynamic Google Image Search Ingestion Section */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
                      Product Media Gallery ({formImages.length})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenGoogleImageSearch}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Search Google / Licensed Images API</span>
                  </button>
                </div>

                {formImages.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                    No images added yet. Click the button above to search Google images or enter URL.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border">
                        <img src={img} alt="Product media" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1 bg-black/70 text-white text-[9px] font-bold rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variants Matrix */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Product Variants Matrix ({formVariants.length})</span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Variant</span>
                  </button>
                </div>

                {formVariants.map((v, i) => (
                  <div key={v.id || i} className="grid grid-cols-4 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Variant Name"
                      value={v.name}
                      onChange={e => {
                        const copy = [...formVariants];
                        copy[i].name = e.target.value;
                        setFormVariants(copy);
                      }}
                      className="h-8 px-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Color or Size"
                      value={v.color || v.size || ''}
                      onChange={e => {
                        const copy = [...formVariants];
                        copy[i].color = e.target.value;
                        setFormVariants(copy);
                      }}
                      className="h-8 px-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={v.price}
                      onChange={e => {
                        const copy = [...formVariants];
                        copy[i].price = Number(e.target.value);
                        setFormVariants(copy);
                      }}
                      className="h-8 px-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Stock"
                        value={v.stock}
                        onChange={e => {
                          const copy = [...formVariants];
                          copy[i].stock = Number(e.target.value);
                          setFormVariants(copy);
                        }}
                        className="h-8 px-2 bg-white dark:bg-slate-900 border rounded-lg text-xs w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setFormVariants(formVariants.filter((_, idx) => idx !== i))}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Short Summary
                </label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={e => setFormShortDesc(e.target.value)}
                  placeholder="One sentence value proposition..."
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Detailed architectural & design specifications..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Image Search Modal */}
      <AdminImageSearchModal
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
        defaultQuery={imageSearchQuery}
        onSelectImages={handleSelectedImagesFromGoogle}
      />

    </div>
  );
};
