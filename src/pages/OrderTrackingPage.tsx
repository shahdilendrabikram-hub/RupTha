import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Search, 
  RotateCcw, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

interface OrderTrackingPageProps {
  orderId?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId, onNavigate }) => {
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();
  const [searchCode, setSearchCode] = useState(orderId || 'RUPTHA-2026-9081');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  const fetchOrder = async (queryCode: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(queryCode.trim())}`);
      if (res && res.ok && typeof res.json === 'function') {
        const data = await res.json();
        setCurrentOrder(data);
      } else {
        // Fallback from initial seeded orders
        const match = INITIAL_ORDERS.find(
          o => o.id === queryCode || o.orderNumber === queryCode || o.trackingNumber === queryCode ||
               (queryCode.startsWith('BOKA-') && o.orderNumber === queryCode.replace('BOKA-', 'RUPTHA-'))
        );
        if (match) {
          setCurrentOrder(match);
        } else {
          showToast('Could not find order with provided reference', 'error');
        }
      }
    } catch {
      const match = INITIAL_ORDERS.find(
        o => o.id === queryCode || o.orderNumber === queryCode || o.trackingNumber === queryCode
      );
      if (match) setCurrentOrder(match);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      fetchOrder('RUPTHA-2026-9081');
    }
  }, [orderId]);

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder || !returnReason) return;

    try {
      await fetch(`/api/orders/${currentOrder.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: returnReason })
      });
      setCurrentOrder({ ...currentOrder, returnRequested: true, returnReason });
      showToast('Return request submitted! Prepaid label generated.', 'success');
      setShowReturnModal(false);
    } catch {
      showToast('Return request recorded', 'info');
      setShowReturnModal(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl space-y-8">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Real-Time Order Tracking</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your Ruptha Bazzar Order ID (e.g. RUPTHA-2026-9081) or Courier Tracking Number
            </p>
          </div>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            fetchOrder(searchCode);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              placeholder="Order Number or Tracking ID..."
              className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {loading ? 'Searching...' : 'Track Package'}
          </button>
        </form>
      </div>

      {/* Tracking Details View */}
      {currentOrder && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-50/70 to-slate-50/70 dark:from-indigo-950/30 dark:to-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-950/40">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Order #{currentOrder.orderNumber}
                </span>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  {formatPrice(currentOrder.total)}
                </span>
                <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                  {currentOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Tracking: {currentOrder.trackingNumber} • Carrier: {currentOrder.carrier}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400 font-semibold">Estimated Arrival:</div>
              <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                {currentOrder.estimatedDelivery}
              </div>
            </div>
          </div>

          {/* Return status alert if submitted */}
          {currentOrder.returnRequested && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong>Return Initiated:</strong> "{currentOrder.returnReason}". A return label has been emailed to your account.
              </div>
            </div>
          )}

          {/* Visual Milestone Timeline */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Journey Milestones
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {currentOrder.trackingEvents.map((evt, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Pin Circle */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      evt.completed
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {evt.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {evt.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {evt.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {evt.description}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Items & Delivery Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* Items */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                Items in This Shipment ({currentOrder.items.length})
              </h4>
              <div className="space-y-3">
                {currentOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Qty: {item.quantity} • {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Address */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                Destination Address
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white">
                  {currentOrder.shippingAddress.recipientName}
                </div>
                <div>{currentOrder.shippingAddress.street} {currentOrder.shippingAddress.apartment}</div>
                <div>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}</div>
                <div className="text-slate-400 pt-1">Phone: {currentOrder.shippingAddress.phone}</div>
              </div>

              {/* Return / Support action buttons */}
              <div className="mt-4 flex gap-2">
                {!currentOrder.returnRequested && (
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-700 hover:border-slate-400 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Request Return / Refund</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Initiate Return Request
            </h3>
            <p className="text-xs text-slate-500">
              Ruptha Bazzar offers 30-day hassle-free returns with prepaid return shipping labels.
            </p>
            <form onSubmit={handleReturnSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Reason for Return
                </label>
                <select
                  required
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="">Select a reason...</option>
                  <option value="Fit or size not as expected">Fit or size not as expected</option>
                  <option value="Changed mind / Ordered by mistake">Changed mind / Ordered by mistake</option>
                  <option value="Item defective or not working">Item defective or not working</option>
                  <option value="Different from pictures/description">Different from pictures/description</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
                >
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
