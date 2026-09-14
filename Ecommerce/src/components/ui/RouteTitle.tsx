'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'E-Shop';
  if (/^\/products\/[^/]+$/.test(pathname)) return 'Product details | E-Shop';
  if (pathname === '/products') return 'Products | E-Shop';
  if (pathname === '/cart') return 'Shopping cart | E-Shop';
  if (/^\/orders\/[^/]+$/.test(pathname)) return 'Order details | E-Shop';
  if (pathname === '/orders') return 'My orders | E-Shop';
  if (pathname === '/profile') return 'My profile | E-Shop';
  if (pathname === '/auth/login') return 'Sign in | E-Shop';
  if (pathname === '/auth/register') return 'Create account | E-Shop';
  return 'E-Shop';
}

export default function RouteTitle() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = getPageTitle(pathname);
  }, [pathname]);

  return null;
}
