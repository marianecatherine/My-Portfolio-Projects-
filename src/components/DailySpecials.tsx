import React, { useState } from 'react';
import { Calendar, Sparkles, Clock, Plus, Award, ArrowRight, Flame, Coffee, Check, AlertCircle } from 'lucide-react';
import { PastryItem } from '../types/pastry';
import { PASTRIES } from '../data/pastries';

export interface DailySpecialConfig {
  dayIndex: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayName: string;
  frenchDay: string;
  shortDay: string;
  pastryId: string;
  specialPerk: string;
  chefPairing: string;
  highlightNote: string;
}

export const DAILY_SPECIALS_SCHEDULE: DailySpecialConfig[] = [
  {
    dayIndex: 1,
    dayName: 'Monday',
    frenchDay: 'Lundi',
    shortDay: 'Mon',
    pastryId: 'croissant-classic',
    specialPerk: 'Fresh-churned Normandy AOP butter glaze with sweet fleur de sel',
    chefPairing: 'Single-Origin Ethiopian Yirgacheffe Flat White',
    highlightNote: 'Slow poolish awakened after 72h cold rest for the start of the week.',
  },
  {
    dayIndex: 2,
    dayName: 'Tuesday',
    frenchDay: 'Mardi',
    shortDay: 'Tue',
    pastryId: 'pain-au-chocolat',
    specialPerk: 'Double batons of 70% Valrhona Guanaja dark chocolate',
    chefPairing: 'Velvety Oat Cortado or Hot Valrhona Cocoa',
    highlightNote: 'Baked in our deep stone hearth at 215°C for maximum caramelized crisp.',
  },
  {
    dayIndex: 3,
    dayName: 'Wednesday',
    frenchDay: 'Mercredi',
    shortDay: 'Wed',
    pastryId: 'tart-lemon-meringue',
    specialPerk: 'Midweek zest: hand-torched French meringue with candied Menton zest',
    chefPairing: 'Jasmine Green Tea or Sparkling Citrus Infusion',
    highlightNote: 'Sunshine organic citrus emulsion balanced over fragile almond sablé.',
  },
  {
    dayIndex: 4,
    dayName: 'Thursday',
    frenchDay: 'Jeudi',
    shortDay: 'Thu',
    pastryId: 'danish-cardamom-blackberry',
    specialPerk: 'Cold-pressed cardamom crystals and reduced elderflower nectar',
    chefPairing: 'Nordic Light Roast Filter Coffee or Spiced Chai',
    highlightNote: 'Aromatic green cardamom infused directly into 27 laminated pastry folds.',
  },
  {
    dayIndex: 5,
    dayName: 'Friday',
    frenchDay: 'Vendredi',
    shortDay: 'Fri',
    pastryId: 'tart-raspberry-pistachio',
    specialPerk: 'Weekend kickoff: pure Bronte pistachio ganache & 24k gold leaf',
    chefPairing: 'Iced Rose Matcha Latte or Cold Brew Tonic',
    highlightNote: 'Our most awarded jewel tart, crowned with organic raspberries sorted at 6 AM.',
  },
  {
    dayIndex: 6,
    dayName: 'Saturday',
    frenchDay: 'Samedi',
    shortDay: 'Sat',
    pastryId: 'danish-apricot-frangipane',
    specialPerk: 'Provence apricots poached in wild mountain thyme honey',
    chefPairing: 'Artisanal Batch Brew or Fresh Squeezed Valencia Orange',
    highlightNote: 'Fluted puff pastry crown filled with rich almond frangipane.',
  },
  {
    dayIndex: 0,
    dayName: 'Sunday',
    frenchDay: 'Dimanche',
    shortDay: 'Sun',
    pastryId: 'tart-vegan-citrus',
    specialPerk: 'Plant-based luxury: whipped coconut cream & candied blood orange',
    chefPairing: 'Earl Grey de la Crème or Golden Turmeric Latte',
    highlightNote: 'Gluten-free toasted almond crust with zero dairy or refined cane sugar.',
  },
];

