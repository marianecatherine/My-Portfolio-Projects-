import React, { useState } from 'react';
import { X, Plus, Minus, Check, Clock, AlertCircle, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { PastryItem } from '../types/pastry';

interface PastryModalProps {
  pastry: PastryItem | null;
  stock: number;
  onClose: () => void;
  onAddToCartWithPackaging: (
    pastry: PastryItem,
    quantity: number,
    packaging: 'Standard Kraft Box' | 'Luxury Gift Box (+€3.00)'
  ) => void;
}

export const PastryModal: React.FC<PastryModalProps> = ({
  pastry,
  stock,
  onClose,
  onAddToCartWithPackaging,
}) => {
  const isSoldOut = stock <= 0;
  const isLowStock = stock > 0 && stock <= 3;
  const [quantity, setQuantity] = useState(isSoldOut ? 0 : 1);
  const [packaging, setPackaging] = useState<'Standard Kraft Box' | 'Luxury Gift Box (+€3.00)'>('Standard Kraft Box');
  const [justAdded, setJustAdded] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  if (!pastry) return null;

  const packagingSurcharge = packaging === 'Luxury Gift Box (+€3.00)' ? 3.0 : 0;
  const totalPrice = (pastry.price + packagingSurcharge) * quantity;

  const handleAdd = () => {
    if (isSoldOut || quantity <= 0) return;
    onAddToCartWithPackaging(pastry, quantity, packaging);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 800);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail) {
      setNotifySuccess(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#DAE7C7] my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#101410] shadow-sm transition-colors border border-black/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: High-Res Image & Visual Badges */}
          <div className="relative aspect-square md:aspect-auto bg-[#EBF3E2] min-h-[320px]">
            <img
              src={pastry.image}
              alt={pastry.alt}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${isSoldOut ? 'grayscale-[20%] opacity-90' : ''}`}
            />

            {/* Real-Time Stock Badge on Image Overlay */}
            <div className="absolute top-4 left-4">
              {isSoldOut ? (
                <span className="bg-[#101410] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="bg-[#C0392B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                  🔥 Only {stock} left!
                </span>
              ) : (
                <span className="bg-[#08482D] text-[#DAE7C7] text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {stock} in stock
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="bg-[#08482D]/90 backdrop-blur-xs text-[#DAE7C7] text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                {pastry.bakingSchedule}
              </span>
              <span className="bg-white/95 backdrop-blur-xs text-[#101410] text-xs font-mono font-bold px-3 py-1 rounded-full shadow-xs">
                {pastry.calories} kcal
              </span>
            </div>
          </div>

          {/* Right: Detailed PDP Information */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto bg-[#F5F8EF]/40">
            <div>
              {/* Category & French Name */}
              <div className="flex items-center gap-2 text-xs font-medium text-[#5E5E61]">
                <span className="uppercase tracking-wider text-[#08482D] font-bold">
                  {pastry.category}
                </span>
                <span aria-hidden="true" className="text-[#DAE7C7]">·</span>
                <span className="italic font-serif">{pastry.frenchName}</span>
              </div>

              {/* Title, Price & Real-Time Stock Badge */}
              <div className="flex items-start justify-between gap-3 mt-1">
                <h3 className="font-display text-2xl font-bold text-[#101410]">
                  {pastry.name}
                </h3>
              </div>

              {/* Price & Urgency Badges */}
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-[#08482D] tabular-nums">
                  €{pastry.price.toFixed(2)}
                </span>

                {/* Real-time stock status badge */}
                {isSoldOut ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#101410] text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>Sold Out</span>
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FBEAE5] text-[#C0392B] border border-[#F5C2B8] animate-pulse">
                    <span>🔥 Only {stock} left!</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF3E2] text-[#08482D] border border-[#DAE7C7]">
                    <span>✓ In Stock ({stock} fresh)</span>
                  </span>
                )}
              </div>

              {/* Urgency Alert Message */}
              {isSoldOut ? (
                <div className="mt-3 p-3.5 bg-[#FAF0ED] rounded-xl border border-[#F5C2B8] text-xs text-[#8B2C19] space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#8B2C19]" />
                    <span>This tray is completely claimed!</span>
                  </div>
                  <p className="text-[#5E5E61]">
                    The next warm batch leaves our stone deck hearth at <strong>{pastry.nextBatchTime || '14:00'}</strong>.
                  </p>

                  {/* Batch notification signup */}
                  {!notifySuccess ? (
                    <form onSubmit={handleNotifySubmit} className="pt-2 flex gap-1.5">
                      <input
                        type="email"
                        required
                        placeholder="Your email for batch alert"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F5C2B8] rounded-lg text-xs text-[#101410] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#101410] text-white text-xs font-bold rounded-lg hover:bg-[#252E25]"
                      >
                        Notify Me
                      </button>
                    </form>
                  ) : (
                    <div className="pt-1 text-[#08482D] font-bold flex items-center gap-1 text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>We'll ping you 10 mins before {pastry.nextBatchTime}!</span>
                    </div>
                  )}
                </div>
              ) : isLowStock ? (
                <div className="mt-3 p-3 bg-[#FEF4E8] rounded-xl border border-[#FAD9B5] text-xs text-[#A05A12] flex items-center gap-2 font-medium">
                  <Flame className="w-4 h-4 text-[#C0392B] shrink-0" />
                  <span>
                    <strong>High Demand:</strong> Only {stock} remaining in this tray before the morning oven clears!
                  </span>
                </div>
              ) : null}

              {/* Description */}
              <p className="mt-3 text-sm text-[#5E5E61] leading-relaxed">
                {pastry.description}
              </p>

              {/* Crafting Details */}
              <div className="mt-4 p-3.5 bg-white rounded-xl border border-[#DAE7C7]/70 text-xs text-[#101410]/90 leading-relaxed">
                <div className="font-semibold text-[#08482D] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Artisanal Lamination & Dough</span>
                </div>
                {pastry.details}
              </div>

              {/* Reheating Tip */}
              <div className="mt-3 p-3 bg-[#EBF3E2] rounded-xl text-xs text-[#08482D] flex items-start gap-2">
                <Flame className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Chef's Warmth Note: </span>
                  Pop in a preheated 160°C oven for 3 minutes to restore morning shatter-crisp flakes.
                </div>
              </div>

              {/* Allergens & Dietary */}
              <div className="mt-4">
                <div className="text-xs font-bold text-[#101410] mb-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#5E5E61]" />
                  <span>Allergen Notice:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-[#5E5E61]">
                  {pastry.allergens.map((alg) => (
                    <span key={alg} className="bg-white px-2 py-0.5 rounded-md border border-[#DAE7C7]">
                      {alg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Packaging Preference */}
              {!isSoldOut && (
                <div className="mt-5">
                  <div className="text-xs font-bold text-[#101410] mb-1.5">
                    Packaging Presentation:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPackaging('Standard Kraft Box')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        packaging === 'Standard Kraft Box'
                          ? 'border-[#08482D] bg-[#DAE7C7]/30 text-[#08482D] font-bold'
                          : 'border-[#DAE7C7] bg-white text-[#5E5E61]'
                      }`}
                    >
                      <div>Standard Box</div>
                      <div className="text-[10px] text-[#5E5E61]">Recyclable Kraft</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPackaging('Luxury Gift Box (+€3.00)')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        packaging === 'Luxury Gift Box (+€3.00)'
                          ? 'border-[#08482D] bg-[#DAE7C7]/30 text-[#08482D] font-bold'
                          : 'border-[#DAE7C7] bg-white text-[#5E5E61]'
                      }`}
                    >
                      <div>Gift Box (+€3.00)</div>
                      <div className="text-[10px] text-[#5E5E61]">Ribbon & Wax Seal</div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Stepper & Add */}
            <div className="mt-6 pt-4 border-t border-[#DAE7C7]/80 flex items-center gap-4">
              {!isSoldOut ? (
                <>
                  {/* Stepper (bounded by real stock) */}
                  <div className="flex items-center border border-[#DAE7C7] rounded-full bg-white px-2 py-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="p-1 rounded-full hover:bg-[#F5F8EF] text-[#08482D]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-sm tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= stock}
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      aria-label="Increase quantity"
                      className="p-1 rounded-full hover:bg-[#F5F8EF] text-[#08482D] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add Button with urgency feedback */}
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
                      justAdded
                        ? 'bg-[#08482D] text-[#DAE7C7]'
                        : isLowStock
                        ? 'bg-[#C0392B] hover:bg-[#A93226] text-white'
                        : 'bg-[#08482D] text-white hover:bg-[#053320]'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Order!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>
                          {isLowStock
                            ? `Claim ${quantity} of ${stock} left · €${totalPrice.toFixed(2)}`
                            : `Add ${quantity} for €${totalPrice.toFixed(2)}`}
                        </span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Sold Out State CTA */
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-full text-sm font-bold bg-[#E5EAE0] text-[#717E6C] cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Sold Out — Next Fresh Batch at {pastry.nextBatchTime || '14:00'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
