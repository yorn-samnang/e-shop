// Products/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { productsAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductList from '@/components/products/ProductList';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'default';

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  // Categories would typically come from an API, but we'll hardcode for this example
  const categories = [
    { id: '', name: 'All' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'default', name: 'Default' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name-asc', name: 'Name: A to Z' },
    { id: 'name-desc', name: 'Name: Z to A' },
  ];

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Define params object based on your category state variable
        const params: Record<string, string> = {};
        if (category) params.category = category;
  
        const response = await productsAPI.getAll(params);
        
        // Handle both paginated and non-paginated responses
        const productData = response.data.results || response.data || [];
        
        if (isMounted) {
          setProducts(productData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
  
    fetchProducts();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [category]);

  // Handle filtering and sorting whenever products, search, or sort option changes
  useEffect(() => {
    if (isLoading) return;

    let result = [...products];
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (could be by popularity or featured status)
        break;
    }
    
    setFilteredProducts(result);
  }, [products, search, sortOption, isLoading]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  // Clear all filters and sorting
  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setSortOption('default');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 px-3 flex items-center">
              <FiSearch className="text-gray-500" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={category}
                onChange={handleCategoryChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter by category"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                aria-label="Sort products"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              className="flex items-center md:hidden"
            >
              <FiFilter className="mr-1" />
              Filters
            </Button>
          </div>
        </div>

        {/* Active filters summary and clear button */}
        {(search || category !== '' || sortOption !== 'default') && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} products found
              {search && <span> for "{search}"</span>}
              {category && <span> in {categories.find(c => c.id === category)?.name}</span>}
              {sortOption !== 'default' && <span> sorted by {sortOptions.find(s => s.id === sortOption)?.name}</span>}
            </div>
            <button 
              onClick={handleClearFilters}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Mobile filters */}
        {showFilters && (
          <div className="mt-4 p-4 border rounded-md md:hidden">
            <h3 className="font-medium mb-2">Filters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Sort by</label>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-full p-2 border rounded"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Additional mobile filter options would go here */}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <ProductList products={filteredProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}