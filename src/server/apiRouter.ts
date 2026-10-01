import express, { Request, Response } from 'express';
import http from 'http';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BRANDS, 
  INITIAL_HOMEPAGE_CONFIG, 
  INITIAL_COUPONS, 
  INITIAL_ORDERS, 
  INITIAL_USER 
} from '../data/mockData';
import { Product, HomepageConfig, Order, User, UserAddress, OrderStatus } from '../types';
import { searchProductImages } from './imageSearchService';

// Ensure http.ServerResponse prototype has status, json, send in all runtimes
if (typeof (http.ServerResponse.prototype as any).status !== 'function') {
  (http.ServerResponse.prototype as any).status = function (statusCode: number) {
    this.statusCode = statusCode;
    return this;
  };
}

if (typeof (http.ServerResponse.prototype as any).json !== 'function') {
  (http.ServerResponse.prototype as any).json = function (data: any) {
    if (!this.headersSent) {
      try {
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
      } catch {}
    }
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    this.end(jsonStr);
    return this;
  };
}

if (typeof (http.ServerResponse.prototype as any).send !== 'function') {
  (http.ServerResponse.prototype as any).send = function (data: any) {
    if (typeof data === 'object') {
      return (this as any).json(data);
    }
    this.end(data);
    return this;
  };
}

// In-memory persistent state (persists during server runtime)
let products: Product[] = [...INITIAL_PRODUCTS];
let homepageConfig: HomepageConfig = JSON.parse(JSON.stringify(INITIAL_HOMEPAGE_CONFIG));
let orders: Order[] = [...INITIAL_ORDERS];
let currentUser: User = JSON.parse(JSON.stringify(INITIAL_USER));
let coupons = [...INITIAL_COUPONS];

export const apiRouter = express.Router();

// Safe helper middleware ensuring res.status, res.json, res.send, req.query, and req.body exist in all runtimes (e.g. Vite Connect middleware)
apiRouter.use((req: any, res: any, next: any) => {
  res.status = function (statusCode: number) {
    this.statusCode = statusCode;
    return this;
  };

  res.json = function (data: any) {
    if (!this.headersSent) {
      try {
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
      } catch {}
    }
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    this.end(jsonStr);
    return this;
  };

  res.send = function (data: any) {
    if (typeof data === 'object') {
      return this.json(data);
    }
    this.end(data);
    return this;
  };

  if (!req.query && req.url) {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      req.query = Object.fromEntries(urlObj.searchParams.entries());
    } catch {
      req.query = {};
    }
  }

  next();
});

// Safe body parser for JSON payloads
apiRouter.use(express.json({ limit: '10mb' }));
apiRouter.use((req: any, _res: any, next: any) => {
  if (req.body !== undefined || req.method === 'GET' || req.method === 'HEAD') {
    return next();
  }

  let bodyStr = '';
  req.on('data', (chunk: any) => {
    bodyStr += chunk;
  });
  req.on('end', () => {
    if (bodyStr.trim()) {
      try {
        req.body = JSON.parse(bodyStr);
      } catch {
        req.body = bodyStr;
      }
    } else {
      req.body = {};
    }
    next();
  });
  req.on('error', (err: any) => {
    next(err);
  });
});

