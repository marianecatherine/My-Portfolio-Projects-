import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, MapPin, Clock, Instagram, Heart } from 'lucide-react';

interface FooterProps {
  onOpenOrderHistory?: () => void;
  onOpenRewards?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrderHistory, onOpenRewards }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#101410] text-[#F5F8EF] border-t border-[#1C241C] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#252E25]">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <span className="w-8 h-8 rounded-lg bg-[#DAE7C7] flex items-center justify-center text-[#08482D]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </span>
              <span className="font-display tracking-tight text-2xl font-bold">
                Reelmark <span className="font-serif italic font-normal text-[#DAE7C7] text-xl">Pâtisserie</span>
              </span>
            </div>

            <p className="text-sm text-[#A0A89C] max-w-sm leading-relaxed">
              Captivate crowds with snackable, slow-laminated French viennoiserie, jewel-like fruit tarts, and buttery brioches.
              Baked fresh at dawn using certified Normandy AOP butter and 72-hour cold poolish fermentation.
            </p>

            <div className="text-xs text-[#DAE7C7] font-handwriting text-xl pt-2">
              "Every morning is a new batch of joy."
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-[#DAE7C7] mb-3">
                The Bakery
              </div>
              <ul className="space-y-2 text-sm text-[#A0A89C]">
                <li><a href="#menu" className="hover:text-white transition-colors">Viennoiserie</a></li>
                <li><a href="#menu" className="hover:text-white transition-colors">Seasonal Tarts</a></li>
                <li><a href="#menu" className="hover:text-white transition-colors">Cardamom Danishes</a></li>
                {onOpenRewards && (
                  <li>
                    <button
                      onClick={onOpenRewards}
                      className="hover:text-white transition-colors text-left text-[#DAE7C7] font-medium"
                    >
                      ★ My Rewards & Club
                    </button>
                  </li>
                )}
                {onOpenOrderHistory && (
                  <li>
                    <button
                      onClick={onOpenOrderHistory}
                      className="hover:text-white transition-colors text-left text-[#DAE7C7]"
                    >
                      Past Order Receipts
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-[#DAE7C7] mb-3">
                Atelier
              </div>
              <ul className="space-y-2 text-sm text-[#A0A89C]">
                <li><a href="#craft" className="hover:text-white transition-colors">Our 72h Method</a></li>
                <li><a href="#story" className="hover:text-white transition-colors">The Founders</a></li>
                <li><a href="#visit" className="hover:text-white transition-colors">Soho Boutique</a></li>
                <li><a href="#visit" className="hover:text-white transition-colors">Paris Workshop</a></li>
                <li><a href="#story" className="hover:text-white transition-colors">Butter Sourcing</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs uppercase tracking-wider font-bold text-[#DAE7C7]">
              Morning Drop Dispatch
            </div>
            <p className="text-xs text-[#A0A89C] leading-relaxed">
              Subscribe to receive weekly seasonal tart alerts, secret baker experimental batch drops, and weekend pre-order windows.
            </p>

            {subscribed ? (
              <div className="p-3.5 bg-[#08482D] rounded-xl text-xs text-[#DAE7C7] flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Merci! You're on the early morning tasting list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2.5 text-xs bg-[#1C241C] border border-[#2E3B2E] rounded-full text-white placeholder:text-[#5E5E61] focus:outline-none focus:border-[#DAE7C7]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-5 py-2.5 bg-[#DAE7C7] hover:bg-white text-[#08482D] rounded-full text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-[#717E6C] flex items-center gap-1.5">
              <span>✦ Baked fresh Tuesday–Sunday. Never frozen, never preserved.</span>
            </div>
          </div>
        </div>

        {/* Sourcing & Allergen Notice */}
        <div className="py-8 border-b border-[#252E25] text-xs text-[#717E6C] space-y-2">
          <p>
            <strong className="text-[#A0A89C]">Allergen & Kitchen Notice:</strong> Our pastries are crafted in an open atelier environment where wheat flour (gluten), milk, eggs, tree nuts (almonds, pistachios, hazelnuts), and soy are handled daily. While we sanitize workstations scrupulously between batches, trace cross-contact may occur.
          </p>
          <p>
            <strong className="text-[#A0A89C]">Craftsmanship Commitment:</strong> 100% Normandy AOP churned cultured butter (84% minimum butterfat). French T55 and T65 stoneground unbleached flours. Valrhona B Corp certified chocolate. Sicilian Bronte pistachios. Zero artificial food colorings or hydrogenated oils.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Quiet Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#717E6C]">
          <div>
            © {new Date().getFullYear()} Reelmark Pâtisserie Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#DAE7C7] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#DAE7C7] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#DAE7C7] transition-colors">Food Hygiene Certificate (5/5)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
