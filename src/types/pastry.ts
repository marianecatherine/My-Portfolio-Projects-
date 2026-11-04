export type PastryCategory = 'all' | 'croissants' | 'tarts' | 'danishes';

export interface PastryItem {
  id: string;
  name: string;
  frenchName: string;
  category: 'croissants' | 'tarts' | 'danishes';
  price: number;
  description: string;
  details: string;
  image: string;
  alt: string;
  allergens: string[];
  tastingNotes: string[];
  bakingSchedule: string;
  badge?: string;
  dietary: string[];
  calories: number;
  isChefFavorite?: boolean;
  initialStock: number;
  nextBatchTime?: string;
}

export interface CartItem {
  item: PastryItem;
  quantity: number;
  packaging: 'Standard Kraft Box' | 'Luxury Gift Box (+€3.00)';
}

export type OrderType = 'pickup' | 'delivery';

export interface PastOrder {
  id: string; // e.g. 'RM-8419'
  createdAt: string; // ISO date string
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: OrderType;
  pickupTime: string;
  deliveryAddress?: string;
  bakerNotes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: 'Ready for Collection' | 'Baking in Hearth' | 'Completed';
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
  code: string;
  benefitType: 'discount' | 'free_item' | 'packaging';
}