// 1. PRODUCTS API
apiRouter.get('/products', (req: Request, res: Response) => {
  const { q, category, brand, minPrice, maxPrice, rating, inStock, sort, isFlashSale } = req.query;

  let filtered = [...products];

  if (q && typeof q === 'string') {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter(p => {
      return (
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.tags.some(t => t.toLowerCase().includes(term)) ||
        p.searchKeywords.some(k => k.toLowerCase().includes(term)) ||
        p.description.toLowerCase().includes(term)
      );
    });
  }

  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (brand && typeof brand === 'string' && brand !== 'all') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (minPrice) {
    filtered = filtered.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
  }

  if (rating) {
    filtered = filtered.filter(p => p.rating >= Number(rating));
  }

  if (inStock === 'true') {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (isFlashSale === 'true') {
    filtered = filtered.filter(p => p.isFlashSale);
  }

  // Sorting
  if (sort === 'price_asc') {
    filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else {
    // default: featured or popularity
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  res.json({
    total: filtered.length,
    products: filtered
  });
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const prod = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!prod) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(prod);
});

apiRouter.post('/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    slug: (req.body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    rating: req.body.rating || 5.0,
    reviewCount: req.body.reviewCount || 0,
    taxRate: req.body.taxRate || 0.08,
    variants: req.body.variants || [],
    specifications: req.body.specifications || {},
    tags: req.body.tags || [],
    searchKeywords: req.body.searchKeywords || [],
    images: req.body.images?.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

// 2. CATEGORIES & BRANDS
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json(INITIAL_CATEGORIES);
});

apiRouter.get('/brands', (_req: Request, res: Response) => {
  res.json(INITIAL_BRANDS);
});

// 3. DYNAMIC HOMEPAGE CONFIGURATION
apiRouter.get('/homepage', (_req: Request, res: Response) => {
  res.json(homepageConfig);
});

apiRouter.put('/homepage', (req: Request, res: Response) => {
  homepageConfig = {
    ...homepageConfig,
    ...req.body
  };
  res.json({ success: true, config: homepageConfig });
});

// 4. GOOGLE IMAGE SEARCH API INTEGRATION FOR PRODUCT MEDIA
apiRouter.get('/images/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const apiKey = req.query.apiKey as string | undefined;
  const cx = req.query.cx as string | undefined;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const searchResult = await searchProductImages(query, apiKey, cx);
    res.json(searchResult);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to search product images', details: err?.message });
  }
});

// 5. ORDERS & TRACKING
apiRouter.get('/orders', (_req: Request, res: Response) => {
  res.json(orders);
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id || o.trackingNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  const orderId = `ord-${Date.now()}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `RUPTHA-2026-${randomSuffix}`;
  const trackingNumber = `RB-TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    userId: currentUser.id,
    items: req.body.items || [],
    subtotal: req.body.subtotal || 0,
    discount: req.body.discount || 0,
    tax: req.body.tax || 0,
    shippingFee: req.body.shippingFee || 0,
    total: req.body.total || 0,
    pointsEarned: Math.round((req.body.total || 0) * 1),
    pointsRedeemed: req.body.pointsRedeemed || 0,
    shippingAddress: req.body.shippingAddress || currentUser.addresses[0],
    deliveryMethod: req.body.deliveryMethod || {
      id: 'del-standard',
      name: 'Ruptha Bazzar Standard Free Shipping',
      estimatedDays: '3-5 Business Days',
      price: 0
    },
    paymentMethod: req.body.paymentMethod || {
      type: 'card',
      cardLast4: '4242',
      brand: 'Visa'
    },
    status: 'pending',
    trackingNumber,
    carrier: 'Ruptha Bazzar Priority Logistics',
    estimatedDelivery: 'In 3 business days',
    createdAt: new Date().toISOString(),
    trackingEvents: [
      {
        status: 'pending',
        title: 'Order Received & Authorized',
        description: 'Payment verified and order submitted to warehouse dispatch.',
        timestamp: 'Just now',
        location: 'Ruptha Bazzar Cloud Gateway',
        completed: true,
        current: true
      },
      {
        status: 'confirmed',
        title: 'Order Verified',
        description: 'Warehouse allocating pristine stock items.',
        timestamp: 'Estimated in 2 hours',
        location: 'Central Fulfillment Facility',
        completed: false
      },
      {
        status: 'processing',
        title: 'Packaging & Sealing',
        description: 'Packed securely in 100% recyclable tamper-evident cartons.',
        timestamp: 'Estimated in 6 hours',
        location: 'Bay Area Fulfillment Hub',
        completed: false
      },
      {
        status: 'shipped',
        title: 'Dispatched with Carrier',
        description: 'Courier scan verified; tracking is active.',
        timestamp: 'Tomorrow morning',
        location: 'Regional Sorting Facility',
        completed: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Final Delivery',
        description: 'With local driver on the delivery vehicle.',
        timestamp: 'In 2 days',
        location: 'Your local delivery depot',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivery Complete',
        description: 'Delivered directly to designated address.',
        timestamp: 'In 3 days',
        location: req.body.shippingAddress?.city || 'Your doorstep',
        completed: false
      }
    ]
  };

  orders.unshift(newOrder);

  // Update customer reward points
  currentUser.rewardPoints = Math.max(0, currentUser.rewardPoints - (req.body.pointsRedeemed || 0) + newOrder.pointsEarned);

  res.status(201).json(newOrder);
});

