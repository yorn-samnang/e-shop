'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  button_label?: string;
  button_link?: string;
}

interface HeroBannerCarouselProps {
  banners: Banner[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:8000';

function resolveImageUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${API_BASE}${image.startsWith('/') ? '' : '/'}${image}`;
}

export default function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = banners.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return;
      setIsAnimating(true);
      setCurrent((index + count) % count);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [current, count, isAnimating],
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Auto-advance every 5s
  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    autoplayRef.current = setTimeout(() => next(), 5000);
  }, [next]);

  useEffect(() => {
    if (count > 1) resetAutoplay();
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [current, count, resetAutoplay]);

  if (count === 0) return null;

  const banner = banners[current];

  return (
    <section
      aria-label="Featured promotions"
      aria-roledescription="carousel"
      className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 shadow-sm sm:rounded-[2rem]"
    >
      {/* Slides */}
      <div className="relative min-h-[400px] sm:min-h-[420px] lg:min-h-[500px]">
        {/* Background image */}
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: isAnimating ? 0 : 1 }}
        >
          {banner.image && (
            <img
              src={resolveImageUrl(banner.image)}
              alt={banner.title}
              className="h-full w-full object-cover object-center"
            />
          )}
          {/* Mobile copy sits at the bottom; desktop copy stays left aligned. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/30 sm:to-transparent" />
        </div>

        {/* Text content */}
        <div
          className="relative flex h-full min-h-[400px] flex-col justify-end px-5 pb-14 pt-24 sm:min-h-[420px] sm:justify-center sm:px-14 sm:py-12 lg:min-h-[500px] lg:max-w-2xl lg:px-20"
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateX(-12px)' : 'translateX(0)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/70 sm:hidden">
            Featured collection
          </p>
          <h1 className="max-w-[17rem] text-[1.75rem] font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm sm:max-w-none sm:text-4xl lg:text-5xl">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mt-3 line-clamp-2 max-w-[19rem] text-sm leading-6 text-white/75 sm:mt-4 sm:max-w-md sm:text-lg sm:leading-relaxed">
              {banner.subtitle}
            </p>
          )}
          {banner.button_label && banner.button_link && (
            <Link
              href={banner.button_link}
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-orange-50 active:scale-95 sm:mt-7 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
            >
              {banner.button_label}
              <FiChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {/* Nav arrows — only show when more than 1 banner */}
      {count > 1 && (
        <>
          <div className="absolute right-4 top-4 z-10 flex items-center rounded-full border border-white/15 bg-black/30 p-1 shadow-lg backdrop-blur-md sm:contents">
            <button
              onClick={() => { prev(); resetAutoplay(); }}
              aria-label="Previous banner"
              className="rounded-full p-2 text-white transition hover:bg-white/20 active:scale-90 sm:absolute sm:left-5 sm:top-1/2 sm:-translate-y-1/2 sm:bg-white/80 sm:p-3 sm:text-black sm:shadow-md sm:backdrop-blur sm:hover:bg-white"
            >
              <FiChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <span className="h-4 w-px bg-white/20 sm:hidden" aria-hidden="true" />
            <button
              onClick={() => { next(); resetAutoplay(); }}
              aria-label="Next banner"
              className="rounded-full p-2 text-white transition hover:bg-white/20 active:scale-90 sm:absolute sm:right-5 sm:top-1/2 sm:-translate-y-1/2 sm:bg-white/80 sm:p-3 sm:text-black sm:shadow-md sm:backdrop-blur sm:hover:bg-white"
            >
              <FiChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-5 flex gap-1.5 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetAutoplay(); }}
                aria-label={`Go to banner ${i + 1}`}
                aria-current={i === current ? 'true' : undefined}
                className={`h-1 rounded-full transition-all sm:h-2 ${
                  i === current ? 'w-7 bg-white sm:w-6' : 'w-3 bg-white/35 hover:bg-white/70 sm:w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
