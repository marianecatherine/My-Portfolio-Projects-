import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Clock, MapPin, Sparkles, Printer } from 'lucide-react';
import { CartItem, OrderType, PastOrder } from '../types/pastry';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  orderType: OrderType;
  pickupTime: string;
  discount: number;
  onClearCart: () => void;
  onViewOrderHistory?: () => void;
  onEarnPoints?: (earned: number) => void;
  onOpenRewards?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  orderType,
  pickupTime,
  discount,
  onClearCart,
  onViewOrderHistory,
  onEarnPoints,
  onOpenRewards,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bakerNotes, setBakerNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [earnedPointsState, setEarnedPointsState] = useState(0);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, cartItem) => {
    const packagingSurcharge = cartItem.packaging === 'Luxury Gift Box (+€3.00)' ? 3.0 : 0;
    return acc + (cartItem.item.price + packagingSurcharge) * cartItem.quantity;
  }, 0);

  const deliveryFee = orderType === 'delivery' ? 4.50 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const pointsEarned = Math.floor(total * 10);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = `RM-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderReference(randomRef);
    setEarnedPointsState(pointsEarned);

    // Save to localStorage for order history persistence
    const completedOrder: PastOrder = {
      id: randomRef,
      createdAt: new Date().toISOString(),
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      orderType,
      pickupTime,
      deliveryAddress: orderType === 'delivery' ? address : undefined,
      bakerNotes: bakerNotes || undefined,
      items: [...cart],
      subtotal,
      discount,
      deliveryFee,
      total,
      status: 'Baking in Hearth',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('reelmark_pastry_orders') || '[]');
      localStorage.setItem(
        'reelmark_pastry_orders',
        JSON.stringify([completedOrder, ...existing])
      );
    } catch (err) {
      console.error('Failed to persist order to localStorage', err);
    }

    if (onEarnPoints && pointsEarned > 0) {
      onEarnPoints(pointsEarned);
    }

    setIsSubmitted(true);
    onClearCart();
  };

  const handleDone = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-[#DAE7C7] p-6 sm:p-8 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDone}
          aria-label="Close checkout"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F5F8EF] text-[#5E5E61]"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-[#08482D]" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#08482D]">
                Confirm Order & Reserve Hearth Batch
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#101410]">
              {orderType === 'pickup' ? 'Boutique Pick-up Reservation' : 'Local Courier Delivery'}
            </h3>
            <p className="text-xs text-[#5E5E61] mt-1">
              {orderType === 'pickup'
                ? `Reserved for collection at ${pickupTime} today at Reelmark Soho Atelier.`
                : 'Freshly packed in insulated thermal bakery box for delivery.'}
            </p>

            {/* Quick Summary of items */}
            <div className="mt-4 p-3 bg-[#F5F8EF] rounded-xl border border-[#DAE7C7] max-h-36 overflow-y-auto divide-y divide-[#DAE7C7]/60 text-xs">
              {cart.map((ci, i) => (
                <div key={i} className="py-1.5 flex justify-between items-center">
                  <span className="font-medium text-[#101410]">
                    {ci.quantity}× {ci.item.name}
                  </span>
                  <span className="font-mono tabular-nums text-[#08482D] font-bold">
                    €{((ci.item.price + (ci.packaging === 'Luxury Gift Box (+€3.00)' ? 3 : 0)) * ci.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 flex justify-between font-bold text-sm text-[#101410]">
                <span>Total Due</span>
                <span className="font-mono text-[#08482D]">€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmitOrder} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#101410] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Charlotte Dubois"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DAE7C7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08482D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#101410] mb-1">Email for Receipt *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="charlotte@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DAE7C7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08482D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101410] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-4821"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DAE7C7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08482D]"
                  />
                </div>
              </div>

              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-[#101410] mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, Apartment / Suite, Zip Code"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DAE7C7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08482D]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#101410] mb-1">
                  Baker Note / Dietary Request (Optional)
                </label>
                <input
                  type="text"
                  value={bakerNotes}
                  onChange={(e) => setBakerNotes(e.target.value)}
                  placeholder="e.g. Please pack tarts separately, birthday ribbon requested"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#DAE7C7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08482D]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#EBF3E2] text-[#08482D] text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Pay upon pick-up or delivery with Contactless Apple Pay, Card, or Cash.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#08482D] hover:bg-[#053320] text-white font-bold rounded-full text-sm shadow-md transition-all active:scale-98"
              >
                Place Reservation & Hold Pastries (€{total.toFixed(2)})
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#DAE7C7] flex items-center justify-center mx-auto text-[#08482D] animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F8EF] border border-[#DAE7C7] text-xs font-mono font-bold text-[#08482D]">
              ORDER REF: {orderReference}
            </div>

            <h3 className="font-display text-3xl font-bold text-[#101410]">
              Pastry Order Confirmed!
            </h3>

            <p className="text-sm text-[#5E5E61] max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[#101410]">{name}</strong>! Your batch is now marked on our hearth baking rack.
              A confirmation receipt and live tracking pin have been sent to <strong className="text-[#101410]">{email}</strong>.
            </p>

            <div className="p-4 bg-[#F5F8EF] rounded-2xl border border-[#DAE7C7] text-xs text-left space-y-2 text-[#101410]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#08482D]" />
                <span>
                  <strong>Ready for collection:</strong> Today at {pickupTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#08482D]" />
                <span>
                  <strong>Location:</strong> 42 Prince Street, Soho (Ask for counter batch #{orderReference})
                </span>
              </div>
            </div>

            {/* Loyalty Points Earned Banner */}
            {earnedPointsState > 0 && (
              <div className="p-3.5 bg-[#EBF3E2] rounded-2xl border border-[#DAE7C7] flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#08482D] text-[#DAE7C7] flex items-center justify-center font-bold text-base shrink-0">
                    ★
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#08482D]">
                      +{earnedPointsState} Loyalty Points Earned!
                    </div>
                    <div className="text-[11px] text-[#5E5E61]">
                      10 points for every 1€ spent credited to your Atelier Club account.
                    </div>
                  </div>
                </div>

                {onOpenRewards && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDone();
                      onOpenRewards();
                    }}
                    className="px-3 py-1.5 bg-[#08482D] hover:bg-[#053320] text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 shadow-2xs"
                  >
                    My Rewards →
                  </button>
                )}
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
              {onViewOrderHistory && (
                <button
                  onClick={() => {
                    handleDone();
                    onViewOrderHistory();
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#DAE7C7] hover:bg-[#cbe0b3] text-[#08482D] text-xs font-bold transition-all shadow-xs"
                >
                  View in Order History
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-full border border-[#DAE7C7] hover:bg-[#F5F8EF] text-xs font-bold text-[#101410] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Order Receipt</span>
              </button>
              <button
                onClick={handleDone}
                className="px-6 py-2.5 rounded-full bg-[#08482D] hover:bg-[#053320] text-xs font-bold text-white shadow-sm"
              >
                Return to Pastry Boutique
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
