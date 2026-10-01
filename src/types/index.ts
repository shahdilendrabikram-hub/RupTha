export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  weight?: string;
  image?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  productCode: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  taxRate: number; // e.g., 0.08 for 8%
  stock: number;
  images: string[];
  videoUrl?: string;
  variants: ProductVariant[];
  specifications: Record<string, string>;
  tags: string[];
  searchKeywords: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  featured?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  warranty: string;
  shippingInfo: string;
  returnPolicy: string;
  frequentlyBoughtWith?: string[]; // array of product IDs
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  subcategories?: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  productCount: number;
}

export interface UserAddress {
  id: string;
  name: string;
  recipientName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: UserAddress[];
  rewardPoints: number;
  membershipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id (product id + variant id)
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
  expiresAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  sku: string;
  price: number;
  quantity: number;
  variantDetails?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  pointsEarned: number;
  pointsRedeemed: number;
  shippingAddress: UserAddress;
  deliveryMethod: {
    id: string;
    name: string;
    estimatedDays: string;
    price: number;
  };
  paymentMethod: {
    type: 'card' | 'cod' | 'gpay' | 'paypal';
    cardLast4?: string;
    brand?: string;
  };
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  trackingEvents: TrackingEvent[];
  createdAt: string;
  returnRequested?: boolean;
  returnReason?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  buttonText: string;
  buttonLink: string;
  bgGradient: string;
  imageUrl: string;
  badgeText?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  link: string;
  imageUrl: string;
  bgClass: string;
}

export interface HomepageSection {
  id: string;
  type: 
    | 'announcement'
    | 'hero_slider'
    | 'categories'
    | 'flash_sale'
    | 'promotional_banners'
    | 'trending'
    | 'best_sellers'
    | 'new_arrivals'
    | 'brands'
    | 'special_offers'
    | 'customer_reviews'
    | 'blog'
    | 'newsletter';
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface HomepageConfig {
  announcementText: string;
  announcementLinkText: string;
  announcementLink: string;
  announcementBg: string;
  heroSlides: HeroSlide[];
  promoBanners: PromoBanner[];
  sections: HomepageSection[];
}

export interface GoogleImageResult {
  title: string;
  url: string;
  thumbnail: string;
  contextLink: string;
  source: string;
  width?: number;
  height?: number;
  license?: string;
}
