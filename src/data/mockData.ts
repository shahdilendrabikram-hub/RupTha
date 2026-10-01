import { Product, Category, Brand, HomepageConfig, Coupon, Order, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    iconName: 'Laptop',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    itemCount: 42,
    featured: true,
    subcategories: ['Headphones', 'Smartwatches', 'Laptops', 'Audio', 'Accessories']
  },
  {
    id: 'footwear',
    name: 'Footwear & Sneakers',
    slug: 'footwear',
    iconName: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    itemCount: 38,
    featured: true,
    subcategories: ['Running', 'Lifestyle', 'Basketball', 'Formal', 'Boots']
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    itemCount: 56,
    featured: true,
    subcategories: ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Activewear']
  },
  {
    id: 'home',
    name: 'Home & Living',
    slug: 'home',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    itemCount: 29,
    featured: true,
    subcategories: ['Furniture', 'Lighting', 'Kitchenware', 'Decor', 'Bedding']
  },
  {
    id: 'accessories',
    name: 'Watches & Accessories',
    slug: 'accessories',
    iconName: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    itemCount: 31,
    featured: true,
    subcategories: ['Watches', 'Sunglasses', 'Backpacks', 'Wallets']
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    slug: 'beauty',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    itemCount: 24,
    featured: false,
    subcategories: ['Skincare', 'Fragrances', 'Haircare', 'Wellness']
  }
];

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'nike',
    name: 'Nike',
    slug: 'nike',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80',
    description: 'World-renowned athletic footwear, apparel and performance gear.',
    productCount: 18
  },
  {
    id: 'sony',
    name: 'Sony',
    slug: 'sony',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80',
    description: 'Pioneers in high-resolution audio, visual displays and consumer tech.',
    productCount: 12
  },
  {
    id: 'apple',
    name: 'Apple',
    slug: 'apple',
    logo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80',
    description: 'Premium innovative electronics, personal computers and wearable devices.',
    productCount: 14
  },
  {
    id: 'bose',
    name: 'Bose',
    slug: 'bose',
    logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=120&q=80',
    description: 'Acoustic excellence and world-class active noise cancellation audio.',
    productCount: 9
  },
  {
    id: 'dyson',
    name: 'Dyson',
    slug: 'dyson',
    logo: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=120&q=80',
    description: 'Precision engineering for modern home climate, purification and living.',
    productCount: 7
  },
  {
    id: 'samsung',
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&q=80',
    description: 'Cutting-edge AMOLED displays, smartphones, and connected home appliances.',
    productCount: 15
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Nike Air Max Pulse 2026',
    slug: 'nike-air-max-pulse-2026',
    sku: 'NK-AMP-001',
    productCode: 'BOKA-NK-892',
    brand: 'Nike',
    category: 'footwear',
    subcategory: 'Running',
    shortDescription: 'Loaded with resilient foam cushioning and full-length Air unit for unmatched all-day responsiveness.',
    description: 'Pulling inspiration from the London music scene, the Air Max Pulse brings a tough, underground touch to the iconic Air Max line. Point-loaded Air cushioning revamped from the incredibly plush Air Max 270 delivers better bounce, helping you push your boundaries.',
    price: 189.99,
    discountPrice: 149.99,
    discountPercentage: 21,
    taxRate: 0.08,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    variants: [
      { id: 'v1-1', sku: 'NK-AMP-BLK-42', name: 'Black / Crimson - EU 42', size: 'US 9 / EU 42', color: 'Crimson Black', colorHex: '#DC2626', price: 149.99, stock: 12, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80' },
      { id: 'v1-2', sku: 'NK-AMP-BLK-43', name: 'Black / Crimson - EU 43', size: 'US 10 / EU 43', color: 'Crimson Black', colorHex: '#DC2626', price: 149.99, stock: 15, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80' },
      { id: 'v1-3', sku: 'NK-AMP-WHT-42', name: 'Phantom White - EU 42', size: 'US 9 / EU 42', color: 'Phantom White', colorHex: '#F8FAFC', price: 154.99, stock: 8, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80' },
      { id: 'v1-4', sku: 'NK-AMP-BLU-43', name: 'Cobalt Blue - EU 43', size: 'US 10 / EU 43', color: 'Cobalt Blue', colorHex: '#2563EB', price: 159.99, stock: 10, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80' }
    ],
    specifications: {
      'Upper Material': 'Breathable engineered textile with leather overlays',
      'Midsole': 'Foam midsole with point-loaded Max Air unit',
      'Outsole': 'Waffle-inspired rubber outsole',
      'Closure': 'Lace-up front',
      'Weight': '375g (Men size 9)'
    },
    tags: ['sneakers', 'running', 'streetwear', 'nike', 'air max'],
    searchKeywords: ['nike shoes', 'air max', 'running sneaker', 'crimson', 'cushioned shoes'],
    seoTitle: 'Nike Air Max Pulse 2026 | BOKA Premium Footwear',
    seoDescription: 'Buy authentic Nike Air Max Pulse 2026 sneakers with free shipping and express delivery on BOKA.',
    rating: 4.8,
    reviewCount: 142,
    featured: true,
    bestSeller: true,
    trending: true,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    warranty: '2-Year Manufacturer Defect Warranty',
    shippingInfo: 'Free delivery on orders over रू 5,000. Express courier delivery available.',
    returnPolicy: '30-day hassle-free returns with prepaid return label provided.',
    frequentlyBoughtWith: ['prod-3', 'prod-4']
  },
  {
    id: 'prod-2',
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    slug: 'sony-wh-1000xm5-wireless-anc-headphones',
    sku: 'SNY-WH-XM5',
    productCode: 'BOKA-SNY-105',
    brand: 'Sony',
    category: 'electronics',
    subcategory: 'Headphones',
    shortDescription: 'Industry-leading noise cancellation powered by dual processors and 8 microphones with crystal clear hands-free calling.',
    description: 'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE – Extreme and Hi-Res Audio support, the WH-1000XM5 headphones provide awe-inspiring audio quality.',
    price: 399.99,
    discountPrice: 329.99,
    discountPercentage: 17,
    taxRate: 0.08,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v2-1', sku: 'SNY-XM5-BLK', name: 'Midnight Black', color: 'Midnight Black', colorHex: '#0F172A', price: 329.99, stock: 15, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80' },
      { id: 'v2-2', sku: 'SNY-XM5-SLV', name: 'Platinum Silver', color: 'Platinum Silver', colorHex: '#E2E8F0', price: 329.99, stock: 13, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80' }
    ],
    specifications: {
      'Battery Life': 'Up to 30 hours with ANC on (40 hours ANC off)',
      'Quick Charge': '3 min charge gives 3 hours playback',
      'Bluetooth Version': '5.2 with LDAC, AAC, SBC',
      'Weight': '250g ultra-lightweight ergonomic frame',
      'Microphones': '8 beamforming mics with AI noise reduction'
    },
    tags: ['audio', 'headphones', 'sony', 'anc', 'wireless', 'bluetooth'],
    searchKeywords: ['sony headphones', 'wh 1000xm5', 'noise cancelling headphones', 'bluetooth headset'],
    seoTitle: 'Sony WH-1000XM5 Wireless Headphones | BOKA Sound',
    seoDescription: 'Shop the flagship Sony WH-1000XM5 noise cancelling headphones on BOKA. Fast delivery & official warranty.',
    rating: 4.9,
    reviewCount: 310,
    featured: true,
    bestSeller: true,
    trending: true,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    warranty: '1-Year Official Sony Global Warranty',
    shippingInfo: 'Free courier delivery with tracking and signature on delivery.',
    returnPolicy: '30-day money back guarantee.',
    frequentlyBoughtWith: ['prod-5', 'prod-6']
  },
  {
    id: 'prod-3',
    name: 'BOKA Heavyweight Oversized Cotton Tee',
    slug: 'boka-heavyweight-oversized-cotton-tee',
    sku: 'BKA-TSH-280',
    productCode: 'BOKA-APP-410',
    brand: 'BOKA',
    category: 'fashion',
    subcategory: 'T-Shirts',
    shortDescription: 'Crafted from 280 GSM combed organic cotton with relaxed drop-shoulder silhouette and ribbed collar.',
    description: 'Designed for daily durability and premium handfeel, this 280 GSM luxury combed organic cotton tee features reinforced double-needle hems, pre-shrunk treatment, and a contemporary architectural silhouette that pairs effortlessly with tailored trousers or denim.',
    price: 49.99,
    discountPrice: 38.00,
    discountPercentage: 24,
    taxRate: 0.08,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v3-1', sku: 'BKA-TSH-S-BLK', name: 'Washed Charcoal - Small', size: 'S', color: 'Washed Charcoal', colorHex: '#1E293B', price: 38.00, stock: 20 },
      { id: 'v3-2', sku: 'BKA-TSH-M-BLK', name: 'Washed Charcoal - Medium', size: 'M', color: 'Washed Charcoal', colorHex: '#1E293B', price: 38.00, stock: 25 },
      { id: 'v3-3', sku: 'BKA-TSH-L-BLK', name: 'Washed Charcoal - Large', size: 'L', color: 'Washed Charcoal', colorHex: '#1E293B', price: 38.00, stock: 15 },
      { id: 'v3-4', sku: 'BKA-TSH-M-OAT', name: 'Oatmeal Heather - Medium', size: 'M', color: 'Oatmeal Heather', colorHex: '#F1F5F9', price: 38.00, stock: 20 }
    ],
    specifications: {
      'Fabric': '100% Combed Organic Cotton (280 GSM)',
      'Fit': 'Contemporary Oversized Drop-Shoulder',
      'Care': 'Machine wash cold inside out, hang dry',
      'Origin': 'Ethically manufactured in Portugal'
    },
    tags: ['apparel', 'oversized tee', 'cotton t-shirt', 'minimalist fashion', 'streetwear'],
    searchKeywords: ['cotton t shirt', 'oversized tee', 'black t-shirt', 'heavyweight tee'],
    seoTitle: 'Heavyweight Oversized Cotton Tee | BOKA Essentials',
    seoDescription: '280 GSM organic cotton tee in modern oversized fit. Shop premium essentials on BOKA.',
    rating: 4.7,
    reviewCount: 88,
    featured: false,
    bestSeller: true,
    trending: true,
    warranty: 'Quality Guarantee - Free replacement for manufacturing defects',
    shippingInfo: 'Standard 3-5 days delivery. Free shipping on orders over रू 6,000.',
    returnPolicy: '30-day unworn returns in original tags.',
    frequentlyBoughtWith: ['prod-1']
  },
  {
    id: 'prod-4',
    name: 'Apple Watch Series 10 Titanium',
    slug: 'apple-watch-series-10-titanium',
    sku: 'APL-WCH-S10',
    productCode: 'BOKA-APL-774',
    brand: 'Apple',
    category: 'accessories',
    subcategory: 'Watches',
    shortDescription: 'Our thinnest watch ever with the largest, most advanced OLED display, titanium finish, and sleep apnea notifications.',
    description: 'Apple Watch Series 10 is a milestone in Apple Watch history. It features our biggest and most advanced display yet, showing more information on screen than ever before. With Apple’s first wide-angle OLED display, the screen is brighter when viewed from an angle, making it easier to read at a quick glance.',
    price: 749.99,
    discountPrice: 699.99,
    discountPercentage: 7,
    taxRate: 0.08,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v4-1', sku: 'APL-W10-46-NAT', name: '46mm Natural Titanium - Sport Loop', size: '46mm', color: 'Natural Titanium', colorHex: '#D1D5DB', price: 699.99, stock: 12 },
      { id: 'v4-2', sku: 'APL-W10-46-SLT', name: '46mm Slate Titanium - Milanese Loop', size: '46mm', color: 'Slate Titanium', colorHex: '#334155', price: 749.99, stock: 10 }
    ],
    specifications: {
      'Case Material': 'Aerospace-grade Titanium',
      'Display': 'Wide-angle OLED Always-On Retina up to 2000 nits',
      'Water Resistance': '50 meters swimproof with depth gauge',
      'Sensors': 'Electrical heart sensor, Blood Oxygen app, Temperature sensing, ECG'
    },
    tags: ['smartwatch', 'apple', 'fitness', 'titanium', 'wearable tech'],
    searchKeywords: ['apple watch', 'series 10', 'titanium smartwatch', 'fitness tracker'],
    seoTitle: 'Apple Watch Series 10 Titanium | BOKA Tech',
    seoDescription: 'Buy Apple Watch Series 10 Titanium online with official warranty and flexible payments on BOKA.',
    rating: 4.9,
    reviewCount: 95,
    featured: true,
    bestSeller: false,
    trending: true,
    isNewArrival: true,
    warranty: 'Apple 1-Year Limited Warranty with AppleCare+ option',
    shippingInfo: 'Insured priority shipping with tracking number.',
    returnPolicy: '14-day Apple return policy.',
    frequentlyBoughtWith: ['prod-2']
  },
  {
    id: 'prod-5',
    name: 'Bose QuietComfort Ultra Earbuds',
    slug: 'bose-quietcomfort-ultra-earbuds',
    sku: 'BOS-QCU-01',
    productCode: 'BOKA-BOS-290',
    brand: 'Bose',
    category: 'electronics',
    subcategory: 'Headphones',
    shortDescription: 'World-class active noise cancellation with breakthrough spatialized audio for more immersive listening.',
    description: 'Groundbreaking spatialized audio for more immersive listening that makes your music feel more real than ever before — no matter the content or source. World-class noise cancellation and sound customized to your ears via CustomTune technology.',
    price: 299.00,
    discountPrice: 249.00,
    discountPercentage: 17,
    taxRate: 0.08,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v5-1', sku: 'BOS-QCU-BLK', name: 'Triple Black', color: 'Triple Black', colorHex: '#111827', price: 249.00, stock: 20 },
      { id: 'v5-2', sku: 'BOS-QCU-WHT', name: 'White Smoke', color: 'White Smoke', colorHex: '#F8FAFC', price: 249.00, stock: 15 }
    ],
    specifications: {
      'Noise Cancellation': 'Bose Active Noise Cancellation with CustomTune',
      'Battery Life': 'Up to 6 hours (24 hours with charging case)',
      'Water Resistance': 'IPX4 sweat & weather resistance',
      'Controls': 'Simple capacitive touch controls on earbud stems'
    },
    tags: ['earbuds', 'bose', 'wireless', 'noise cancelling', 'spatial audio'],
    searchKeywords: ['bose earbuds', 'quietcomfort ultra', 'wireless earphones', 'anc buds'],
    seoTitle: 'Bose QuietComfort Ultra Earbuds | BOKA Audio',
    seoDescription: 'Shop Bose QuietComfort Ultra spatial audio wireless earbuds at the best price on BOKA.',
    rating: 4.8,
    reviewCount: 167,
    featured: false,
    bestSeller: true,
    trending: true,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    warranty: '2-Year Bose Authorized Warranty',
    shippingInfo: 'Fast 2-day delivery across the country.',
    returnPolicy: '30-day money back trial guarantee.',
    frequentlyBoughtWith: ['prod-2', 'prod-4']
  },
  {
    id: 'prod-6',
    name: 'Dyson Purifier Hot+Cool Formaldehyde HP09',
    slug: 'dyson-purifier-hot-cool-hp09',
    sku: 'DYS-HP09-GLD',
    productCode: 'BOKA-DYS-900',
    brand: 'Dyson',
    category: 'home',
    subcategory: 'Lighting',
    shortDescription: 'Captures ultrafine dust, allergens and destroys formaldehyde continuously while heating or cooling your space.',
    description: 'Combines a precise solid-state formaldehyde sensor with a unique catalytic filter that continuously destroys formaldehyde. Integrated HEPA H13 filtration captures 99.95% of particles as small as 0.1 microns, with Air Multiplier technology to circulate purified air across the whole room.',
    price: 749.99,
    discountPrice: 649.99,
    discountPercentage: 13,
    taxRate: 0.08,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v6-1', sku: 'DYS-HP09-WHT-GLD', name: 'White & Gold', color: 'White / Gold', colorHex: '#FBBF24', price: 649.99, stock: 8 },
      { id: 'v6-2', sku: 'DYS-HP09-NKL-GLD', name: 'Nickel & Gold', color: 'Nickel / Gold', colorHex: '#94A3B8', price: 649.99, stock: 6 }
    ],
    specifications: {
      'Filtration': 'HEPA H13 + Catalytic Formaldehyde destruction filter',
      'Coverage': 'Cleans rooms up to 800 sq ft',
      'Oscillation': 'Up to 350 degrees oscillation angle',
      'Smart App': 'MyDyson smart phone app control & voice assistant compatibility'
    },
    tags: ['dyson', 'air purifier', 'heater', 'smart home', 'appliances'],
    searchKeywords: ['dyson air purifier', 'hp09', 'heater and cooler', 'air filter'],
    seoTitle: 'Dyson Purifier Hot+Cool Formaldehyde HP09 | BOKA Living',
    seoDescription: 'Destroy formaldehyde and purify your home with the intelligent Dyson HP09 purifier.',
    rating: 4.8,
    reviewCount: 74,
    featured: true,
    bestSeller: false,
    trending: false,
    warranty: '2-Year Dyson Comprehensive Warranty',
    shippingInfo: 'Free scheduled courier freight shipping with unboxing.',
    returnPolicy: '30-day money-back satisfaction guarantee.'
  },
  {
    id: 'prod-7',
    name: 'Minimalist Solid Oak Desk with Cable Management',
    slug: 'minimalist-solid-oak-desk',
    sku: 'BKA-DSK-OAK',
    productCode: 'BOKA-HOM-320',
    brand: 'BOKA',
    category: 'home',
    subcategory: 'Furniture',
    shortDescription: 'Handcrafted solid European white oak work desk with concealed magnetic cable raceway and soft chamfered edges.',
    description: 'Meticulously crafted from FSC-certified European white oak with durable matte polyurethane coating that preserves natural wood grain. Features a recessed rear access compartment for power strips and monitor mounts.',
    price: 699.00,
    discountPrice: 589.00,
    discountPercentage: 16,
    taxRate: 0.08,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v7-1', sku: 'BKA-DSK-140-NAT', name: '140cm x 70cm Natural Oak', size: '140 x 70 cm', color: 'Natural Oak', colorHex: '#D97706', price: 589.00, stock: 10 },
      { id: 'v7-2', sku: 'BKA-DSK-160-NAT', name: '160cm x 80cm Natural Oak', size: '160 x 80 cm', color: 'Natural Oak', colorHex: '#D97706', price: 649.00, stock: 8 }
    ],
    specifications: {
      'Material': '100% Solid European White Oak',
      'Legs': 'Solid Oak A-frame with leveling feet',
      'Weight Capacity': '150 kg evenly distributed',
      'Assembly': 'Toolless 10-minute precision bolt assembly'
    },
    tags: ['furniture', 'desk', 'solid oak', 'minimalist', 'workspace'],
    searchKeywords: ['oak desk', 'wood computer table', 'study desk', 'minimalist furniture'],
    seoTitle: 'Minimalist Solid Oak Desk | BOKA Home Collection',
    seoDescription: 'Handcrafted solid European oak desk designed for modern workspaces. Shop on BOKA.',
    rating: 4.9,
    reviewCount: 52,
    featured: false,
    bestSeller: false,
    trending: true,
    isNewArrival: true,
    warranty: '5-Year Structural Frame Warranty',
    shippingInfo: 'Curbside freight delivery with appointment scheduling.',
    returnPolicy: '30-day returns with wooden crate repackaging.'
  },
  {
    id: 'prod-8',
    name: 'Samsung Odyssey OLED G9 Curved Gaming Monitor',
    slug: 'samsung-odyssey-oled-g9-gaming-monitor',
    sku: 'SAM-ODYS-G9',
    productCode: 'BOKA-SAM-880',
    brand: 'Samsung',
    category: 'electronics',
    subcategory: 'Laptops',
    shortDescription: '49-inch dual QHD 1800R curved gaming monitor with 240Hz refresh rate, 0.03ms response time and Neo Quantum Processor.',
    description: 'Step into visual brilliance with the 49-inch 32:9 Odyssey OLED G9. Powered by the Neo Quantum Processor Pro, each frame is analyzed and optimized for peak quality. Vivid colors, infinite contrast ratios, and lightning-fast 240Hz refresh rate provide breathtaking immersion.',
    price: 1599.99,
    discountPrice: 1299.99,
    discountPercentage: 19,
    taxRate: 0.08,
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v8-1', sku: 'SAM-G9-49-SLV', name: '49" OLED Silver Metal', size: '49-inch 32:9', color: 'Metal Silver', colorHex: '#94A3B8', price: 1299.99, stock: 11 }
    ],
    specifications: {
      'Resolution': 'Dual QHD (5120 x 1440)',
      'Curvature': '1800R Ultra-wide',
      'Refresh Rate': '240Hz',
      'Response Time': '0.03ms (GtG)',
      'Connectivity': 'DisplayPort 1.4, HDMI 2.1, Micro HDMI 2.1, USB Hub'
    },
    tags: ['gaming', 'monitor', 'samsung', 'oled', 'ultrawide'],
    searchKeywords: ['samsung monitor', 'odyssey g9', 'oled gaming monitor', '49 inch screen'],
    seoTitle: 'Samsung Odyssey OLED G9 49" Gaming Monitor | BOKA Tech',
    seoDescription: 'Experience ultimate gaming immersion with the 49-inch Samsung Odyssey OLED G9 on BOKA.',
    rating: 4.9,
    reviewCount: 68,
    featured: true,
    bestSeller: false,
    trending: true,
    warranty: '3-Year Samsung On-Site Premium Warranty',
    shippingInfo: 'Specialized insured white-glove electronics delivery.',
    returnPolicy: '30-day returns in original factory packaging.'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'BOKA20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 100,
    description: 'Get 20% off on all orders above रू 13,500',
    expiresAt: '2026-12-31'
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 50,
    description: 'Welcome bonus: 10% off your first BOKA order',
    expiresAt: '2026-12-31'
  },
  {
    code: 'FLASH50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 300,
    description: 'रू 6,750 instant discount on orders over रू 40,500',
    expiresAt: '2026-11-30'
  }
];