apiRouter.patch('/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body as { status: OrderStatus };
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  // Update tracking events accordingly
  const statusRanks: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    out_for_delivery: 4,
    delivered: 5,
    cancelled: -1
  };

  const currentRank = statusRanks[status] ?? 0;
  order.trackingEvents = order.trackingEvents.map((evt, idx) => ({
    ...evt,
    completed: idx <= currentRank,
    current: idx === currentRank
  }));

  res.json({ success: true, order });
});

apiRouter.post('/orders/:id/return', (req: Request, res: Response) => {
  const { reason } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.returnRequested = true;
  order.returnReason = reason || 'Customer requested return';
  res.json({ success: true, message: 'Return request submitted successfully', order });
});

// 6. COUPONS
apiRouter.get('/coupons', (_req: Request, res: Response) => {
  res.json(coupons);
});

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }
  const cleanCode = code.trim().toUpperCase();
  // Support both RUPTHA20 and BOKA20
  const coupon = coupons.find(
    c => c.code.toUpperCase() === cleanCode || (cleanCode === 'BOKA20' && c.code.toUpperCase() === 'RUPTHA20')
  );
  if (!coupon) {
    return res.status(404).json({ valid: false, error: 'Invalid coupon code' });
  }
  if (cartTotal && cartTotal < coupon.minOrderValue) {
    return res.status(400).json({
      valid: false,
      error: `Order minimum of $${coupon.minOrderValue} required for this coupon`
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Number(((cartTotal * coupon.discountValue) / 100).toFixed(2));
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    valid: true,
    coupon,
    discountAmount
  });
});

// 7. USER AUTH & PROFILE
apiRouter.get('/auth/me', (_req: Request, res: Response) => {
  res.json(currentUser);
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  if (role === 'admin' || email?.includes('admin')) {
    currentUser.role = 'admin';
    currentUser.name = 'Ruptha Bazzar Operations Admin';
    currentUser.email = 'admin@rupthabazzar.com';
  } else {
    currentUser.role = 'customer';
    if (email) currentUser.email = email;
  }
  res.json({ success: true, user: currentUser, token: 'demo-ruptha-token-' + Date.now() });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email } = req.body;
  currentUser = {
    ...currentUser,
    id: `usr-${Date.now()}`,
    name: name || currentUser.name,
    email: email || currentUser.email,
    rewardPoints: 200, // welcome bonus points
    createdAt: new Date().toISOString().split('T')[0]
  };
  res.json({ success: true, user: currentUser, token: 'demo-ruptha-token-' + Date.now() });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  currentUser = {
    ...currentUser,
    ...req.body
  };
  res.json({ success: true, user: currentUser });
});

apiRouter.post('/auth/address', (req: Request, res: Response) => {
  const newAddress: UserAddress = {
    ...req.body,
    id: `addr-${Date.now()}`,
    isDefault: currentUser.addresses.length === 0 || req.body.isDefault
  };

  if (newAddress.isDefault) {
    currentUser.addresses.forEach(a => (a.isDefault = false));
  }

  currentUser.addresses.push(newAddress);
  res.json({ success: true, addresses: currentUser.addresses });
});

apiRouter.delete('/auth/address/:id', (req: Request, res: Response) => {
  currentUser.addresses = currentUser.addresses.filter(a => a.id !== req.params.id);
  res.json({ success: true, addresses: currentUser.addresses });
});
