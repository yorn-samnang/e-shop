// Products/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FiShoppingCart, FiArrowLeft, FiPackage, FiShield, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import ProductImage from '@/components/products/ProductImage';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      if (!productId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await productsAPI.getById(productId);
        if (isMounted) {
          const productData = response.data;
          if (productData && typeof productData.price === 'string') {
            productData.price = parseFloat(productData.price);
          }
          setProduct(productData);
        }
      } catch {
        if (isMounted) setError('Failed to load product details. Please try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({ product_id: product.id, quantity });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-5 bg-slate-100 rounded-full w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-100 rounded-3xl" />
          <div className="space-y-5 pt-2">
            <div className="h-3 bg-slate-100 rounded-full w-24" />
            <div className="h-8 bg-slate-100 rounded-full w-3/4" />
            <div className="h-7 bg-slate-100 rounded-full w-1/4" />
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-slate-100 rounded-full" />
              <div className="h-4 bg-slate-100 rounded-full" />
              <div className="h-4 bg-slate-100 rounded-full w-3/4" />
            </div>
            <div className="h-12 bg-slate-100 rounded-xl w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <FiPackage className="h-9 w-9 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {error ? 'Something went wrong' : 'Product not found'}
        </h1>
        <p className="text-slate-500 mb-8 max-w-sm">
          {error ?? "The product you're looking for doesn't exist or has been removed."}
        </p>
        <Link href="/products">
          <Button><FiArrowLeft className="mr-2" /> Back to Products</Button>
        </Link>
      </div>
    );
  }

  const price =
    typeof product.price === 'number'
      ? product.price.toFixed(2)
      : parseFloat(String(product.price || 0)).toFixed(2);

  const inStock = product.in_stock > 0;

  return (
    <div className="space-y-10">

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Left — Image */}
        <div className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm aspect-square relative">
          <ProductImage src={product.image_url} alt={product.name} priority />

          {/* Stock badge */}
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold
              ${inStock ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}
          >
            {inStock ? `${product.in_stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Right — Info */}
        <div className="flex flex-col gap-6">

          {/* Category */}
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {product.category.replace('-', ' ')}
            </span>
          )}

          {/* Name + price */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-tight">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl font-bold text-primary">${price}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Description */}
          {product.description && (
            <p className="text-slate-600 leading-relaxed text-base">
              {product.description}
            </p>
          )}

          {/* Quantity + CTA */}
          {inStock ? (
            <div className="space-y-4">
              {/* Quantity picker */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">Quantity</span>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-lg font-medium transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-semibold text-slate-900 border-x border-slate-200 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.in_stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-lg font-medium transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <Button
                onClick={handleAddToCart}
                isLoading={isCartLoading}
                fullWidth
                size="lg"
              >
                <FiShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-slate-500 text-sm font-medium">
              This product is currently out of stock
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: FiPackage,   label: 'Fast shipping' },
              { icon: FiShield,   label: 'Secure checkout' },
              { icon: FiRefreshCw, label: '30-day returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3 text-center">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
