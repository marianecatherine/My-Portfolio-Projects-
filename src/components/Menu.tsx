import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Info, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PASTRIES } from '../data/pastries';
import { PastryCategory, PastryItem } from '../types/pastry';

interface MenuProps {
  onSelectPastry: (pastry: PastryItem) => void;
  onAddToCart: (pastry: PastryItem) => void;
  stockMap: Record<string, number>;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Menu: React.FC<MenuProps> = ({
  onSelectPastry,
  onAddToCart,
  stockMap,
  searchQuery: externalSearchQuery,
  onSearchChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<PastryCategory>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const effectiveSearch =
    externalSearchQuery !== undefined ? externalSearchQuery : localSearchQuery;

  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    }
    setLocalSearchQuery(val);
  };

  // Multi-toggle allergen & dietary filters
  const [allergenFilters, setAllergenFilters] = useState<{
    glutenFree: boolean;
    nutFree: boolean;
    vegan: boolean;
    dairyFree: boolean;
  }>({
    glutenFree: false,
    nutFree: false,
    vegan: false,
    dairyFree: false,
  });

  const activeFilterCount = Object.values(allergenFilters).filter(Boolean).length;

  const toggleAllergen = (key: keyof typeof allergenFilters) => {
    setAllergenFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const clearAllergenFilters = () => {
    setAllergenFilters({
      glutenFree: false,
      nutFree: false,
      vegan: false,
      dairyFree: false,
    });
    handleSearchChange('');
    setActiveCategory('all');
  };

  const categories: { id: PastryCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Creations', count: PASTRIES.length },
    { id: 'croissants', label: 'Croissants & Viennoiserie', count: PASTRIES.filter(p => p.category === 'croissants').length },
    { id: 'tarts', label: 'Seasonal Tarts', count: PASTRIES.filter(p => p.category === 'tarts').length },
    { id: 'danishes', label: 'Laminated Danishes', count: PASTRIES.filter(p => p.category === 'danishes').length },
  ];

  const filteredPastries = useMemo(() => {
    const query = effectiveSearch.trim().toLowerCase();

    return PASTRIES.filter((pastry) => {
      const matchesCategory =
        activeCategory === 'all' ||
        pastry.category === activeCategory ||
        (query.length > 0 && pastry.category.toLowerCase().includes(query));

      const matchesSearch =
        !query ||
        pastry.name.toLowerCase().includes(query) ||
        pastry.frenchName.toLowerCase().includes(query) ||
        pastry.category.toLowerCase().includes(query) ||
        pastry.description.toLowerCase().includes(query) ||
        pastry.tastingNotes.some(note => note.toLowerCase().includes(query)) ||
        pastry.dietary.some(d => d.toLowerCase().includes(query));

      // Allergen filter: Gluten-free
      if (allergenFilters.glutenFree) {
        const isGlutenFree =
          pastry.dietary.includes('Gluten-Free') ||
          !pastry.allergens.some(a => a.toLowerCase().includes('gluten'));
        if (!isGlutenFree) return false;
      }

      // Allergen filter: Nut-free
      if (allergenFilters.nutFree) {
        const isNutFree =
          pastry.dietary.includes('Nut-Free') ||
          !pastry.allergens.some(a => a.toLowerCase().includes('nut'));
        if (!isNutFree) return false;
      }

      // Allergen filter: Vegan (No dairy, no egg)
      if (allergenFilters.vegan) {
        const isVegan =
          pastry.dietary.includes('Vegan') ||
          (!pastry.allergens.some(a => a.toLowerCase().includes('dairy') || a.toLowerCase().includes('egg')));
        if (!isVegan) return false;
      }

      // Allergen filter: Dairy-free
      if (allergenFilters.dairyFree) {
        const isDairyFree =
          pastry.dietary.includes('Dairy-Free') ||
          !pastry.allergens.some(a => a.toLowerCase().includes('dairy'));
        if (!isDairyFree) return false;
      }

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, effectiveSearch, allergenFilters]);

  const handleQuickAdd = (e: React.MouseEvent, pastry: PastryItem) => {
    e.stopPropagation();
    const currentStock = stockMap[pastry.id] ?? pastry.initialStock;
    if (currentStock <= 0) return;
    onAddToCart(pastry);
    setAddedId(pastry.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#F5F8EF] border-t border-[#DAE7C7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E2] border border-[#DAE7C7] text-xs uppercase tracking-widest font-semibold text-[#08482D] mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Live Hearth Stock · Baked Fresh Hourly</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#101410] text-balance">
            Handcrafted Viennoiserie, <br />
            <span className="font-serif italic font-normal text-[#08482D]">Tarts & Laminated Danishes</span>
          </h2>
          <p className="mt-4 text-base text-[#5E5E61] text-balance">
            Every creation is hand-rolled and slow-proofed using French unbleached flour, cultured Normandy AOP butter,
            and seasonal produce from certified organic growers. Filter by allergen safety and dietary needs below.
          </p>
        </div>

        {/* Top Controls: Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#DAE7C7]/80">
          {/* Category Tabs (Segmented Control) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#08482D] text-white shadow-xs'
                      : 'bg-white/80 text-[#101410] hover:bg-[#DAE7C7]/40 border border-[#DAE7C7]/60'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1.5 text-xs font-mono tabular-nums ${
                      isActive ? 'text-[#DAE7C7]' : 'text-[#5E5E61]'
                    }`}
                  >
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5E61]" />
            <input
              type="text"
              value={effectiveSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by flavor, ingredient, or category..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-white/90 border border-[#DAE7C7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#08482D] focus:border-transparent text-[#101410] placeholder:text-[#5E5E61]/70"
            />
            {effectiveSearch && (
              <button
                onClick={() => handleSearchChange('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5E5E61] hover:text-[#101410] p-0.5"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dedicated Allergen & Dietary Toggle System */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-white/70 border border-[#DAE7C7] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#08482D] mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#08482D]" />
              <span>Filter by Allergens & Diets:</span>
            </div>

            {/* Gluten-Free Toggle */}
            <button
              type="button"
              onClick={() => toggleAllergen('glutenFree')}
              aria-pressed={allergenFilters.glutenFree}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                allergenFilters.glutenFree
                  ? 'bg-[#08482D] text-white shadow-xs ring-2 ring-[#08482D]/20'
                  : 'bg-white text-[#101410] border border-[#DAE7C7] hover:bg-[#DAE7C7]/30'
              }`}
            >
              <span>🌾</span>
              <span>Gluten-Free</span>
              {allergenFilters.glutenFree && <Check className="w-3 h-3 stroke-[3]" />}
            </button>

            {/* Nut-Free Toggle */}
            <button
              type="button"
              onClick={() => toggleAllergen('nutFree')}
              aria-pressed={allergenFilters.nutFree}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                allergenFilters.nutFree
                  ? 'bg-[#08482D] text-white shadow-xs ring-2 ring-[#08482D]/20'
                  : 'bg-white text-[#101410] border border-[#DAE7C7] hover:bg-[#DAE7C7]/30'
              }`}
            >
              <span>🥜</span>
              <span>Nut-Free</span>
              {allergenFilters.nutFree && <Check className="w-3 h-3 stroke-[3]" />}
            </button>

            {/* Vegan Toggle */}
            <button
              type="button"
              onClick={() => toggleAllergen('vegan')}
              aria-pressed={allergenFilters.vegan}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                allergenFilters.vegan
                  ? 'bg-[#08482D] text-white shadow-xs ring-2 ring-[#08482D]/20'
                  : 'bg-white text-[#101410] border border-[#DAE7C7] hover:bg-[#DAE7C7]/30'
              }`}
            >
              <span>🌱</span>
              <span>Vegan (Plant-Based)</span>
              {allergenFilters.vegan && <Check className="w-3 h-3 stroke-[3]" />}
            </button>

            {/* Dairy-Free Toggle */}
            <button
              type="button"
              onClick={() => toggleAllergen('dairyFree')}
              aria-pressed={allergenFilters.dairyFree}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                allergenFilters.dairyFree
                  ? 'bg-[#08482D] text-white shadow-xs ring-2 ring-[#08482D]/20'
                  : 'bg-white text-[#101410] border border-[#DAE7C7] hover:bg-[#DAE7C7]/30'
              }`}
            >
              <span>🥛</span>
              <span>Dairy-Free</span>
              {allergenFilters.dairyFree && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          </div>

          {/* Active Status & Reset Button */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
            <span className="text-xs text-[#5E5E61]">
              Showing <strong className="text-[#101410]">{filteredPastries.length}</strong> items
            </span>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllergenFilters}
                className="text-xs font-bold text-[#C0392B] hover:underline transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Pastry Grid Layout */}
        {filteredPastries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPastries.map((pastry) => {
              const isJustAdded = addedId === pastry.id;
              const stock = stockMap[pastry.id] ?? pastry.initialStock;
              const isSoldOut = stock <= 0;
              const isLowStock = stock > 0 && stock <= 3;

              return (
                <article
                  key={pastry.id}
                  onClick={() => onSelectPastry(pastry)}
                  className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 shadow-xs flex flex-col cursor-pointer ${
                    isSoldOut
                      ? 'border-[#E2EBD3] opacity-90 hover:border-[#101410]/40'
                      : isLowStock
                      ? 'border-[#E8A598] hover:border-[#C0392B] hover:shadow-xl'
                      : 'border-[#DAE7C7]/80 hover:border-[#08482D]/40 hover:shadow-xl'
                  }`}
                >
                  {/* Pastry Image Container with Fallback */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EBF3E2]">
                    <img
                      src={pastry.image}
                      alt={pastry.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className={`w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out ${
                        isSoldOut ? 'grayscale-[25%] opacity-85' : ''
                      }`}
                    />

                    {/* Gradient scrim for subtle contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />

                    {/* Category / Batch Tag */}
                    <div className="absolute top-3 left-3 bg-[#F5F8EF]/95 backdrop-blur-xs text-[#08482D] text-xs font-semibold px-2.5 py-1 rounded-full shadow-2xs border border-[#08482D]/10">
                      {pastry.badge || (pastry.category === 'croissants' ? 'Viennoiserie' : pastry.category === 'tarts' ? 'Fresh Tart' : 'Danish')}
                    </div>

                    {/* Real-Time Stock Availability Badge (Top-Right) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isSoldOut ? (
                        <span className="bg-[#101410]/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white/20 flex items-center gap-1">
                          <span>Sold Out</span>
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-[#C0392B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                          <span>Only {stock} left!</span>
                        </span>
                      ) : (
                        <span className="bg-[#08482D]/90 backdrop-blur-xs text-[#DAE7C7] text-xs font-semibold px-2.5 py-1 rounded-full shadow-2xs border border-[#DAE7C7]/30">
                          {stock} in stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      {/* Quiet Unboxed Metadata (NO PILL SLOP) */}
                      <div className="flex items-center gap-2 text-xs font-medium text-[#5E5E61] mb-1.5">
                        <span className="uppercase tracking-wider text-[#08482D] font-semibold">
                          {pastry.frenchName}
                        </span>
                        <span aria-hidden="true" className="text-[#DAE7C7]">·</span>
                        <span>{pastry.calories} kcal</span>
                      </div>

                      {/* Primary English Title */}
                      <h3 className="font-display text-xl font-bold text-[#101410] group-hover:text-[#08482D] transition-colors leading-snug">
                        {pastry.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-sm text-[#5E5E61] line-clamp-2 leading-relaxed">
                        {pastry.description}
                      </p>

                      {/* Real-time stock status urgency message */}
                      <div className="mt-3">
                        {isSoldOut ? (
                          <div className="text-xs font-semibold text-[#8B2C19] flex items-center gap-1.5 bg-[#FAF0ED] px-2.5 py-1.5 rounded-lg border border-[#F5C2B8]">
                            <span>Sold out for this round · Next batch at {pastry.nextBatchTime || '14:00'}</span>
                          </div>
                        ) : isLowStock ? (
                          <div className="text-xs font-semibold text-[#C0392B] flex items-center gap-1.5 bg-[#FDF1EE] px-2.5 py-1.5 rounded-lg border border-[#FADCD5]">
                            <span>🔥 High demand: Only {stock} remaining in current batch</span>
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-[#08482D] flex items-center gap-1">
                            <span>✓ Fresh morning batch · {stock} available</span>
                          </div>
                        )}
                      </div>

                      {/* Dietary & Allergen Tags */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {pastry.dietary.map((d) => (
                          <span
                            key={d}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              d === 'Gluten-Free'
                                ? 'bg-[#FEF5E7] text-[#9A5B13] border border-[#FADBB3]'
                                : d === 'Vegan'
                                ? 'bg-[#EBF3E2] text-[#08482D] border border-[#DAE7C7]'
                                : d === 'Nut-Free'
                                ? 'bg-[#EBF5FB] text-[#1B4F72] border border-[#D4E6F1]'
                                : 'bg-[#F5F8EF] text-[#5E5E61] border border-[#DAE7C7]'
                            }`}
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Tasting Notes as clean unboxed list */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#5E5E61]">
                        <span className="font-semibold text-xs text-[#101410]">Notes:</span>
                        {pastry.tastingNotes.map((note, idx) => (
                          <React.Fragment key={note}>
                            <span>{note}</span>
                            {idx < pastry.tastingNotes.length - 1 && (
                              <span aria-hidden="true" className="text-[#DAE7C7]">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="mt-6 pt-4 border-t border-[#DAE7C7]/60 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#5E5E61] block">Fresh slice</span>
                        <span className="font-mono text-xl font-bold text-[#101410] tabular-nums">
                          €{pastry.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPastry(pastry);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-[#08482D] hover:bg-[#DAE7C7]/40 rounded-full transition-colors flex items-center gap-1"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Story</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSoldOut}
                          onClick={(e) => handleQuickAdd(e, pastry)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full transition-all active:scale-95 shadow-2xs ${
                            isSoldOut
                              ? 'bg-[#E5EAE0] text-[#717E6C] cursor-not-allowed opacity-80'
                              : isJustAdded
                              ? 'bg-[#08482D] text-[#DAE7C7]'
                              : isLowStock
                              ? 'bg-[#C0392B] hover:bg-[#A93226] text-white shadow-xs'
                              : 'bg-[#DAE7C7] hover:bg-[#c9ddb1] text-[#08482D]'
                          }`}
                        >
                          {isSoldOut ? (
                            <span>Sold Out</span>
                          ) : isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isLowStock ? `Grab (${stock} left)` : 'Add to Box'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 bg-white/70 rounded-2xl border border-dashed border-[#DAE7C7]">
            <p className="text-lg font-medium text-[#101410]">No pastries match your criteria</p>
            <p className="text-sm text-[#5E5E61] mt-1">Try clearing your allergen or category filters to view all fresh bakery items.</p>
            <button
              onClick={clearAllergenFilters}
              className="mt-4 px-5 py-2 text-sm font-semibold text-white bg-[#08482D] rounded-full hover:bg-[#053320] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Special Pre-Order Box Callout */}
        <div className="mt-16 p-8 rounded-3xl bg-[#08482D] text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#DAE7C7]">
              Atelier Curated Sampler Box
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-white">
              The Grand Weekend Baker’s Hamper
            </h3>
            <p className="mt-2 text-sm text-[#DAE7C7]/90 leading-relaxed">
              Includes two Butter Croissants, two Valrhona Pains au Chocolat, one Raspberry Pistachio Tart,
              and one Cardamom Danish in a gold-embossed keepsake linen box.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center sm:text-right">
              <span className="text-xs text-[#DAE7C7]/75 block line-through">Regular €34.00</span>
              <span className="font-mono text-2xl font-bold text-[#DAE7C7] tabular-nums">€29.50</span>
            </div>
            <button
              onClick={() => {
                // Quick add sampler items
                PASTRIES.slice(0, 4).forEach((p) => onAddToCart(p));
              }}
              className="px-6 py-3 text-sm font-bold text-[#08482D] bg-[#DAE7C7] hover:bg-white rounded-full transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              Add 6-Piece Box
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
