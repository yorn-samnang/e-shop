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
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-sm">
      {/* Slides */}
      <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px]">
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
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Text content */}
        <div
          className="relative flex h-full min-h-[340px] flex-col justify-center px-8 py-12 sm:min-h-[420px] sm:px-14 lg:min-h-[500px] lg:max-w-2xl lg:px-20"
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateX(-12px)' : 'translateX(0)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white drop-shadow sm:text-4xl lg:text-5xl">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              {banner.subtitle}
            </p>
          )}
          {banner.button_label && banner.button_link && (
            <Link
              href={banner.button_link}
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow transition hover:bg-slate-100 active:scale-95 sm:text-base"
            >
              {banner.button_label}
            </Link>
          )}
        </div>
      </div>

      {/* Nav arrows — only show when more than 1 banner */}
      {count > 1 && (
        <>
          <button
            onClick={() => { prev(); resetAutoplay(); }}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur transition hover:bg-white active:scale-90 sm:left-5 sm:p-3"
          >
            <FiChevronLeft className="h-5 w-5 text-slate-800 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={() => { next(); resetAutoplay(); }}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur transition hover:bg-white active:scale-90 sm:right-5 sm:p-3"
          >
            <FiChevronRight className="h-5 w-5 text-slate-800 sm:h-6 sm:w-6" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetAutoplay(); }}
                aria-label={`Go to banner ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
