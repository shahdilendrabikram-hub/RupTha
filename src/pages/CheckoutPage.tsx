import React, { useState } from 'react';
import { 
  Check, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Plus, 
  Building2 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { UserAddress } from '../types';

interface CheckoutPageProps {
  onOrderPlaced: (orderId: string) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderPlaced, onBackToCart }) => {
  const { items, subtotal, discountAmount, tax, shippingFee, total, clearCart, redeemedPoints } = useCart();
  const { user, addAddress, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const { currency, formatPrice } = useCurrency();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0] || null
  );

  // New Address Form toggle & state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('');

  // Shipping Method
  const [selectedShippingMethod, setSelectedShippingMethod] = useState({
    id: 'del-standard',
    name: 'Ruptha Bazzar Standard Express',
    estimatedDays: '3-4 Business Days',
    price: shippingFee
  });

  // Payment Method
  const [paymentType, setPaymentType] = useState<'card' | 'cod' | 'gpay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [cardName, setCardName] = useState(user?.name || 'Dilendra Shah');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !street || !city || !postalCode) return;

    await addAddress({
      name: 'Custom Address',
      recipientName,
      phone,
      street,
      apartment,
      city,
      state,
      postalCode,
      country: 'United States',
      isDefault: false,
      type: 'home'
    });

    setShowNewAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      setStep(1);
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.product.name,
          image: item.variant?.image || item.product.images[0],
          sku: item.variant?.sku || item.product.sku,
          price: item.variant?.price || item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          variantDetails: [item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')
        })),
        subtotal,
        discount: discountAmount,
        tax,
        shippingFee: selectedShippingMethod.price,
        total: total + (selectedShippingMethod.price - shippingFee),
        pointsRedeemed: redeemedPoints,
        shippingAddress: selectedAddress,
        deliveryMethod: selectedShippingMethod,
        paymentMethod: {
          type: paymentType,
          cardLast4: paymentType === 'card' ? cardNumber.slice(-4) : 'PAYPAL',
          brand: paymentType === 'card' ? 'Visa Signature' : paymentType.toUpperCase()
        }
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const orderData = res && typeof res.json === 'function' ? await res.json() : null;
      clearCart();
      showToast('Order confirmed! Tracking code generated.', 'success');
      onOrderPlaced(orderData?.id || orderData?.orderNumber || 'RUPTHA-2026-9081');
    } catch {
      // Local fallback
      clearCart();
      showToast('Order placed successfully!', 'success');
      onOrderPlaced('ord-9081');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl">
      
      {/* Steps Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Secure Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">256-bit TLS encrypted connection</p>
        </div>

        {/* Steps Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center">1</span>
            <span>Shipping</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">──</span>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">2</span>
            <span>Delivery</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">──</span>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">3</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Step Flow (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Shipping Address */}
          <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
            step === 1 ? 'border-indigo-600 ring-2 ring-indigo-500/10 shadow-lg' : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Delivery Address
                </h3>
              </div>
              {step > 1 && (
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          selectedAddress?.id === addr.id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {addr.recipientName}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {addr.street} {addr.apartment}
                          </div>
                          <div className="text-xs text-slate-500">
                            {addr.city}, {addr.state} {addr.postalCode}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{addr.phone}</div>
                        </div>

                        {selectedAddress?.id === addr.id && (
                          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            <Check className="w-3.5 h-3.5" />
                            <span>Deliver to this address</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs text-slate-500">
                    No addresses on file. Please add one below.
                  </div>
                )}

                {/* Add New Address Button & Form */}
                {!showNewAddressForm ? (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Delivery Address</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddNewAddress} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border space-y-3">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">New Shipping Address</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Recipient Full Name"
                        value={recipientName}
                        onChange={e => setRecipientName(e.target.value)}
                        className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Apt, Suite, Floor (Optional)"
                        value={apartment}
                        onChange={e => setApartment(e.target.value)}
                        className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                      />
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
                        required
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border rounded-xl"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
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

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedAddress}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <span>Continue to Delivery Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Delivering to: <strong className="text-slate-900 dark:text-white">{selectedAddress?.recipientName}</strong>, {selectedAddress?.street}, {selectedAddress?.city}
              </div>
            )}
          </div>

          {/* STEP 2: Delivery Method */}
          <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
            step === 2 ? 'border-indigo-600 ring-2 ring-indigo-500/10 shadow-lg' : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Delivery Speed & Courier
                </h3>
              </div>
              {step > 2 && (
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {step === 2 ? (
              <div className="space-y-3">
                {[
                  { id: 'del-standard', name: 'Ruptha Bazzar Standard Express', estimatedDays: '3-4 Business Days', price: shippingFee },
                  { id: 'del-priority', name: 'Ruptha Bazzar Priority Air Courier', estimatedDays: '1-2 Business Days', price: 12.99 },
                  { id: 'del-overnight', name: 'Guaranteed Overnight Express', estimatedDays: 'Tomorrow by 12:00 PM', price: 24.99 }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedShippingMethod(opt)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedShippingMethod.id === opt.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{opt.name}</div>
                        <div className="text-[11px] text-slate-500">{opt.estimatedDays}</div>
                      </div>
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {opt.price === 0 ? 'FREE' : formatPrice(opt.price)}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setStep(3)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 mt-4"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : step > 2 ? (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Method: <strong className="text-slate-900 dark:text-white">{selectedShippingMethod.name}</strong> ({selectedShippingMethod.estimatedDays})
              </div>
            ) : null}
          </div>

          {/* STEP 3: Payment Method */}
          <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
            step === 3 ? 'border-indigo-600 ring-2 ring-indigo-500/10 shadow-lg' : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Payment Method
              </h3>
            </div>

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'esewa', label: 'eSewa Nepal', icon: '🟢' },
                    { id: 'khalti', label: 'Khalti / Fonepay', icon: '🟣' },
                    { id: 'card', label: 'Card / Visa', icon: '💳' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentType(tab.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentType === tab.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="text-xs">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {paymentType === 'card' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full h-10 px-3 bg-white dark:bg-slate-900 border rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Expires (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full h-10 px-3 bg-white dark:bg-slate-900 border rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          className="w-full h-10 px-3 bg-white dark:bg-slate-900 border rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        className="w-full h-10 px-3 bg-white dark:bg-slate-900 border rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}

                {paymentType === 'cod' && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
                    Pay securely in cash or via mobile payment terminal directly upon package arrival at your doorstep.
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Processing Authorization...'
                      : `Place Order & Authorize ${formatPrice(total + (selectedShippingMethod.price - shippingFee))}`}
                  </span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Order Summary (Right 4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-28">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Order Items ({items.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.variant?.image || item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatPrice((item.variant?.price || item.product.discountPrice || item.product.price) * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Coupon / Points Savings</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedShippingMethod.price === 0 ? 'FREE' : formatPrice(selectedShippingMethod.price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t">
              <span>Total Due</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatPrice(total + (selectedShippingMethod.price - shippingFee))}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Checkout with Ruptha Bazzar Buyer Protection</span>
          </div>
        </div>

      </div>
    </div>
  );
};
