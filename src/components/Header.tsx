import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Sparkles, Clock, MapPin, Receipt, Award, Search } from 'lucide-react';
import { CartItem } from '../types/pastry';

interface HeaderProps {
  cart: CartItem[];
  points: number;
  onOpenCart: () => void;
  onNavigateToMenu: () => void;
  onOpenOrderHistory: () => void;
  onOpenRewards: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  points,
  onOpenCart,
  onNavigateToMenu,
  onOpenOrderHistory,
  onOpenRewards,
  searchQuery = '',
  onSearchChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchInput = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    }
    if (val.trim()) {
      onNavigateToMenu();
    }
  };

  return (
    <>
      {/* Top micro-announcement banner */}
      <aside aria-label="Bakery announcement" className="bg-[#08482D] text-[#DAE7C7] text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#DAE7C7]" />
          <span>Morning batch just out of the hearth · Pre-order weekend pastry boxes before 4:00 PM</span>
        </div>
      </aside>

      {/* Main Top Bar strictly fulfilling the Top Bar Contract (3 zones separated by gap-8) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-[#F5F8EF]/95 backdrop-blur-md border-[#DAE7C7]/80 shadow-xs'
            : 'bg-[#F5F8EF] border-[#E2EBD3]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Zone - Single text element wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#08482D] whitespace-nowrap shrink-0 group"
          >
            <span className="w-8 h-8 rounded-lg bg-[#DAE7C7] flex items-center justify-center text-[#08482D] group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </span>
            <span className="font-display tracking-tight text-[#101410] text-xl font-bold">
              Reelmark <span className="font-serif italic font-normal text-[#08482D] text-lg">Pâtisserie</span>
            </span>
          </a>

          {/* Zone 2: 4-5 single-line clean text nav links */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-medium text-[#101410]/80">
            <a
              href="#menu"
              className="hover:text-[#08482D] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#08482D]/40"
            >
              Menu & Pastries
            </a>
            <a
              href="#daily-specials"
              className="hover:text-[#08482D] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#08482D]/40"
            >
              Daily Specials
            </a>
            <a
              href="#craft"
              className="hover:text-[#08482D] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#08482D]/40"
            >
              The Craft
            </a>
            <a
              href="#schedule"
              className="hover:text-[#08482D] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#08482D]/40"
            >
              Baking Schedule
            </a>
            <a
              href="#visit"
              className="hover:text-[#08482D] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#08482D]/40"
            >
              Visit & Contact
            </a>
          </nav>

          {/* Zone 3: Real-time search & functional cart affordances */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Real-time Search Bar (Desktop) */}
            <div className="relative hidden md:flex items-center">
              <Search className="w-3.5 h-3.5 text-[#08482D] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search pastries or category..."
                className="w-36 lg:w-48 xl:w-56 focus:w-64 transition-all duration-200 pl-8.5 pr-7 py-1.5 text-xs bg-white/95 hover:bg-white border border-[#DAE7C7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#08482D] focus:border-transparent text-[#101410] placeholder:text-[#5E5E61]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchInput('')}
                  aria-label="Clear search"
                  className="absolute right-2 text-[#5E5E61] hover:text-[#101410] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle (Mobile/Tablet) */}
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              aria-label="Toggle real-time search bar"
              className={`md:hidden p-2 rounded-full transition-colors ${
                mobileSearchOpen || searchQuery
                  ? 'bg-[#DAE7C7] text-[#08482D]'
                  : 'hover:bg-[#DAE7C7]/50 text-[#08482D]'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Loyalty Rewards trigger */}
            <button
              onClick={onOpenRewards}
              aria-label={`My Rewards: ${points} points`}
              title="Club Pâtisserie & Loyalty Rewards"
              className="p-2 sm:px-3 sm:py-1.5 rounded-full hover:bg-[#DAE7C7]/50 text-[#08482D] transition-colors focus-visible:outline-2 focus-visible:outline-[#08482D] flex items-center gap-1.5 border border-[#DAE7C7]"
            >
              <Award className="w-4 h-4 text-[#08482D]" />
              <span className="hidden sm:inline text-xs font-semibold">Rewards</span>
              <span className="bg-[#08482D] text-[#DAE7C7] text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                {points}
              </span>
            </button>

            {/* Order History trigger */}
            <button
              onClick={onOpenOrderHistory}
              aria-label="Past order history"
              title="Past Orders & Receipts"
              className="p-2 sm:p-2.5 rounded-full hover:bg-[#DAE7C7]/50 text-[#08482D] transition-colors focus-visible:outline-2 focus-visible:outline-[#08482D] flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden 2xl:inline text-xs font-semibold">Orders</span>
            </button>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              aria-label={`Shopping bag with ${totalItems} items`}
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-[#DAE7C7]/50 text-[#08482D] transition-colors focus-visible:outline-2 focus-visible:outline-[#08482D]"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#08482D] text-[#DAE7C7] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={onNavigateToMenu}
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#08482D] hover:bg-[#053320] rounded-full transition-all shadow-xs hover:shadow-sm whitespace-nowrap shrink-0"
            >
              Order Online
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileSearchOpen) setMobileSearchOpen(false);
              }}
              className="md:hidden p-2 text-[#08482D] hover:bg-[#DAE7C7]/40 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile quick-search slide-down bar */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-[#DAE7C7] bg-[#F5F8EF] px-4 py-2.5 animate-in slide-in-from-top-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#08482D] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search pastries or category (e.g. Croissant, Tart)..."
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#DAE7C7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#08482D] text-[#101410] placeholder:text-[#5E5E61]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchInput('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 text-[#5E5E61] hover:text-[#101410] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#DAE7C7] bg-[#F5F8EF] px-4 pt-3 pb-6 space-y-3">
            {/* Real-time search inside drawer */}
            <div className="relative pb-1">
              <Search className="w-4 h-4 text-[#08482D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search menu by pastry or category..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#DAE7C7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#08482D] text-[#101410] placeholder:text-[#5E5E61]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchInput('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5E5E61] hover:text-[#101410] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#101410] hover:text-[#08482D]"
            >
              Menu & Pastries
            </a>
            <a
              href="#daily-specials"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#101410] hover:text-[#08482D]"
            >
              Daily Hearth Specials
            </a>
            <a
              href="#craft"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#101410] hover:text-[#08482D]"
            >
              The Craft & Lamination
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#101410] hover:text-[#08482D]"
            >
              Fresh Oven Schedule
            </a>
            <a
              href="#story"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#101410] hover:text-[#08482D]"
            >
              Atelier Story
            </a>
            <a
              href="#visit"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#101410] hover:text-[#08482D]"
            >
              Visit & Boutique Hours
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRewards();
              }}
              className="w-full text-left py-2 text-base font-medium text-[#08482D] hover:underline flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>My Rewards & Points</span>
              </div>
              <span className="bg-[#DAE7C7] text-[#08482D] text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                {points} pts
              </span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderHistory();
              }}
              className="w-full text-left py-2 text-base font-medium text-[#08482D] hover:underline flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>Past Order Receipts</span>
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToMenu();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#08482D] rounded-full"
              >
                Order for Today
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
