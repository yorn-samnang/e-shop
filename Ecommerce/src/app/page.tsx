'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { productsAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductList from '@/components/products/ProductList';
import Button from '@/components/ui/Button';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch products from API with explicit error handling
        const response = await productsAPI.getAll({ limit: 4 });
        
        // Check if response has the expected structure
        if (!response || !response.data) {
          throw new Error('Invalid API response format');
        }
        
        setProducts(Array.isArray(response.data) ? response.data : 
                   (response.data.results ? response.data.results : []));
        
      } catch (err: any) {
        console.error('Error fetching products:', err);
        
        // Simple error handling
        let errorMessage = 'Failed to load products. Please try again later.';
        
        // Log the error for developers
        if (err.response) {
          console.error('Error response:', err.response.status, err.response.data);
        } else if (err.request) {
          console.error('Error request:', err.request);
        } else {
          console.error('Error:', err.message);
        }
        
        setError(errorMessage);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Simple Hero Section */}
      <div className="bg-primary-100 rounded-lg p-6 mb-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">Welcome to E-Shop</h1>
          <p className="text-lg mb-6">
            Find quality products at competitive prices
          </p>
          <Link href="/products">
            <Button>
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Debug info removed */}

      {/* Main Products Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Our Products</h2>
          <Link 
            href="/products" 
            className="text-primary-600 hover:text-primary-800 flex items-center"
          >
            View All <FiArrowRight className="ml-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex justify-center items-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-2">Please check your network connection or try again later</p>
            <button 
              onClick={() => {
                setIsLoading(true);
                setError(null);
                // Force re-fetch
                setTimeout(() => {
                  const fetchAgain = async () => {
                    try {
                      const response = await productsAPI.getAll({ limit: 8 });
                      setProducts(Array.isArray(response.data) ? response.data : 
                               (response.data.results ? response.data.results : []));
                      setError(null);
                    } catch (err) {
                      console.error('Retry failed:', err);
                      setError('Retry failed. Please refresh the page or try again later.');
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  fetchAgain();
                }, 1000);
              }}
              className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && (
          <>
            {products && products.length > 0 ? (
              <ProductList products={products} isLoading={false} />
            ) : (
              <div className="bg-gray-50 text-gray-500 p-4 rounded-md mb-6 text-center">
                <p>No products available at this time.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/products?category=electronics" 
            className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition-colors"
          >
            <h3 className="font-medium">Electronics</h3>
          </Link>
          <Link 
            href="/products?category=clothing" 
            className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition-colors"
          >
            <h3 className="font-medium">Clothing</h3>
          </Link>
          <Link 
            href="/products?category=accessories" 
            className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition-colors"
          >
            <h3 className="font-medium">Accessories</h3>
          </Link>
          <Link 
            href="/products?category=home" 
            className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition-colors"
          >
            <h3 className="font-medium">Home & Kitchen</h3>
          </Link>
        </div>
      </div>

      {/* Simple CTA */}
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Ready to start shopping?</h2>
        <p className="mb-4">Create an account to get started</p>
        <Link href="/auth/register">
          <Button>
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  );
}