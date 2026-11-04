import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag, Check, Clock } from 'lucide-react';
import { CartItem, OrderType } from '../types/pastry';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (orderType: OrderType, pickupTime: string, discount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [pickupTime, setPickupTime] = useState('09:30 AM');
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromoDesc, setAppliedPromoDesc] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = cart.reduce((acc, cartItem) => {
    const packagingSurcharge = cartItem.packaging === 'Luxury Gift Box (+€3.00)' ? 3.0 : 0;
    return acc + (cartItem.item.price + packagingSurcharge) * cartItem.quantity;
  }, 0);

  const discount = Math.min(subtotal, discountAmount);
  const deliveryFee = orderType === 'delivery' ? 4.50 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  // Free tote threshold €30
  const toteThreshold = 30;
  const progressToTote = Math.min(100, (subtotal / toteThreshold) * 100);
  const amountToTote = Math.max(0, toteThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'BONJOUR' || code === 'REELMARK') {
      const disc = (subtotal * 10) / 100;
      setDiscountAmount(disc);
      setAppliedPromoDesc('10% off Atelier welcome promo');
      setPromoApplied(true);
    } else if (code === 'FRESH15') {
      const disc = (subtotal * 15) / 100;
      setDiscountAmount(disc);
      setAppliedPromoDesc('15% off Early Baker promo');
      setPromoApplied(true);
    } else if (code === 'REWARD-TART5') {
      setDiscountAmount(5.00);
      setAppliedPromoDesc('€5 Tart Voucher reward');
      setPromoApplied(true);
    } else if (code === 'REWARD-CROISSANT') {
      setDiscountAmount(3.80);
      setAppliedPromoDesc('Free Butter Croissant reward (-€3.80)');
      setPromoApplied(true);
    } else if (code === 'REWARD-CAFE') {
      setDiscountAmount(3.00);
      setAppliedPromoDesc('Complimentary Espresso reward (-€3.00)');
      setPromoApplied(true);
    } else if (code === 'REWARD-LUXURY') {
      setDiscountAmount(3.00);
      setAppliedPromoDesc('Complimentary Luxury Gift Box Upgrade (-€3.00)');
      setPromoApplied(true);
    } else {
      setPromoError('Invalid code. Try "BONJOUR" for 10% off or use a Reward code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#DAE7C7] flex items-center justify-between bg-[#F5F8EF]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#08482D]" />
              <h3 className="font-display text-lg font-bold text-[#101410]">Your Pastry Box</h3>
              <span className="text-xs bg-[#DAE7C7] text-[#08482D] font-mono font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-full hover:bg-[#DAE7C7]/50 text-[#101410] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Tote Progress */}
          <div className="px-6 py-3 bg-[#EBF3E2] text-xs text-[#08482D] border-b border-[#DAE7C7]/60">
            {amountToTote > 0 ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-medium">
                  <span>Add €{amountToTote.toFixed(2)} more for a complimentary linen tote bag</span>
                  <span className="font-mono">{Math.round(progressToTote)}%</span>
                </div>
                <div className="w-full bg-[#DAE7C7] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#08482D] h-full transition-all duration-300"
                    style={{ width: `${progressToTote}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#08482D]" />
                <span>Complimentary organic linen bread tote unlocked!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#F5F8EF] flex items-center justify-center mx-auto text-[#5E5E61]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-base text-[#101410]">Your box is empty</h4>
                <p className="text-xs text-[#5E5E61] max-w-xs mx-auto">
                  Browse our selection of fresh morning croissants, jewel tarts, and flaky danishes.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 text-xs font-bold text-white bg-[#08482D] rounded-full hover:bg-[#053320]"
                >
                  Browse Pastries
                </button>
              </div>
            ) : (
              cart.map((cartItem, idx) => {
                const itemTotal = (cartItem.item.price + (cartItem.packaging === 'Luxury Gift Box (+€3.00)' ? 3 : 0)) * cartItem.quantity;
                return (
                  <div
                    key={`${cartItem.item.id}-${idx}`}
                    className="flex gap-4 p-3.5 rounded-2xl bg-[#F5F8EF]/60 border border-[#DAE7C7]/70"
                  >
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display font-bold text-sm text-[#101410] leading-snug">
                            {cartItem.item.name}
                          </h4>
                          <span className="text-[11px] text-[#5E5E61] block">
                            {cartItem.packaging}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          aria-label="Remove item"
                          className="text-[#5E5E61] hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#DAE7C7] rounded-full bg-white px-2 py-0.5 text-xs">
                          <button
                            onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                            className="p-0.5 text-[#08482D] hover:bg-[#F5F8EF] rounded-full"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold tabular-nums">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                            className="p-0.5 text-[#08482D] hover:bg-[#F5F8EF] rounded-full"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-bold text-[#101410] tabular-nums">
                          €{itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Controls & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#DAE7C7] bg-[#F5F8EF] space-y-4">
              {/* Pickup vs Delivery Toggle */}
              <div>
                <div className="flex rounded-full bg-white p-1 border border-[#DAE7C7] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`flex-1 py-1.5 rounded-full transition-all ${
                      orderType === 'pickup'
                        ? 'bg-[#08482D] text-white shadow-xs'
                        : 'text-[#5E5E61] hover:text-[#101410]'
                    }`}
                  >
                    Boutique Pick-up (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`flex-1 py-1.5 rounded-full transition-all ${
                      orderType === 'delivery'
                        ? 'bg-[#08482D] text-white shadow-xs'
                        : 'text-[#5E5E61] hover:text-[#101410]'
                    }`}
                  >
                    Local Courier (+€4.50)
                  </button>
                </div>

                {orderType === 'pickup' && (
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-[#5E5E61] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#08482D]" />
                      <span>Pick-up time slot:</span>
                    </span>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="bg-white border border-[#DAE7C7] rounded-lg px-2 py-1 text-xs font-medium text-[#101410]"
                    >
                      <option value="08:00 AM">08:00 AM (Warm batch)</option>
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="11:30 AM">11:30 AM (Second batch)</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#5E5E61] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. BONJOUR)"
                    disabled={promoApplied}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DAE7C7] rounded-lg text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#08482D]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoApplied || !promoCode}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#DAE7C7] hover:bg-[#c6d7ae] text-[#08482D] rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </form>
              {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
              {promoApplied && (
                <p className="text-[11px] text-[#08482D] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{appliedPromoDesc || 'Promo code applied!'}</span>
                </p>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5E5E61] pt-2 border-t border-[#DAE7C7]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#101410]">€{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#08482D] font-medium">
                    <span>Discount applied</span>
                    <span className="font-mono tabular-nums">-€{discount.toFixed(2)}</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Courier Delivery (within 5 miles)</span>
                    <span className="font-mono tabular-nums text-[#101410]">€{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#101410] pt-2 border-t border-[#DAE7C7]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-[#08482D]">€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={() => onProceedToCheckout(orderType, pickupTime, discount)}
                className="w-full py-3.5 px-4 bg-[#08482D] hover:bg-[#053320] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <span>Proceed to Order (Ready in 20m)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
