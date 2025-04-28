// Products/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import ProductImage from '@/components/products/ProductImage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
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
          // Process the product data
          const productData = response.data;
          
          // Format price if needed
          if (productData && typeof productData.price === 'string') {
            productData.price = parseFloat(productData.price);
          }
          
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        if (isMounted) {
          setError('Failed to load product details. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
    
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({ product_id: product.id, quantity });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
          </div>
          <div className="md:w-1/2">
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Error Loading Product</h1>
        <p className="mb-6 text-red-500">{error}</p>
        <Link href="/products">
          <Button>
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products">
          <Button>
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/products" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
            <ProductImage 
              src={product.image_url} 
              alt={product.name}
              priority // Add priority for LCP image
            />
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-primary-600 mb-4">
            ${typeof product.price === 'number' 
              ? product.price.toFixed(2) 
              : parseFloat(String(product.price || 0)).toFixed(2)}
          </p>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{product.description}</p>
            
            <div className="flex items-center mb-4">
              <span className="mr-2">Availability:</span>
              {product.in_stock > 0 ? (
                <span className="text-green-600 font-medium">{product.in_stock} in stock</span>
              ) : (
                <span className="text-red-500 font-medium">Out of stock</span>
              )}
            </div>
          </div>

          {product.in_stock > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="mr-4">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.in_stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                isLoading={isCartLoading}
                fullWidth
                size="lg"
                className="mb-4"
              >
                <FiShoppingCart className="mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}