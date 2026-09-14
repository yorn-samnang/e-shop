'use client';

import React from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { Product } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product?: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading: isCartLoading } = useCart();

  // ── Skeleton ─────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="group rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="aspect-[4/3] bg-slate-100" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-100 rounded-full w-3/4" />
          <div className="h-4 bg-slate-100 rounded-full w-1/3" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const price =
    typeof product.price === 'number'
      ? product.price.toFixed(2)
      : parseFloat(String(product.price || 0)).toFixed(2);

  const inStock = product.in_stock > 0;

  return (
    <div className="group rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">

      {/* ── Image ────────────────────────────────────────────── */}
      <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-50">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProductImage src={product.image_url} alt={product.name} priority />
        </div>

        {/* Status badge */}
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wide sm:left-3 sm:top-3 sm:px-2.5 sm:text-xs
            ${inStock ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}
        >
          {inStock ? 'In Stock' : 'Sold Out'}
        </span>

        {/* Quick-view overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all duration-300">
          <span className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-slate-800 shadow">
            <FiEye className="w-4 h-4" /> Quick view
          </span>
        </div>
      </Link>

      {/* ── Info ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        {/* Category pill */}
        {product.category && (
          <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-primary/70 sm:text-xs sm:tracking-widest">
            {product.category.replace('-', ' ')}
          </span>
        )}

        <Link href={`/products/${product.id}`} className="block flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors hover:text-primary sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-slate-900 sm:text-lg">${price}</p>
          {!inStock && (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          )}
        </div>

        {/* ── Actions ──────────────────────────────────────── */}
        <div className="mt-auto flex gap-1.5 pt-1 sm:gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isCartLoading}
            aria-label={isCartLoading ? 'Adding product to cart' : 'Add product to cart'}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 sm:gap-2 sm:text-sm
              ${inStock
                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-sm hover:shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <FiShoppingCart className="h-4 w-4 shrink-0" />
            <span className="hidden min-[380px]:inline">{isCartLoading ? 'Adding…' : 'Add to cart'}</span>
          </button>

          <Link
            href={`/products/${product.id}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-orange-50 hover:text-primary sm:h-10 sm:w-10"
            aria-label="View product"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
