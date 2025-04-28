

// ProductCard.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { Product } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product?: Product;  // Optional product for loading state
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading: isCartLoading } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Skeleton loader when no product is provided
  if (!product) {
    return (
      <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
        <div className="aspect-square bg-gray-100 animate-pulse"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div 
      className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          {/* Modifying the approach to focus on a zoom effect instead of scaling */}
          <div className="h-full w-full transition-all duration-300" 
               style={{ 
                 transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                 transformOrigin: 'center center' 
               }}>
            <ProductImage 
              src={product.image_url} 
              alt={product.name}
              priority={true}
            />
          </div>
        </Link>
        
        {product.in_stock > 0 && (
          <div className={`absolute top-0 left-0 m-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
            In Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-gray-900">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(String(product.price || 0)).toFixed(2)}
          </p>
          {!product.in_stock || product.in_stock <= 0 ? (
            <span className="text-sm text-red-500 font-medium">Out of stock</span>
          ) : null}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || product.in_stock <= 0 || isCartLoading}
            className={`flex items-center justify-center py-2 px-4 rounded-lg flex-1 transition-colors ${
              !product.in_stock || product.in_stock <= 0 ? 
              'bg-gray-100 text-gray-400 cursor-not-allowed' : 
              'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FiShoppingCart className="mr-2" />
            Add to Cart
          </button>
          
          <Link 
            href={`/products/${product.id}`}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg p-2 transition-colors"
          >
            <FiEye className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;