interface DailySpecialsProps {
  onSelectPastry: (pastry: PastryItem) => void;
  onAddToCart: (pastry: PastryItem) => void;
  stockMap: Record<string, number>;
}

export const DailySpecials: React.FC<DailySpecialsProps> = ({
  onSelectPastry,
  onAddToCart,
  stockMap,
}) => {
  // Determine current day of the week (0 = Sunday, 1 = Monday, etc.)
  const todayIndex = new Date().getDay();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Find the selected schedule config
  const activeSpecial =
    DAILY_SPECIALS_SCHEDULE.find((s) => s.dayIndex === selectedDayIndex) ||
    DAILY_SPECIALS_SCHEDULE[0];

  // Lookup the actual pastry item
  const pastry =
    PASTRIES.find((p) => p.id === activeSpecial.pastryId) || PASTRIES[0];

  const isToday = selectedDayIndex === todayIndex;
  const currentStock = stockMap[pastry.id] ?? pastry.initialStock;
  const isSoldOut = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 3;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    onAddToCart(pastry);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <section
      id="daily-specials"
      aria-label="Daily Hearth Specials"
      className="py-14 sm:py-20 bg-white border-y border-[#DAE7C7]/80 relative overflow-hidden"
    >
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#F5F8EF] pointer-events-none blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#DAE7C7]/30 pointer-events-none blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F8EF] border border-[#DAE7C7] text-xs font-bold text-[#08482D] uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#08482D]" />
              <span>Weekly Hearth Showcase</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101410] tracking-tight">
              Daily Pastry <span className="font-serif italic font-normal text-[#08482D]">Specials</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5E5E61] max-w-xl mt-2 leading-relaxed">
              Every dawn, our master bakers spotlight one signature creation with special touches,
              exclusive chef pairings, and fresh hearth bake times.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#5E5E61] bg-[#F5F8EF] px-3.5 py-2 rounded-2xl border border-[#DAE7C7] self-start md:self-auto">
            <Calendar className="w-4 h-4 text-[#08482D]" />
            <span>Today is <strong className="text-[#101410] font-semibold">{DAILY_SPECIALS_SCHEDULE.find(d => d.dayIndex === todayIndex)?.dayName}</strong></span>
          </div>
        </div>

        {/* Days of Week Tab Navigation */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-2 sm:gap-3 min-w-max p-1 bg-[#F5F8EF] rounded-2xl border border-[#DAE7C7]">
            {/* Display Monday through Sunday in order */}
            {[
              DAILY_SPECIALS_SCHEDULE[0], // Mon
              DAILY_SPECIALS_SCHEDULE[1], // Tue
              DAILY_SPECIALS_SCHEDULE[2], // Wed
              DAILY_SPECIALS_SCHEDULE[3], // Thu
              DAILY_SPECIALS_SCHEDULE[4], // Fri
              DAILY_SPECIALS_SCHEDULE[5], // Sat
              DAILY_SPECIALS_SCHEDULE[6], // Sun
            ].map((schedule) => {
              const isSelected = schedule.dayIndex === selectedDayIndex;
              const isCurrentDay = schedule.dayIndex === todayIndex;

              return (
                <button
                  key={schedule.dayName}
                  onClick={() => setSelectedDayIndex(schedule.dayIndex)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 relative ${
                    isSelected
                      ? 'bg-[#08482D] text-white shadow-sm'
                      : 'text-[#101410] hover:bg-white/80 hover:text-[#08482D]'
                  }`}
                >
                  <span className="font-bold">{schedule.shortDay}</span>
                  <span className={`text-[11px] hidden sm:inline ${isSelected ? 'text-[#DAE7C7]' : 'text-[#5E5E61]'}`}>
                    · {schedule.dayName}
                  </span>

                  {isCurrentDay && (
                    <span
                      className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#DAE7C7] text-[#08482D]'
                          : 'bg-[#08482D] text-[#DAE7C7]'
                      }`}
                    >
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Daily Pastry Card */}
        <div className="bg-[#F5F8EF] rounded-3xl border border-[#DAE7C7] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: High-craft imagery with status badges */}
            <div className="lg:col-span-5 relative group min-h-[320px] lg:min-h-[440px] overflow-hidden bg-black/5">
              <img
                src={pastry.image}
                alt={pastry.alt || pastry.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlaid Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10">
                <div className="px-3 py-1 rounded-full bg-[#08482D]/90 backdrop-blur-md text-[#DAE7C7] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-[#DAE7C7]" />
                  <span>{activeSpecial.dayName} Special ({activeSpecial.frenchDay})</span>
                </div>

                {isToday && (
                  <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#08482D] text-xs font-bold flex items-center gap-1.5 shadow-sm border border-[#DAE7C7]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Baking Fresh in Hearth Today</span>
                  </div>
                )}
              </div>

              {/* Stock status indicator overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                {isSoldOut ? (
                  <span className="px-3 py-1.5 rounded-xl bg-red-900/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Sold Out for Today</span>
                  </span>
                ) : isLowStock ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-sm animate-pulse">
                    <Flame className="w-4 h-4" />
                    <span>Urgent: Only {currentStock} left in morning batch!</span>
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-[#08482D]/90 backdrop-blur-md text-[#DAE7C7] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    <span>{currentStock} available in hearth rack</span>
                  </span>
                )}

                <button
                  onClick={() => onSelectPastry(pastry)}
                  className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white text-[#101410] text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <span>Quick View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Detailed Culinary Profile & Actions */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div>
                {/* Meta details header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DAE7C7]/70">
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic text-base text-[#08482D]">
                      {pastry.frenchName}
                    </span>
                    <span className="text-[#DAE7C7]">·</span>
                    <span className="text-xs font-semibold text-[#5E5E61] uppercase tracking-wider">
                      {pastry.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-2xl font-extrabold text-[#08482D]">
                    <span>€{pastry.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mt-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#101410]">
                    {pastry.name}
                  </h3>
                  <p className="text-sm sm:text-base text-[#5E5E61] mt-2.5 leading-relaxed">
                    {pastry.description}
                  </p>
                </div>

                {/* Day-specific special features grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Daily Highlight Perk */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#DAE7C7] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#08482D]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{activeSpecial.dayName} Feature</span>
                    </div>
                    <p className="text-xs text-[#101410] font-medium leading-relaxed">
                      {activeSpecial.specialPerk}
                    </p>
                  </div>

                  {/* Sommelier / Chef Pairing */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#DAE7C7] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#08482D]">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Barista Beverage Pairing</span>
                    </div>
                    <p className="text-xs text-[#101410] font-medium leading-relaxed">
                      {activeSpecial.chefPairing}
                    </p>
                  </div>
                </div>

                {/* Baker's secret note */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#EBF3E2] border border-[#DAE7C7]/80 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#08482D] text-[#DAE7C7] flex items-center justify-center font-serif italic text-xs font-bold shrink-0 mt-0.5">
                    R
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#08482D] block">
                      Baker's Hearth Note
                    </span>
                    <p className="text-xs text-[#101410] mt-0.5 leading-relaxed">
                      "{activeSpecial.highlightNote}"
                    </p>
                  </div>
                </div>

                {/* Baking time & Dietary */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#5E5E61]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#08482D]" />
                    <span><strong>Oven Batch:</strong> {pastry.bakingSchedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#08482D]" />
                    <span>Earn <strong>+{Math.floor(pastry.price * 10)} Loyalty Points</strong></span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#DAE7C7] flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  disabled={isSoldOut}
                  onClick={handleAdd}
                  className={`w-full sm:w-auto flex-1 py-3.5 px-6 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 ${
                    isSoldOut
                      ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#08482D] hover:bg-[#053320] text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Your Pastry Box!</span>
                    </>
                  ) : isSoldOut ? (
                    <span>Sold Out for {activeSpecial.dayName}</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>
                        {isToday
                          ? `Order Today's Special (€${pastry.price.toFixed(2)})`
                          : `Add ${pastry.name} to Box (€${pastry.price.toFixed(2)})`}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectPastry(pastry)}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-[#DAE7C7] hover:bg-white text-xs font-bold text-[#101410] transition-colors"
                >
                  View Tasting & Ingredients
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
