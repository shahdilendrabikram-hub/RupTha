import React, { useState } from 'react';
import { 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  CheckCircle2 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for your 15% discount voucher.', 'success');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Value Proposition Ribbon */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-950/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400">On all qualifying orders over {formatPrice(75)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Genuine Guarantee</h4>
                <p className="text-xs text-slate-400">Direct authorized brand partner items</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-400">Hassle-free refunds & prepaid labels</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400">Instant expert concierge service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md font-extrabold text-xl">
                R
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Ruptha Bazzar
              </span>
            </button>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Ruptha Bazzar is a premier multi-category destination engineered for modern individuals who appreciate aesthetic mastery, performance tech, and enduring quality.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                Join the Ruptha Bazzar Insider Circle
              </div>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome to the circle! Check your email for {formatPrice(20)} off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-10 pl-10 pr-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column: Departments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Catalog
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'category=electronics')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Electronics & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'category=footwear')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Footwear & Sneakers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'category=fashion')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Apparel & Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'category=home')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Home & Minimal Living
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'isFlashSale=true')}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Flash Deals ⚡
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Customer Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('profile', 'tab=tracking')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Track an Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile', 'tab=orders')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Order History & Invoices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile', 'tab=returns')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile', 'tab=rewards')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Ruptha Bazzar Loyalty Points
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile', 'tab=coupons')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Coupons & Promos
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Administration & Apps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform & Apps
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('admin')}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border border-slate-700"
              >
                <span>Admin Suite</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Manage</span>
              </button>

              <div className="text-[11px] text-slate-400">Mobile Apps (PWA Ready)</div>
              <div className="flex flex-col gap-2">
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-2.5 text-xs text-white">
                  <div className="text-lg">🍎</div>
                  <div>
                    <div className="text-[9px] uppercase text-slate-400">Download on</div>
                    <div className="font-bold leading-tight">Apple App Store</div>
                  </div>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-2.5 text-xs text-white">
                  <div className="text-lg">🤖</div>
                  <div>
                    <div className="text-[9px] uppercase text-slate-400">Get it on</div>
                    <div className="font-bold leading-tight">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright and Payment Badges */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Ruptha Bazzar International Inc. All rights reserved. Designed for scale.
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-slate-300">VISA</span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-slate-300">MC</span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-slate-300">AMEX</span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-slate-300">Apple Pay</span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-slate-300">Google Pay</span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-slate-300">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