export const INITIAL_USER: User = {
  id: 'usr-101',
  email: 'shahdilendrabikram@gmail.com',
  name: 'Dilendra Shah',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  phone: '+1 (555) 839-2041',
  role: 'customer',
  emailVerified: true,
  phoneVerified: true,
  rewardPoints: 480,
  membershipTier: 'Gold',
  createdAt: '2025-01-15',
  addresses: [
    {
      id: 'addr-1',
      name: 'Home Sanctuary',
      recipientName: 'Dilendra Shah',
      phone: '+1 (555) 839-2041',
      street: '742 Evergreen Terrace, Suite 4B',
      apartment: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      isDefault: true,
      type: 'home'
    },
    {
      id: 'addr-2',
      name: 'Design Studio HQ',
      recipientName: 'Dilendra Shah (BOKA Office)',
      phone: '+1 (555) 321-9870',
      street: '550 Howard Street, Floor 12',
      apartment: 'Floor 12',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      isDefault: false,
      type: 'work'
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-9081',
    orderNumber: 'BOKA-2026-9081',
    userId: 'usr-101',
    items: [
      {
        productId: 'prod-1',
        name: 'Nike Air Max Pulse 2026',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
        sku: 'NK-AMP-BLK-42',
        price: 149.99,
        quantity: 1,
        variantDetails: 'Crimson Black / US 9 / EU 42'
      },
      {
        productId: 'prod-3',
        name: 'BOKA Heavyweight Oversized Cotton Tee',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
        sku: 'BKA-TSH-M-BLK',
        price: 38.00,
        quantity: 1,
        variantDetails: 'Washed Charcoal / Medium'
      }
    ],
    subtotal: 187.99,
    discount: 20.00,
    tax: 13.44,
    shippingFee: 0,
    total: 181.43,
    pointsEarned: 180,
    pointsRedeemed: 0,
    shippingAddress: INITIAL_USER.addresses[0],
    deliveryMethod: {
      id: 'del-express',
      name: 'BOKA Express Priority',
      estimatedDays: '1-2 Business Days',
      price: 0
    },
    paymentMethod: {
      type: 'card',
      cardLast4: '4242',
      brand: 'Visa Signature'
    },
    status: 'shipped',
    trackingNumber: 'BKA-EXP-884920491',
    carrier: 'BOKA Logistics Priority Express',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your payment was confirmed and order details received.',
        timestamp: 'Yesterday, 10:15 AM',
        location: 'BOKA Online Portal',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Verified & Approved',
        description: 'Inventory allocated from Silicon Valley Fulfillment Center.',
        timestamp: 'Yesterday, 11:30 AM',
        location: 'San Francisco, CA',
        completed: true
      },
      {
        status: 'processing',
        title: 'Packed in Eco-Friendly Box',
        description: 'Items double checked for quality and sealed with security tape.',
        timestamp: 'Yesterday, 3:45 PM',
        location: 'Distribution Center 04',
        completed: true
      },
      {
        status: 'shipped',
        title: 'In Transit with Priority Courier',
        description: 'Package has departed sorting facility and is traveling to local hub.',
        timestamp: 'Today, 6:20 AM',
        location: 'Bay Area Regional Depot',
        completed: true,
        current: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier driver assigned. Direct delivery en route.',
        timestamp: 'Expected Tomorrow, 9:00 AM',
        location: 'Your Local Distribution Center',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Handed directly to recipient or placed in secure parcel drop.',
        timestamp: 'Expected Tomorrow, 4:00 PM',
        location: '742 Evergreen Terrace, Suite 4B',
        completed: false
      }
    ],
    createdAt: '2026-09-28T10:15:00Z'
  },
  {
    id: 'ord-8102',
    orderNumber: 'BOKA-2026-8102',
    userId: 'usr-101',
    items: [
      {
        productId: 'prod-2',
        name: 'Sony WH-1000XM5 Wireless ANC Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        sku: 'SNY-XM5-BLK',
        price: 329.99,
        quantity: 1,
        variantDetails: 'Midnight Black'
      }
    ],
    subtotal: 329.99,
    discount: 30.00,
    tax: 24.00,
    shippingFee: 0,
    total: 323.99,
    pointsEarned: 320,
    pointsRedeemed: 200,
    shippingAddress: INITIAL_USER.addresses[0],
    deliveryMethod: {
      id: 'del-standard',
      name: 'Standard Free Shipping',
      estimatedDays: '3-5 Business Days',
      price: 0
    },
    paymentMethod: {
      type: 'card',
      cardLast4: '8831',
      brand: 'Mastercard Elite'
    },
    status: 'delivered',
    trackingNumber: 'BKA-STD-991204122',
    carrier: 'FedEx SmartPost',
    estimatedDelivery: 'Delivered on Sep 22',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Order confirmed successfully.',
        timestamp: 'Sep 18, 2:10 PM',
        location: 'Online',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Verified',
        description: 'Ready for fulfillment.',
        timestamp: 'Sep 18, 3:00 PM',
        location: 'Warehouse Hub',
        completed: true
      },
      {
        status: 'processing',
        title: 'Packed',
        description: 'Barcoded and boxed.',
        timestamp: 'Sep 19, 8:45 AM',
        location: 'Warehouse Hub',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Departed Facility',
        description: 'En route.',
        timestamp: 'Sep 20, 11:20 AM',
        location: 'Oakland Transit Hub',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'With Delivery Courier',
        description: 'Van dispatched.',
        timestamp: 'Sep 22, 8:15 AM',
        location: 'San Francisco, CA',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered Securely',
        description: 'Left at front porch. Signature verified.',
        timestamp: 'Sep 22, 1:40 PM',
        location: '742 Evergreen Terrace, Suite 4B',
        completed: true,
        current: true
      }
    ],
    createdAt: '2026-09-18T14:10:00Z'
  }
];

