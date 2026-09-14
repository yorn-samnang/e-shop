'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getPageTitle(pathname: string): string {
  if (pathname === '/login') return 'Admin sign in | E-Shop';
  if (pathname === '/dashboard') return 'Dashboard | E-Shop Admin';
  if (/^\/users\/[^/]+$/.test(pathname)) return 'User details | E-Shop Admin';
  if (pathname === '/users') return 'Users | E-Shop Admin';
  if (/^\/products\/[^/]+$/.test(pathname)) return 'Product details | E-Shop Admin';
  if (pathname === '/products') return 'Products | E-Shop Admin';
  if (/^\/orders\/[^/]+$/.test(pathname)) return 'Order details | E-Shop Admin';
  if (pathname === '/orders') return 'Orders | E-Shop Admin';
  if (pathname === '/banners') return 'Banners | E-Shop Admin';
  if (pathname === '/settings') return 'Settings | E-Shop Admin';
  return 'E-Shop Admin';
}

export default function RouteTitle() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = getPageTitle(pathname);
  }, [pathname]);

  return null;
}
