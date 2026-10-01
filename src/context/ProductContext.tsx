import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '../data/mockData';
import { useToast } from './ToastContext';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  loading: boolean;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  addProduct: (productData: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewCount'>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('boka_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands] = useState<Brand[]>(INITIAL_BRANDS);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('boka_products', JSON.stringify(products));
  }, [products]);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res && res.ok && typeof res.json === 'function') {
        const data = await res.json();
        if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch {
      // offline/local fallback
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => p.slug === slug || p.id === slug);
  };

  const addProduct = async (
    productData: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewCount'>
  ): Promise<Product> => {
    const newId = `prod-${Date.now()}`;
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProd: Product = {
      ...productData,
      id: newId,
      slug,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };

    setProducts(prev => [newProd, ...prev]);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      showToast(`Product "${newProd.name}" published!`, 'success');
    } catch {
      showToast('Product added to catalog', 'success');
    }

    return newProd;
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    const existing = products.find(p => p.id === id);
    if (!existing) {
      throw new Error('Product not found');
    }
    const updated: Product = { ...existing, ...productData };

    setProducts(prev =>
      prev.map(p => (p.id === id ? updated : p))
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      showToast(`Product "${updated.name}" updated`, 'success');
    } catch {
      showToast('Product changes saved', 'info');
    }

    return updated;
  };

  const deleteProduct = async (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      showToast(`Deleted "${prod?.name || 'Product'}"`, 'info');
    } catch {
      showToast('Product removed', 'info');
    }
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0
    };

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const currentReviews = p.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = Number((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: newAvg
          };
        }
        return p;
      })
    );

    showToast('Your review has been published. Thank you!', 'success');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        brands,
        loading,
        getProductById,
        getProductBySlug,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        refreshProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within ProductProvider');
  return context;
};