export const INITIAL_HOMEPAGE_CONFIG: HomepageConfig = {
  announcementText: '⚡ Mid-Season Global Launch: Enjoy Up to 35% Off Selected Tech & Sneaker Curations with code BOKA20',
  announcementLinkText: 'Shop Sale',
  announcementLink: '/shop?sale=true',
  announcementBg: 'bg-indigo-600 dark:bg-indigo-700',
  heroSlides: [
    {
      id: 'slide-1',
      title: 'Elegance in Motion. Next-Gen Lifestyle.',
      subtitle: 'Engineered for tactile precision and uncompromising aesthetic beauty. Discover the definitive 2026 BOKA collection.',
      tag: 'NEW EXCLUSIVE RELEASE',
      buttonText: 'Explore Collection',
      buttonLink: '/shop',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      badgeText: '20% OFF FIRST ORDER'
    },
    {
      id: 'slide-2',
      title: 'Acoustic Mastery. Pure Silence.',
      subtitle: 'Experience spatial soundscapes with our curated flagship audio equipment from Sony, Bose and Apple.',
      tag: 'FLAGSHIP SOUND 2026',
      buttonText: 'Discover Audio',
      buttonLink: '/shop?category=electronics',
      bgGradient: 'from-zinc-900 via-purple-950 to-slate-900',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      badgeText: 'FREE 2-DAY COURIER'
    },
    {
      id: 'slide-3',
      title: 'Living Spaces Reimagined.',
      subtitle: 'Organic solid wood, Scandinavian minimalism, and sustainable architectural elements for conscious spaces.',
      tag: 'INTERIOR ARCHITECTURE',
      buttonText: 'View Furniture',
      buttonLink: '/shop?category=home',
      bgGradient: 'from-amber-950 via-stone-900 to-slate-900',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      badgeText: '5-YEAR WARRANTY'
    }
  ],
  promoBanners: [
    {
      id: 'promo-1',
      title: 'Next-Gen Wearables',
      subtitle: 'Titanium precision on your wrist',
      badge: 'Up to 25% Off',
      link: '/shop?category=accessories',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      bgClass: 'from-sky-900 to-indigo-900'
    },
    {
      id: 'promo-2',
      title: 'Minimalist Wardrobe',
      subtitle: '280 GSM combed organic cotton',
      badge: 'Limited Run',
      link: '/shop?category=fashion',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      bgClass: 'from-neutral-900 to-stone-800'
    },
    {
      id: 'promo-3',
      title: 'Home Climate Purity',
      subtitle: 'Air purification meets sculptural form',
      badge: 'Save रू 13,500',
      link: '/shop?category=home',
      imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
      bgClass: 'from-emerald-950 to-teal-900'
    }
  ],
  sections: [
    { id: 'sec-hero', type: 'hero_slider', title: 'Main Hero Showcase', enabled: true, order: 1 },
    { id: 'sec-cats', type: 'categories', title: 'Featured Categories', subtitle: 'Explore curated departments hand-picked for quality', enabled: true, order: 2 },
    { id: 'sec-flash', type: 'flash_sale', title: 'Flash Deals of the Day', subtitle: 'Limited quantity inventory ending soon', enabled: true, order: 3 },
    { id: 'sec-promos', type: 'promotional_banners', title: 'Curated Highlights', enabled: true, order: 4 },
    { id: 'sec-trending', type: 'trending', title: 'Trending Right Now', subtitle: 'What the community is buying this week', enabled: true, order: 5 },
    { id: 'sec-bestsellers', type: 'best_sellers', title: 'All-Time Best Sellers', subtitle: 'Rated 4.8+ stars across thousands of verified customer reviews', enabled: true, order: 6 },
    { id: 'sec-brands', type: 'brands', title: 'Authorized Global Brands', subtitle: 'Direct partnerships ensuring 100% genuine guaranteed products', enabled: true, order: 7 },
    { id: 'sec-special', type: 'special_offers', title: 'VIP Perks & Coupons', enabled: true, order: 8 },
    { id: 'sec-reviews', type: 'customer_reviews', title: 'What Our Customers Say', subtitle: 'Real reviews from verified shoppers worldwide', enabled: true, order: 9 },
    { id: 'sec-news', type: 'blog', title: 'BOKA Journal & Guides', subtitle: 'Design essays, product tear-downs, and tech spotlights', enabled: true, order: 10 },
    { id: 'sec-newsletter', type: 'newsletter', title: 'Stay Connected to BOKA', enabled: true, order: 11 }
  ]
};
