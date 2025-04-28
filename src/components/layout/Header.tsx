// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useCart } from '@/hooks/useCart';
// import { motion, AnimatePresence } from 'framer-motion'; 

// const Header = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const { totalItems } = useCart();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearchOpen, setIsSearchOpen] = useState(false);

//   // Sync search state with URL on load
//   useEffect(() => {
//     if (pathname === '/products') {
//       const url = new URL(window.location.href);
//       const searchParam = url.searchParams.get('search');
//       if (searchParam) {
//         setSearchQuery(searchParam);
//       }
//     }
//   }, [pathname]);

//   const handleSearch = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
    
//     if (searchQuery.trim()) {
//       // Navigate to products page with search parameter
//       router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      
//       // Also dispatch custom event for immediate results on products page
//       const searchEvent = new CustomEvent('searchChange', { 
//         detail: searchQuery 
//       });
//       window.dispatchEvent(searchEvent);
      
//       // Close search on mobile after search is executed
//       if (window.innerWidth < 768) {
//         setIsSearchOpen(false);
//       }
//     }
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     // Close search if menu is opened
//     if (!isMenuOpen) setIsSearchOpen(false);
//   };

//   const toggleSearch = () => {
//     setIsSearchOpen(!isSearchOpen);
//     // Close menu if search is opened
//     if (!isSearchOpen) setIsMenuOpen(false);
//   };

//   const handleSearchKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     } else if (e.key === 'Escape') {
//       setIsSearchOpen(false);
//     }
//   };

//   return (
//     <header className="bg-white border-b border-divider sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="flex items-center">
//               <span className="text-2xl font-bold text-primary">E-Shop</span>
//             </Link>
//           </div>
          
//           {/* Desktop Navigation */}
//           <AnimatePresence>
//             {!isSearchOpen ? (
//               <motion.nav 
//                 className="hidden md:flex items-center space-x-4"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Link
//                   href="/products"
//                   className={`text-text-primary hover:text-primary px-3 py-2 text-sm font-medium ${
//                     pathname === '/products' ? 'text-primary' : ''
//                   }`}
//                 >
//                   Products
//                 </Link>
                
//                 <button
//                   onClick={toggleSearch}
//                   className="text-text-primary hover:text-primary px-3 py-2 text-sm font-medium"
//                   aria-label="Open search"
//                 >
//                   <Search className="h-6 w-6" />
//                 </button>
                
//                 <Link
//                   href="/cart"
//                   className="text-text-primary hover:text-primary px-3 py-2 text-sm font-medium relative"
//                 >
//                   <ShoppingCart className="h-6 w-6" />
//                   {totalItems > 0 && (
//                     <motion.span
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ type: 'spring', stiffness: 300 }}
//                       className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 bg-primary text-red-100 text-[10px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full shadow-md select-none leading-none"
//                     >
//                       {totalItems > 99 ? '99+' : totalItems}
//                     </motion.span>
//                   )}
//                 </Link>
                
//                 {isAuthenticated ? (
//                   <div className="relative">
//                     <Link
//                       href="/profile"
//                       className="text-text-primary hover:text-primary px-3 py-2 text-sm font-medium"
//                     >
//                       <User className="h-6 w-6" />
//                     </Link>
//                   </div>
//                 ) : (
//                   <div className="flex items-center space-x-2">
//                     <Link 
//                       href="/auth/login"
//                       className="text-sm font-medium px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
//                     >
//                       Sign In
//                     </Link>
//                   </div>
//                 )}
//               </motion.nav>
//             ) : (
//               <motion.div 
//                 className="hidden md:flex flex-grow max-w-lg items-center mx-4"
//                 initial={{ width: 0, opacity: 0 }}
//                 animate={{ width: "100%", opacity: 1 }}
//                 exit={{ width: 0, opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 25 }}
//               >
//                 <form onSubmit={handleSearch} className="w-full relative">
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     className="w-full pl-10 pr-10 py-2 rounded-md border border-divider focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyDown={handleSearchKeyDown}
//                     autoFocus
//                   />
//                   <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
//                   <button
//                     type="button"
//                     onClick={() => setIsSearchOpen(false)}
//                     className="absolute right-3 top-2.5 text-text-secondary hover:text-primary"
//                     aria-label="Close search"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </form>
//               </motion.div>
//             )}
//           </AnimatePresence>
          
//           {/* Mobile Controls */}
//           <div className="md:hidden flex items-center space-x-3">
//             <button
//               type="button"
//               onClick={toggleSearch}
//               className="text-text-primary hover:text-primary"
//               aria-label="Toggle search"
//             >
//               <Search className="h-6 w-6" />
//             </button>
            
//             <Link href="/cart" className="text-text-primary relative">
//               <ShoppingCart className="h-6 w-6" />
//               {totalItems > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {totalItems > 99 ? '99+' : totalItems}
//                 </span>
//               )}
//             </Link>
            
//             <button
//               type="button"
//               onClick={toggleMenu}
//               className="text-text-primary hover:text-primary focus:outline-none focus:text-primary"
//               aria-label="Toggle menu"
//             >
//               <Menu className="h-6 w-6" aria-hidden="true" />
//             </button>
//           </div>
//         </div>
        
