import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/pastries';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#DAE7C7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest font-semibold text-[#08482D] mb-2">
            Praise & Critical Acclaim
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101410]">
            Beloved by Pastry Connoisseurs
          </h2>
          <div className="mt-3 flex items-center justify-center gap-1 text-[#08482D]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="ml-2 text-xs font-semibold text-[#101410]">
              4.95 / 5.0 Average rating across 4,200+ morning orders
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.author}
              className="p-8 rounded-3xl bg-[#F5F8EF] border border-[#DAE7C7]/80 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-[#08482D]/30 mb-4" />
                <p className="text-base text-[#101410] font-serif italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DAE7C7]/80">
                <div className="font-bold text-sm text-[#101410]">{review.author}</div>
                <div className="text-xs text-[#5E5E61]">
                  {review.role} · <span className="text-[#08482D] font-medium">{review.publication}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
