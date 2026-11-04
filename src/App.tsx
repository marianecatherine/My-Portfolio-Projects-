import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DailySpecials } from './components/DailySpecials';
import { Menu } from './components/Menu';
import { PastryModal } from './components/PastryModal';
import { CraftSection } from './components/CraftSection';
import { StorySection } from './components/StorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { RewardsModal } from './components/RewardsModal';
import { Footer } from './components/Footer';
import { CartItem, PastryItem, OrderType, PastOrder, RewardItem } from './types/pastry';
import { PASTRIES } from './data/pastries';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      item: PASTRIES[0], // Classic Butter Croissant default
      quantity: 2,
      packaging: 'Standard Kraft Box',
    },
    {
      item: PASTRIES[2], // Raspberry Pistachio Tart default
      quantity: 1,
      packaging: 'Luxury Gift Box (+€3.00)',
    },
  ]);

  // Real-time stock tracking for each pastry item (deducting initial cart items)
  const [stockMap, setStockMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    PASTRIES.forEach((p) => {
      initial[p.id] = p.initialStock;
    });
    // Deduct default cart items:
    initial['croissant-classic'] = Math.max(0, initial['croissant-classic'] - 2); // 3 - 2 = 1 left!
    initial['tart-raspberry-pistachio'] = Math.max(0, initial['tart-raspberry-pistachio'] - 1); // 2 - 1 = 1 left!
    return initial;
  });

  const [selectedPastry, setSelectedPastry] = useState<PastryItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutOrderType, setCheckoutOrderType] = useState<OrderType>('pickup');
  const [checkoutPickupTime, setCheckoutPickupTime] = useState('09:30 AM');
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);

  // Loyalty points system (10 points per 1€ spent, seeded with 100 welcome + 280 from order #RM-7281)
  const [points, setPoints] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('reelmark_loyalty_points');
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return 380;
  });

  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);

  const loadPastOrders = () => {
    try {
      const stored = localStorage.getItem('reelmark_pastry_orders');
      if (stored) {
        setPastOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load past orders', e);
    }
  };

  // Initialize sample past order in localStorage if empty
  useEffect(() => {
    try {
      if (!localStorage.getItem('reelmark_pastry_orders')) {
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        const initialOrders: PastOrder[] = [
          {
            id: 'RM-7281',
            createdAt: yesterday,
            customerName: 'Sophie Bernard',
            customerEmail: 'sophie.bernard@example.com',
            customerPhone: '+1 (555) 234-8901',
            orderType: 'pickup',
            pickupTime: '08:30 AM',
            bakerNotes: 'Packed in separate wax sleeves for morning team tasting',
            items: [
              {
                item: PASTRIES[0],
                quantity: 2,
                packaging: 'Standard Kraft Box',
              },
              {
                item: PASTRIES[1],
                quantity: 2,
                packaging: 'Standard Kraft Box',
              },
              {
                item: PASTRIES[2],
                quantity: 1,
                packaging: 'Luxury Gift Box (+€3.00)',
              },
            ],
            subtotal: 31.20,
            discount: 3.12,
            deliveryFee: 0,
            total: 28.08,
            status: 'Completed',
          },
        ];
        localStorage.setItem('reelmark_pastry_orders', JSON.stringify(initialOrders));
      }
      loadPastOrders();
    } catch (e) {
      console.error('Failed to seed sample order history', e);
    }
  }, []);

  const handleEarnPoints = (earned: number) => {
    setPoints((prev) => {
      const next = prev + earned;
      try {
        localStorage.setItem('reelmark_loyalty_points', next.toString());
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    setTimeout(loadPastOrders, 50);
  };

  const handleRedeemReward = (reward: RewardItem) => {
    setPoints((prev) => {
      const next = Math.max(0, prev - reward.pointsCost);
      try {
        localStorage.setItem('reelmark_loyalty_points', next.toString());
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Quick add to cart
  const handleQuickAddToCart = (pastry: PastryItem) => {
    const currentStock = stockMap[pastry.id] ?? pastry.initialStock;
    if (currentStock <= 0) return;

    setStockMap((prev) => ({
      ...prev,
      [pastry.id]: Math.max(0, (prev[pastry.id] ?? pastry.initialStock) - 1),
    }));

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (ci) => ci.item.id === pastry.id && ci.packaging === 'Standard Kraft Box'
      );
      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx] = {
          ...nextCart[existingIdx],
          quantity: nextCart[existingIdx].quantity + 1,
        };
        return nextCart;
      } else {
        return [
          ...prevCart,
          { item: pastry, quantity: 1, packaging: 'Standard Kraft Box' },
        ];
      }
    });
  };

  // Add to cart with specific quantity and packaging from Modal
  const handleAddToCartWithPackaging = (
    pastry: PastryItem,
    quantity: number,
    packaging: 'Standard Kraft Box' | 'Luxury Gift Box (+€3.00)'
  ) => {
    const currentStock = stockMap[pastry.id] ?? pastry.initialStock;
    if (currentStock <= 0 || quantity <= 0) return;

    const actualQty = Math.min(quantity, currentStock);

    setStockMap((prev) => ({
      ...prev,
      [pastry.id]: Math.max(0, (prev[pastry.id] ?? pastry.initialStock) - actualQty),
    }));

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (ci) => ci.item.id === pastry.id && ci.packaging === packaging
      );
      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx] = {
          ...nextCart[existingIdx],
          quantity: nextCart[existingIdx].quantity + actualQty,
        };
        return nextCart;
      } else {
        return [...prevCart, { item: pastry, quantity: actualQty, packaging }];
      }
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    const cartItem = cart[index];
    if (!cartItem) return;

    const currentQty = cartItem.quantity;
    const pastryId = cartItem.item.id;

    if (newQty <= 0) {
      // Removing item from cart: restore stock
      setStockMap((prev) => ({
        ...prev,
        [pastryId]: (prev[pastryId] ?? 0) + currentQty,
      }));
      setCart((prevCart) => prevCart.filter((_, i) => i !== index));
      return;
    }

    const diff = newQty - currentQty;
    const availableStock = stockMap[pastryId] ?? 0;

    // If trying to increase beyond available stock, prevent it
    if (diff > 0 && availableStock < diff) {
      return;
    }

    setStockMap((prev) => ({
      ...prev,
      [pastryId]: Math.max(0, (prev[pastryId] ?? 0) - diff),
    }));

    setCart((prevCart) => {
      const nextCart = [...prevCart];
      nextCart[index] = { ...nextCart[index], quantity: newQty };
      return nextCart;
    });
  };

  const handleRemoveItem = (index: number) => {
    const cartItem = cart[index];
    if (cartItem) {
      setStockMap((prev) => ({
        ...prev,
        [cartItem.item.id]: (prev[cartItem.item.id] ?? 0) + cartItem.quantity,
      }));
    }
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleProceedToCheckout = (
    orderType: OrderType,
    pickupTime: string,
    discount: number
  ) => {
    setCheckoutOrderType(orderType);
    setCheckoutPickupTime(pickupTime);
    setCheckoutDiscount(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleReorder = (items: CartItem[]) => {
    // Add reordered items to current cart
    setCart((prevCart) => {
      const nextCart = [...prevCart];
      items.forEach((newItem) => {
        const idx = nextCart.findIndex(
          (ci) => ci.item.id === newItem.item.id && ci.packaging === newItem.packaging
        );
        if (idx > -1) {
          nextCart[idx] = {
            ...nextCart[idx],
            quantity: nextCart[idx].quantity + newItem.quantity,
          };
        } else {
          nextCart.push(newItem);
        }
      });
      return nextCart;
    });

    // Deduct stock for reordered items
    setStockMap((prev) => {
      const updated = { ...prev };
      items.forEach((item) => {
        const cur = updated[item.item.id] ?? item.item.initialStock;
        updated[item.item.id] = Math.max(0, cur - item.quantity);
      });
      return updated;
    });

    setIsOrderHistoryOpen(false);
    setIsCartOpen(true);
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8EF] text-[#101410] flex flex-col font-sans">
      {/* Header conforming to Top Bar Contract */}
      <Header
        cart={cart}
        points={points}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateToMenu={scrollToMenu}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
      />

      <main className="flex-1">
        {/* Soft mint studio Hero with interactive curved pastry carousel & real-time stock */}
        <Hero
          onSelectPastry={(pastry) => setSelectedPastry(pastry)}
          onNavigateToMenu={scrollToMenu}
          stockMap={stockMap}
        />

        {/* Daily Specials component showcasing featured pastry for each day of the week */}
        <DailySpecials
          onSelectPastry={(pastry) => setSelectedPastry(pastry)}
          onAddToCart={handleQuickAddToCart}
          stockMap={stockMap}
        />

        {/* The requested Menu section showcasing Croissants, Tarts, Danishes with real-time stock badges */}
        <Menu
          onSelectPastry={(pastry) => setSelectedPastry(pastry)}
          onAddToCart={handleQuickAddToCart}
          stockMap={stockMap}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* The Craft & 72-Hour Lamination + Live Hearth Oven Schedule */}
        <CraftSection />

        {/* Customer Reviews & Critical Acclaim */}
        <ReviewsSection />

        {/* Heritage Story & Physical Boutique Locations */}
        <StorySection />
      </main>

      {/* Comprehensive Footer */}
      <Footer
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
      />

      {/* Product Detail Modal with real-time stock urgency & Sold Out controls */}
      <PastryModal
        pastry={selectedPastry}
        stock={selectedPastry ? (stockMap[selectedPastry.id] ?? selectedPastry.initialStock) : 0}
        onClose={() => setSelectedPastry(null)}
        onAddToCartWithPackaging={handleAddToCartWithPackaging}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Order Reservation & Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        orderType={checkoutOrderType}
        pickupTime={checkoutPickupTime}
        discount={checkoutDiscount}
        onClearCart={handleClearCart}
        onViewOrderHistory={() => setIsOrderHistoryOpen(true)}
        onEarnPoints={handleEarnPoints}
        onOpenRewards={() => setIsRewardsOpen(true)}
      />

      {/* Order History Modal (Persisted with localStorage) */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        onReorder={handleReorder}
        onNavigateToMenu={scrollToMenu}
      />

      {/* Club Pâtisserie & Loyalty Rewards Modal */}
      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        points={points}
        onRedeemReward={handleRedeemReward}
        orders={pastOrders}
        onNavigateToMenu={scrollToMenu}
      />
    </div>
  );
}
