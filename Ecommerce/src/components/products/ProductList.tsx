// ProductList.tsx
'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';

interface ProductListProps {
  products: Product[] | null | undefined;
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-60 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-6 rounded mb-2 w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-10 rounded mt-6"></div>
          </div>
        ))}
      </div>
    );
  }

  // Check if products is an array and has items
  const productArray = Array.isArray(products) ? products : [];
  
  if (productArray.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-2 text-sm text-gray-500">Try changing your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {productArray.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
