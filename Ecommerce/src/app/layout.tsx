'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import PageLoader from '@/components/ui/PageLoader';
import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { usePathname } from 'next/navigation';
import RouteTitle from '@/components/ui/RouteTitle';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const navigationStartUrl = useRef('');

  useEffect(() => {
    // Show loader until fonts + first paint settle
    const timer = setTimeout(() => setIsInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (!isNavigating) return;
    const interval = window.setInterval(() => {
      if (window.location.href !== navigationStartUrl.current) setIsNavigating(false);
    }, 50);
    const timeout = window.setTimeout(() => setIsNavigating(false), 8000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [isNavigating]);

  useEffect(() => {
    const startNavigation = () => {
      navigationStartUrl.current = window.location.href;
      setIsNavigating(true);
    };
    const endNavigation = () => setIsNavigating(false);
    window.addEventListener('route-navigation-start', startNavigation);
    window.addEventListener('route-navigation-end', endNavigation);
    return () => {
      window.removeEventListener('route-navigation-start', startNavigation);
      window.removeEventListener('route-navigation-end', endNavigation);
    };
  }, []);

  const handleNavigationClick = (event: React.MouseEvent<HTMLBodyElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.target === '_blank') return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin === window.location.origin && destination.href !== window.location.href && !destination.hash) {
      navigationStartUrl.current = window.location.href;
      setIsNavigating(true);
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>E-Shop</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`} onClickCapture={handleNavigationClick}>
        <ThemeProvider>
          <RouteTitle />
          <AuthProvider>
            <CartProvider>
              {(isInitialLoading || isNavigating) && <PageLoader />}
              <Header />
              <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </div>
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
