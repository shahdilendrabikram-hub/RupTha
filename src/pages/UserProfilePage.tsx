import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Package, 
  Heart, 
  Sparkles, 
  Tag, 
  RotateCcw, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  Lock,
  Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { INITIAL_COUPONS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductCard } from '../components/ProductCard';

interface UserProfilePageProps {
  initialTab?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ initialTab = 'orders', onNavigate }) => {
  const { user, updateProfile, addAddress, deleteAddress, setDefaultAddress, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState(initialTab.replace('tab=', '') || 'orders');

  // Personal Info Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // New Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrName, setAddrName] = useState('Home');
  const [recipient, setRecipient] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('');

  // Security password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Please sign in to view your dashboard</h2>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, phone, avatar });
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !street || !city || !postalCode) return;
    await addAddress({
      name: addrName,
      recipientName: recipient,
      phone: addrPhone,
      street,
      city,
      state,
      postalCode,
      country: 'United States',
      isDefault: false,
      type: 'home'
    });
    setIsAddingAddress(false);
    setStreet('');
    setCity('');
    setPostalCode('');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) return;
    showToast('Password updated successfully', 'success');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl space-y-8">
      
      {/* Profile Header */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-extrabold text-[10px] rounded-full uppercase">
                {user.membershipTier} Member
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email} • Member since {user.createdAt}</p>
            <div className="mt-2 flex items-center gap-3 justify-center sm:justify-start text-xs font-semibold">
              <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {user.rewardPoints} Reward Points
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('shop')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Shop Now
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Tabbed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs (Left 3 cols) */}
        <aside className="lg:col-span-3 bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          {[
            { id: 'orders', label: 'Order History & Tracking', icon: Package },
            { id: 'profile', label: 'Personal Information', icon: UserIcon },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, icon: Heart },
            { id: 'rewards', label: 'Loyalty & Reward Points', icon: Sparkles },
            { id: 'coupons', label: 'Coupons & Vouchers', icon: Tag },
            { id: 'security', label: 'Account Security', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel (Right 9 cols) */}
        <main className="lg:col-span-9 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* TAB 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Recent Orders & Shipments
                </h3>
                <span className="text-xs text-slate-400">2 Orders on file</span>
              </div>

              {/* Order Cards */}
              <div className="space-y-4">
                {[
                  {
                    id: 'ord-9081',
                    orderNumber: 'RUPTHA-2026-9081',
                    date: 'Yesterday, 10:15 AM',
                    status: 'In Transit (Priority Courier)',
                    total: 181.43,
                    items: [
                      { name: 'Nike Air Max Pulse 2026', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80', qty: 1, price: 149.99 },
                      { name: 'Ruptha Bazzar Heavyweight Oversized Cotton Tee', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80', qty: 1, price: 38.00 }
                    ]
                  },
                  {
                    id: 'ord-8102',
                    orderNumber: 'RUPTHA-2026-8102',
                    date: 'Sep 18, 2026',
                    status: 'Delivered Securely',
                    total: 323.99,
                    items: [
                      { name: 'Sony WH-1000XM5 Wireless ANC Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80', qty: 1, price: 329.99 }
                    ]
                  }
                ].map(ord => (
                  <div key={ord.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Order #{ord.orderNumber}
                        </span>
                        <div className="text-[11px] text-slate-400">Placed on {ord.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full">
                          {ord.status}
                        </span>
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img src={it.img} alt={it.name} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{it.name}</div>
                            <div className="text-[11px] text-slate-400">Qty: {it.qty} • {formatPrice(it.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <button
                        onClick={() => onNavigate('tracking', ord.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Live Package Tracking</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Personal Information */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b pb-3">
                Edit Personal Profile
              </h3>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-800/50 border rounded-xl text-xs font-semibold opacity-70"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                />
              </div>
              <button
                type="submit"
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Address Book ({user.addresses.length})
                </h3>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleSaveNewAddress} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border space-y-3">
                  <h4 className="font-bold text-xs">New Address Form</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Home, Office)"
                      value={addrName}
                      onChange={e => setAddrName(e.target.value)}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Recipient Name"
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 text-xs text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map(addr => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{addr.name}</span>
                        {addr.isDefault ? (
                          <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[10px] text-indigo-600 font-bold hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{addr.recipientName}</div>
                      <div className="text-xs text-slate-500 mt-1">{addr.street} {addr.apartment}</div>
                      <div className="text-xs text-slate-500">{addr.city}, {addr.state} {addr.postalCode}</div>
                      <div className="text-xs text-slate-400 mt-1">{addr.phone}</div>
                    </div>

                    <div className="pt-3 border-t mt-3 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b pb-4">
                Saved Wishlist Items ({wishlist.length})
              </h3>
              {wishlist.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Heart className="w-12 h-12 mx-auto mb-2 opacity-50 stroke-1" />
                  <p className="text-sm font-semibold">Your wishlist is empty</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={() => {}}
                      onProductClick={slug => onNavigate('product', slug)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Loyalty & Rewards */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-200">
                    Ruptha Bazzar VIP Club
                  </div>
                  <h3 className="font-display text-3xl font-black mt-1">
                    {user.rewardPoints} Reward Points
                  </h3>
                  <p className="text-xs text-amber-100 mt-1">
                    Worth <strong>{formatPrice((user.rewardPoints / 100) * 5)}</strong> off on your next purchase
                  </p>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Status</span>
                  <span className="text-lg font-black">{user.membershipTier} Member</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  How Rewards Work
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">1 Point per {formatPrice(1)}</div>
                    <div className="text-slate-500">Earn points on every item purchased across all categories.</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">100 Points = {formatPrice(5)}</div>
                    <div className="text-slate-500">Redeem points directly on the cart or checkout drawer.</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">VIP Priority</div>
                    <div className="text-slate-500">Gold & Platinum members unlock early access to drops.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Coupons Wallet */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b pb-4">
                Available Promotional Coupons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_COUPONS.map(c => (
                  <div
                    key={c.code}
                    className="p-5 rounded-2xl border bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full">
                          Valid
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">{c.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t text-[11px] text-slate-400">
                      <span>Expires: {c.expiresAt}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(c.code);
                          showToast(`Copied ${c.code}`, 'success');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Security */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-lg">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b pb-4">
                Security & Authentication
              </h3>

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Change Password</h4>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
                <input
                  type="password"
                  placeholder="New Strong Password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Update Password
                </button>
              </form>

              <div className="pt-4 border-t flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Two-Factor Authentication (SMS/OTP)</div>
                  <div className="text-[11px] text-slate-500">Require an SMS code when signing in from an unknown device.</div>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    twoFactorEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
