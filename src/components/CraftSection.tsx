import React from 'react';
import { Clock, Shield, Sparkles, Wheat, Flame, Award, CheckCircle2 } from 'lucide-react';
import { BAKING_SCHEDULE } from '../data/pastries';

export const CraftSection: React.FC = () => {
  return (
    <section id="craft" className="py-20 md:py-28 bg-white border-t border-[#DAE7C7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-widest font-semibold text-[#08482D] mb-2">
            The Philosophy of Viennoiserie
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#101410] text-balance">
            72 Hours of Patience, <br />
            <span className="font-serif italic font-normal text-[#08482D]">27 Microscopic Butter Layers</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5E5E61] text-balance">
            Great pastry cannot be rushed. Our artisans work in a temperature-controlled 16°C atelier, folding cultured butter
            into slow-fermenting dough before resting it for three days to develop aromatic depth.
          </p>
        </div>

        {/* 4 Pillars of Craft */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="p-6 rounded-2xl bg-[#F5F8EF] border border-[#DAE7C7]/70">
            <div className="text-xs font-mono font-bold text-[#08482D] mb-3">01 · FERMENTATION</div>
            <Wheat className="w-8 h-8 text-[#08482D] mb-4" />
            <h3 className="font-display text-lg font-bold text-[#101410]">Slow Sourdough Poolish</h3>
            <p className="mt-2 text-sm text-[#5E5E61] leading-relaxed">
              We begin 72 hours earlier with French T55 wheat and living starter cultures, yielding natural sweetness and digestible lightness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F8EF] border border-[#DAE7C7]/70">
            <div className="text-xs font-mono font-bold text-[#08482D] mb-3">02 · BUTTERFAT</div>
            <Award className="w-8 h-8 text-[#08482D] mb-4" />
            <h3 className="font-display text-lg font-bold text-[#101410]">84% Normandy AOP Butter</h3>
            <p className="mt-2 text-sm text-[#5E5E61] leading-relaxed">
              High-fat churned summer butter sourced exclusively from coastal Normandy dairies gives our flakes their tender golden shatter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F8EF] border border-[#DAE7C7]/70">
            <div className="text-xs font-mono font-bold text-[#08482D] mb-3">03 · LAMINATION</div>
            <Sparkles className="w-8 h-8 text-[#08482D] mb-4" />
            <h3 className="font-display text-lg font-bold text-[#101410]">The French Tourage Fold</h3>
            <p className="mt-2 text-sm text-[#5E5E61] leading-relaxed">
              Three precise envelope turns create alternating micro-sheets of dough and chilled butter, resulting in the coveted honeycomb alveoli.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F8EF] border border-[#DAE7C7]/70">
            <div className="text-xs font-mono font-bold text-[#08482D] mb-3">04 · STONE HEARTH</div>
            <Flame className="w-8 h-8 text-[#08482D] mb-4" />
            <h3 className="font-display text-lg font-bold text-[#101410]">Direct Stone Deck Baking</h3>
            <p className="mt-2 text-sm text-[#5E5E61] leading-relaxed">
              Steam-injected stone hearth ovens caramelize the natural sugars on the crust while lifting the laminated tiers to peak volume.
            </p>
          </div>
        </div>

        {/* Live Baking Schedule Module */}
        <div id="schedule" className="p-8 sm:p-12 rounded-3xl bg-[#F5F8EF] border border-[#DAE7C7] relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#08482D] uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              <span>Daily Hearth Timetable</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#101410]">
              Catch Your Favorite Pastry Warm From the Deck
            </h3>
            <p className="text-sm text-[#5E5E61] mt-2">
              We bake in small, continuous batches throughout the day. If you want pastries warm from the oven, plan your pickup around these windows.
            </p>
          </div>

          <div className="divide-y divide-[#DAE7C7]/80 bg-white rounded-2xl border border-[#DAE7C7]/80 overflow-hidden shadow-2xs">
            {BAKING_SCHEDULE.map((slot) => (
              <div
                key={slot.time}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5F8EF]/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className="font-mono text-lg font-bold text-[#08482D] tabular-nums bg-[#DAE7C7]/50 px-3 py-1 rounded-lg">
                    {slot.time}
                  </span>
                  <div>
                    <div className="font-display font-bold text-base text-[#101410]">{slot.title}</div>
                    <div className="text-xs text-[#5E5E61] mt-0.5">{slot.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#08482D] shrink-0 self-end sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-[#08482D]" />
                  <span>Fresh Batch Guaranteed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
