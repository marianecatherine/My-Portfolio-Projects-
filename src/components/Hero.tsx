import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Flame, Award, Heart } from 'lucide-react';
import { PASTRIES } from '../data/pastries';
import { PastryItem } from '../types/pastry';

interface HeroProps {
  onSelectPastry: (pastry: PastryItem) => void;
  onNavigateToMenu: () => void;
  stockMap: Record<string, number>;
}

export const Hero: React.FC<HeroProps> = ({ onSelectPastry, onNavigateToMenu, stockMap }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Auto-scroll effect that pauses when hovering or dragging
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let animationFrameId: number;
    let speed = 0.5; // slow graceful drift

    const step = () => {
      if (!isDragging && !hoveredCard && el) {
        el.scrollLeft += speed;
        // Infinite loop wrap
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, hoveredCard]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 bg-[#F5F8EF]">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DAE7C7]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#DAE7C7]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Centered Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DAE7C7] text-[#08482D] text-sm font-semibold tracking-wide shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#08482D]" />
            <span>Trusted by 14,000+ morning viennoiserie lovers</span>
          </div>
        </div>

        {/* Hero Title & Editorial Hand-Drawn Notes */}
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Handwritten doodle left */}
          <div className="hidden lg:block absolute -left-12 top-2 text-[#08482D] font-handwriting text-2xl -rotate-12 select-none pointer-events-none">
            <span>// 72h cold poolish</span>
            <svg className="w-16 h-8 text-[#08482D] ml-2 -mt-1 stroke-current fill-none stroke-2" viewBox="0 0 60 30">
              <path d="M5,5 Q30,25 55,10" />
              <polyline points="48,5 55,10 50,17" />
            </svg>
          </div>

          {/* Handwritten doodle right */}
          <div className="hidden lg:block absolute -right-16 top-1 text-[#08482D] font-handwriting text-2xl rotate-12 select-none pointer-events-none text-left">
            <span>Freshly baked</span>
            <br />
            <span>before dawn ♨</span>
            <svg className="w-20 h-16 text-[#08482D] ml-4 -mt-1 stroke-current fill-none stroke-2" viewBox="0 0 80 60">
              <path d="M10,10 C40,15 60,40 50,55" />
              <polyline points="42,50 50,55 56,47" />
            </svg>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#101410] leading-[1.08] text-balance">
            Captivate Crowds <br />
            <span className="font-serif italic font-normal text-[#08482D]">with Snackable Flakes</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#5E5E61] max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            Elevate your morning rituals with short, snappy croissants, jewel-like tarts, and slow-laminated danishes.
            Crafted with Normandy AOP butter and baked daily in small stone-hearth batches.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-[#08482D] hover:bg-[#053320] rounded-full transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              <span>Explore The Pastry Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#schedule"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-[#08482D] bg-[#DAE7C7]/60 hover:bg-[#DAE7C7] rounded-full transition-all border border-[#08482D]/15"
            >
              <Flame className="w-4 h-4 text-[#08482D]" />
              <span>View Baking Schedule</span>
            </a>
          </div>

          {/* Zero cost note */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#08482D] font-handwriting text-lg select-none">
            <span>✦ Local delivery within 5 miles & morning pick-up slots</span>
          </div>
        </div>

        {/* Curved / Arched Pastry Showcase Row (Draggable & Looping) */}
        <div className="mt-12 md:mt-16 relative">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#08482D]">
              Morning Showcase · Drag or scroll
            </span>
            <span className="text-xs text-[#5E5E61]">
              Click any pastry for tasting notes & instant order
            </span>
          </div>

          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none cursor-${
              isDragging ? 'grabbing' : 'grab'
            } select-none`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Repeat list for smooth seamless feel */}
            {[...PASTRIES, ...PASTRIES].map((pastry, index) => {
              const isHovered = hoveredCard === `${pastry.id}-${index}`;
              const stock = stockMap[pastry.id] ?? pastry.initialStock;
              const isSoldOut = stock <= 0;
              const isLowStock = stock > 0 && stock <= 3;

              return (
                <div
                  key={`${pastry.id}-${index}`}
                  onMouseEnter={() => setHoveredCard(`${pastry.id}-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => onSelectPastry(pastry)}
                  className={`relative shrink-0 w-[240px] sm:w-[280px] h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border group cursor-pointer ${
                    isSoldOut ? 'border-neutral-300 opacity-90' : isLowStock ? 'border-[#E8A598]' : 'border-[#DAE7C7]/60'
                  }`}
                  style={{
                    transform: isHovered ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
                  }}
                >
                  {/* Pastry Photography */}
                  <img
                    src={pastry.image}
                    alt={pastry.alt}
                    referrerPolicy="no-referrer"
                    className={`w-full h-[62%] object-cover group-hover:scale-108 transition-transform duration-500 ${
                      isSoldOut ? 'grayscale-[25%] opacity-85' : ''
                    }`}
                  />

                  {/* Top floating category pill */}
                  <div className="absolute top-3 left-3 bg-[#F5F8EF]/90 backdrop-blur-xs text-[#08482D] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#08482D]/10">
                    {pastry.badge || pastry.category}
                  </div>

                  {/* Top floating stock availability badge */}
                  <div className="absolute top-3 right-3">
                    {isSoldOut ? (
                      <span className="bg-[#101410] text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                        Sold Out
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-[#C0392B] text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        Only {stock} left!
                      </span>
                    ) : (
                      <span className="bg-[#08482D]/90 backdrop-blur-xs text-[#DAE7C7] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {stock} in stock
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col justify-between h-[38%] bg-[#F5F8EF]">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#08482D] font-semibold">
                        {pastry.frenchName}
                      </div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-[#101410] line-clamp-1 mt-0.5 group-hover:text-[#08482D] transition-colors">
                        {pastry.name}
                      </h3>
                      <p className="text-xs text-[#5E5E61] line-clamp-1 mt-1">
                        {pastry.tastingNotes.join(' · ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#DAE7C7]/60">
                      <span className="font-mono font-bold text-[#08482D] text-sm tabular-nums">
                        €{pastry.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-medium text-[#08482D] group-hover:underline flex items-center gap-1">
                        Details & Add →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust & Craft Adjacency Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#DAE7C7]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DAE7C7]/50 flex items-center justify-center text-[#08482D] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#101410]">100% AOP Butter</div>
              <div className="text-xs text-[#5E5E61]">Normandy 84% butterfat</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DAE7C7]/50 flex items-center justify-center text-[#08482D] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#101410]">72-Hour Ferment</div>
              <div className="text-xs text-[#5E5E61]">Slow sourdough poolish</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DAE7C7]/50 flex items-center justify-center text-[#08482D] shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#101410]">Stone-Hearth Baked</div>
              <div className="text-xs text-[#5E5E61]">Fresh warm 07:00 & 11:30</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DAE7C7]/50 flex items-center justify-center text-[#08482D] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#101410]">Pure Single-Origin</div>
              <div className="text-xs text-[#5E5E61]">Valrhona & Bronte nuts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
