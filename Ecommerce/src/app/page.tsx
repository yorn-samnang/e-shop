'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiPackage, FiShield, FiTruck } from 'react-icons/fi';
import { productsAPI, bannersAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductImage from '@/components/products/ProductImage';
import ProductList from '@/components/products/ProductList';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/ui/ScrollReveal';
import HeroBannerCarousel, { Banner } from '@/components/ui/HeroBannerCarousel';
import { useAuth } from '@/hooks/useAuth';

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Everyday tech, made simple.', accent: 'bg-violet-100 text-violet-950' },
  { name: 'Clothing', slug: 'clothing', description: 'Easy pieces for every day.', accent: 'bg-rose-100 text-rose-950' },
  { name: 'Accessories', slug: 'accessories', description: 'The details that pull it together.', accent: 'bg-amber-100 text-amber-950' },
  { name: 'Home & Kitchen', slug: 'home', description: 'Small upgrades for your space.', accent: 'bg-emerald-100 text-emerald-950' },
];

const formatPrice = (price: Product['price']) => `$${Number(price || 0).toFixed(2)}`;

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getAll({ limit: 8 });
      const productData = response.data?.results ?? response.data;
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
      setError('We could not load the latest products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadBanners = useCallback(async () => {
    try {
      const response = await bannersAPI.getAll();
      const data = response.data?.results ?? response.data;
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching banners:', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadBanners();
  }, [loadProducts, loadBanners]);

  const featuredProduct = products[0];
  const newArrivals = products.slice(1, 5);

  return (
    <div className="space-y-16 pb-4 sm:space-y-20">
      <ScrollReveal>
        <HeroBannerCarousel banners={banners} />
      </ScrollReveal>

      <ScrollReveal>
      <section className="hidden sm:block">
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-primary-light">Browse with ease</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Shop by category</h2></div><Link href="/products" className="hidden items-center text-sm font-semibold text-slate-700 hover:text-primary dark:text-slate-200 dark:hover:text-primary-light sm:flex">View everything <FiArrowRight className="ml-1" /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => <Link key={category.slug} href={`/products?category=${category.slug}`} className={`group flex min-h-36 flex-col rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-h-44 sm:rounded-3xl sm:p-6 ${category.accent}`}><FiPackage className="h-5 w-5 sm:h-6 sm:w-6" /><div className="mt-auto flex items-end justify-between gap-2 pt-6 sm:gap-3"><div className="min-w-0"><h3 className="text-base font-semibold leading-tight sm:text-lg">{category.name}</h3><p className="mt-1 hidden text-sm opacity-70 min-[400px]:line-clamp-2">{category.description}</p></div><FiArrowRight className="mb-1 shrink-0 transition-transform group-hover:translate-x-1" /></div></Link>)}
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section>
        <div className="mb-7"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-primary-light">Editor&apos;s choice</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">A product worth a closer look</h2></div>
        {isLoading ? <div className="grid animate-pulse overflow-hidden rounded-3xl border border-slate-100 bg-white lg:grid-cols-2"><div className="min-h-80 bg-slate-100" /><div className="space-y-5 p-8"><div className="h-4 w-24 rounded bg-slate-100" /><div className="h-10 w-3/4 rounded bg-slate-100" /><div className="h-20 rounded bg-slate-100" /></div></div> : featuredProduct ? (
          <article className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
            <Link href={`/products/${featuredProduct.id}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100 sm:aspect-[16/10] md:aspect-auto md:min-h-[25rem]"><ProductImage src={featuredProduct.image_url} alt={featuredProduct.name} priority className="transition duration-500 hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 backdrop-blur dark:bg-slate-950/90 dark:text-slate-100 sm:left-5 sm:top-5">Featured pick</span></Link>
            <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">{featuredProduct.category && <p className="text-xs font-semibold capitalize text-primary dark:text-primary-light sm:text-sm">{featuredProduct.category.replace('-', ' ')}</p>}<h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:mt-3 sm:text-3xl">{featuredProduct.name}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-base sm:leading-7">{featuredProduct.description || 'A well-made find selected to make everyday life a little easier.'}</p><p className="mt-4 text-xl font-semibold text-slate-950 dark:text-white sm:mt-6 sm:text-2xl">{formatPrice(featuredProduct.price)}</p><div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7"><Link href={`/products/${featuredProduct.id}`}><Button>View product <FiArrowRight className="ml-2" /></Button></Link><Link href="/products" className="inline-flex min-h-10 items-center justify-center px-3 text-sm font-semibold text-slate-700 hover:text-primary dark:text-slate-200 dark:hover:text-primary-light">See all arrivals</Link></div></div>
          </article>
        ) : <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-600">New products will appear here soon.</div>}
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section>
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-primary-light">New arrivals</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Just landed</h2></div><Link href="/products" className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-primary dark:text-slate-200 dark:hover:text-primary-light">See all <FiArrowRight className="ml-1" /></Link></div>
        {error ? <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700"><p className="font-medium">{error}</p><button onClick={loadProducts} className="mt-3 text-sm font-semibold underline">Try again</button></div> : <ProductList products={newArrivals} isLoading={isLoading} />}
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="grid gap-4 rounded-3xl bg-slate-100 p-6 dark:bg-slate-800 sm:grid-cols-3 sm:p-8">
        {[[FiTruck, 'Straightforward delivery', 'Track your order from checkout to doorstep.'], [FiShield, 'Checkout with confidence', 'Your payment details stay protected.'], [FiCheck, 'Quality in the details', 'Products selected for everyday usefulness.']].map(([Icon, title, description]) => { const FeatureIcon = Icon as React.ElementType; return <div key={title as string} className="flex gap-4 rounded-2xl bg-white p-5 dark:bg-slate-900"><FeatureIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-primary-light" /><div><h3 className="font-semibold text-slate-950 dark:text-white">{title as string}</h3><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{description as string}</p></div></div>; })}
      </section>
      </ScrollReveal>

      {!isAuthLoading && !isAuthenticated && <ScrollReveal><section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:px-10"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-primary-light">Keep your favorites close</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Create an account for a smoother shop.</h2><p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">Save your details and keep track of every order in one place.</p><Link href="/auth/register" className="mt-6 inline-flex"><Button>Create account <FiArrowRight className="ml-2" /></Button></Link></section></ScrollReveal>}
    </div>
  );
}
