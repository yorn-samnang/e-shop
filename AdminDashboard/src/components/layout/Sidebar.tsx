'use client';
import { LayoutDashboardIcon, UsersIcon, ShoppingBagIcon, ShoppingCartIcon, SettingsIcon, ChevronLeftIcon, ImageIcon } from "lucide-react";

import Link from "next/link";

import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?:string
}
export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  className
}) => {
  const pathname = usePathname()
  const navItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboardIcon size={20} />
  },
  {
    name: 'Users',
    path: '/users',
    icon: <UsersIcon size={20} />
  }, {
    name: 'Products',
    path: '/products',
    icon: <ShoppingBagIcon size={20} />
  }, {
    name: 'Banners',
    path: '/banners',
    icon: <ImageIcon size={20} />
  }, {
    name: 'Orders',
    path: '/orders',
    icon: <ShoppingCartIcon size={20} />

  }, {
    name: 'Settings',
    path: '/settings',
    icon: <SettingsIcon size={20} />
  }];
  return <aside className={`${className} z-40 h-full shrink-0 overflow-hidden border-divider border-r bg-background text-foreground transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 lg:w-20'}`}>
      <div className="flex h-16 items-center justify-between px-4">
        <div className={`flex items-center ${isOpen ? '' : 'lg:justify-center'}`}>
          <img src="/logo.png" alt="E-Shop" className="h-10 w-10 object-contain" />
          {isOpen && <span className="ml-2 text-xl font-semibold text-primary">E-Admin</span>}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="hidden rounded-md p-1 hover:bg-brand-surface hover:text-primary lg:block" aria-label="Toggle sidebar width">
          <ChevronLeftIcon size={20} className={`transition-transform ${isOpen ? '' : 'transform rotate-180'}`} />
        </button>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map(item => <li key={item.path}>
              <Link href={item.path} className={`flex items-center p-3 rounded-md transition-colors ${pathname.startsWith(item.path) ? 'bg-primary text-white shadow-sm' : 'hover:bg-brand-surface hover:text-primary'} ${isOpen ? '' : 'lg:justify-center'}`}>
                <span>{item.icon}</span>
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>)}
        </ul>
      </nav>
    </aside>;
};
