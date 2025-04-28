'use client';

import React from 'react';
import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-bold text-primary-600 mb-4">E-Shop</h2>
            <p className="text-gray-600 mb-4">
              Your one-stop shop for quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <FiTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <FiFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <FiInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="text-gray-600 hover:text-gray-900">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="text-gray-600 hover:text-gray-900">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-600 hover:text-gray-900">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} E-Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;