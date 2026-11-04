import React from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, Check } from 'lucide-react';
import { HERO_IMAGE } from '../data/pastries';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 md:py-28 bg-[#F5F8EF] border-t border-[#DAE7C7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[#DAE7C7]">
            <img
              src={HERO_IMAGE}
              alt="Artisanal French bakery atelier counter with fresh croissants and tarts"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-handwriting text-2xl text-[#DAE7C7] block">Hand-rolled every 4:00 AM</span>
              <span className="font-display font-bold text-lg">The Soho Atelier Deck</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-[#08482D] mb-2">
              Our Heritage & Origins
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101410] leading-tight text-balance">
              Rooted in Traditional Viennoiserie, <br />
              <span className="font-serif italic font-normal text-[#08482D]">Baked for Today’s City Mornings</span>
            </h2>
            <p className="mt-4 text-base text-[#5E5E61] leading-relaxed">
              Founded by master baker Marc Delaunay and pastry chef Sophie Lin, Reelmark was created with one uncompromising mission:
              to bring true, unhurried French lamination back to the modern neighborhood.
            </p>
            <p className="mt-3 text-base text-[#5E5E61] leading-relaxed">
              We never use pre-mixes, margarine, or industrial dough sheeters that crush gluten structure. Every morning, our team
              patiently stretches each buttery fold by hand, listening for the delicate whisper of aerated layers.
            </p>

            <div className="mt-6 pt-6 border-t border-[#DAE7C7]/80 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-mono text-2xl font-bold text-[#08482D] tabular-nums">100%</div>
                <div className="text-xs text-[#5E5E61] mt-0.5">Normandy AOP Butter</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[#08482D] tabular-nums">72h</div>
                <div className="text-xs text-[#5E5E61] mt-0.5">Slow Fermentation</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[#08482D] tabular-nums">0%</div>
                <div className="text-xs text-[#5E5E61] mt-0.5">Artificial Additives</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit & Locations Grid */}
        <div id="visit" className="p-8 sm:p-12 rounded-3xl bg-white border border-[#DAE7C7]/80 shadow-xs">
          <div className="max-w-2xl mb-10">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#08482D] mb-2">
              Visit The Boutiques & Ateliers
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#101410]">
              Drop By For Warm Pastries & Espresso
            </h3>
            <p className="text-sm text-[#5E5E61] mt-2">
              Walk-ins are warmly welcome. Pre-orders are recommended for weekend party hampers and box collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location 1: Soho */}
            <div className="p-6 rounded-2xl bg-[#F5F8EF] border border-[#DAE7C7]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-[#08482D]">Flagship Atelier</span>
                <span className="bg-[#DAE7C7] text-[#08482D] text-xs font-semibold px-2.5 py-0.5 rounded-full">Open Today</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#101410]">Reelmark Soho</h4>
              <div className="mt-3 space-y-2 text-sm text-[#5E5E61]">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#08482D] shrink-0" />
                  <span>42 Prince Street, Soho, New York, NY 10012</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#08482D] shrink-0" />
                  <span>Tuesday – Sunday: 7:00 AM – 5:30 PM (or until sold out)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#08482D] shrink-0" />
                  <span>+1 (212) 555-0194</span>
                </div>
              </div>
            </div>

            {/* Location 2: Saint-Germain */}
            <div className="p-6 rounded-2xl bg-[#F5F8EF] border border-[#DAE7C7]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-[#08482D]">Paris Atelier</span>
                <span className="bg-[#DAE7C7] text-[#08482D] text-xs font-semibold px-2.5 py-0.5 rounded-full">Open Today</span>
              </div>
              <h4 className="font-display text-xl font-bold text-[#101410]">Reelmark Saint-Germain</h4>
              <div className="mt-3 space-y-2 text-sm text-[#5E5E61]">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#08482D] shrink-0" />
                  <span>18 Rue de Sèvres, 75007 Paris, France</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#08482D] shrink-0" />
                  <span>Mardi – Dimanche: 07:30 – 18:30</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#08482D] shrink-0" />
                  <span>+33 1 45 44 20 18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