//         {/* Mobile Search */}
//         <AnimatePresence>
//           {isSearchOpen && (
//             <motion.div 
//               className="md:hidden py-2"
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <form onSubmit={handleSearch} className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   className="w-full pl-10 pr-10 py-2 rounded-md border border-divider focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyDown={handleSearchKeyDown}
//                   autoFocus
//                 />
//                 <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
//                 <button
//                   type="button"
//                   onClick={() => setIsSearchOpen(false)}
//                   className="absolute right-3 top-2.5 text-text-secondary hover:text-primary"
//                   aria-label="Close search"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </form>
//             </motion.div>
//           )}
//         </AnimatePresence>
        
//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div 
//               className="md:hidden"
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                 <Link
//                   href="/products"
//                   className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Products
//                 </Link>
                
//                 {isAuthenticated ? (
//                   <>
//                     <Link
//                       href="/profile"
//                       className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       My Profile
//                     </Link>
//                     <Link
//                       href="/orders"
//                       className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       My Orders
//                     </Link>
//                     <button
//                       onClick={() => {
//                         logout();
//                         setIsMenuOpen(false);
//                       }}
//                       className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
//                     >
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <div className="space-y-2 pt-2">
//                     <Link
//                       href="/auth/login"
//                       className="block w-full text-center px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Sign In
//                     </Link>
//                     <Link
//                       href="/auth/register"
//                       className="block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Register
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </header>
//   );
// };

// export default Header;



'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion'; 

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(totalItems);

  // Sync search state with URL on load
  useEffect(() => {
    if (pathname === '/products') {
      const url = new URL(window.location.href);
      const searchParam = url.searchParams.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, [pathname]);

  // Track changes to cart items to trigger animation
  useEffect(() => {
    // Don't run animation on first render
    if (prevTotalItems !== totalItems && prevTotalItems !== 0) {
      setIsCartUpdated(true);
      const timer = setTimeout(() => {
        setIsCartUpdated(false);
      }, 1500); // Animation duration
      
      return () => clearTimeout(timer);
    }
    
    setPrevTotalItems(totalItems);
  }, [totalItems, prevTotalItems]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      // Navigate to products page with search parameter
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      
      // Also dispatch custom event for immediate results on products page
      const searchEvent = new CustomEvent('searchChange', { 
        detail: searchQuery 
      });
      window.dispatchEvent(searchEvent);
      
      // Close search on mobile after search is executed
      if (window.innerWidth < 768) {
        setIsSearchOpen(false);
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close search if menu is opened
    if (!isMenuOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close menu if search is opened
    if (!isSearchOpen) setIsMenuOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const cartCountVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    updated: {
      scale: [1, 1.5, 1], 
      backgroundColor: ["#ef4444", "#ef4444", "#ef4444"],
      boxShadow: [
        "0 0 0 0 rgba(239, 68, 68, 0.7)",
        "0 0 0 10px rgba(239, 68, 68, 0)",
        "0 0 0 0 rgba(239, 68, 68, 0)"
      ],
      transition: { 
        duration: 0.8,
        times: [0, 0.5, 1],
        repeat: 1
      }
    }
  };

  return (
    <header className="bg-white border-b border-divider sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">E-Shop</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <AnimatePresence>
            {!isSearchOpen ? (
              <motion.nav 
                className="hidden md:flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/products"
                  className={`text-text-primary hover:text-primary px-3 py-2 text-sm font-medium ${
                    pathname === '/products' ? 'text-primary' : ''
                  }`}
                >
                  Products
                </Link>
                
                <button
                  onClick={toggleSearch}
                  className="text-text-primary hover:text-primary px-3 py-2 text-sm font-medium"
                  aria-label="Open search"
                >
                  <Search className="h-6 w-6" />
                </button>
                
                <Link
                  href="/cart"
                  className="text-text-primary hover:text-primary px-3 py-2 text-sm font-medium relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <motion.span
                      variants={cartCountVariants}
                      initial="initial"
                      animate={isCartUpdated ? "updated" : "animate"}
                      className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full shadow-md select-none leading-none"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </Link>
                
                {isAuthenticated ? (
                  <div className="relative">
                    <Link
                      href="/profile"
                      className="text-text-primary hover:text-primary px-3 py-2 text-sm font-medium"
                    >
                      <User className="h-6 w-6" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link 
                      href="/auth/login"
                      className="text-sm font-medium px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </motion.nav>
            ) : (
              <motion.div 
                className="hidden md:flex flex-grow max-w-lg items-center mx-4"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <form onSubmit={handleSearch} className="w-full relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-10 py-2 rounded-md border border-divider focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    autoFocus
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-2.5 text-text-secondary hover:text-primary"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleSearch}
              className="text-text-primary hover:text-primary"
              aria-label="Toggle search"
            >
              <Search className="h-6 w-6" />
            </button>
            
            <Link href="/cart" className="text-text-primary relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <motion.span
                  variants={cartCountVariants}
                  initial="initial"
                  animate={isCartUpdated ? "updated" : "animate"}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>
            
            <button
              type="button"
              onClick={toggleMenu}
              className="text-text-primary hover:text-primary focus:outline-none focus:text-primary"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              className="md:hidden py-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-10 py-2 rounded-md border border-divider focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-2.5 text-text-secondary hover:text-primary"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/products"
                  className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-primary hover:text-primary hover:bg-bg-secondary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link
                      href="/auth/login"
                      className="block w-full text-center px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;