'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();
  const linkClass = 'text-sm text-text-secondary transition-colors hover:text-primary dark:hover:text-primary-light';
  const socialClass = 'rounded-lg border border-divider p-2 text-text-secondary transition-colors hover:border-primary hover:text-primary';

  return (
    <footer className="border-t border-divider bg-white text-text-primary dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="E-Shop home">
              <img src="/logo.png" alt="" className="h-12 w-auto" />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-text-secondary">
              Your one-stop shop for quality products at affordable prices.
            </p>
            <div className="mt-5 flex gap-2">
              <a href="#" aria-label="Twitter" className={socialClass}><FiTwitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className={socialClass}><FiFacebook className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className={socialClass}><FiInstagram className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className={linkClass}>All products</Link></li>
              <li><Link href="/products?category=electronics" className={linkClass}>Electronics</Link></li>
              <li><Link href="/products?category=clothing" className={linkClass}>Clothing</Link></li>
              <li><Link href="/products?category=home" className={linkClass}>Home &amp; Kitchen</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Account</h3>
            <ul className="space-y-3">
              <li><Link href="/cart" className={linkClass}>Shopping cart</Link></li>
              {isAuthenticated ? (
                <>
                  <li><Link href="/orders" className={linkClass}>My orders</Link></li>
                  <li><Link href="/profile" className={linkClass}>My profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/auth/login" className={linkClass}>Sign in</Link></li>
                  <li><Link href="/auth/register" className={linkClass}>Create account</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-9 border-t border-divider pt-6">
          <p className="text-center text-sm text-text-secondary sm:text-left">
            &copy; {currentYear} E-Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
