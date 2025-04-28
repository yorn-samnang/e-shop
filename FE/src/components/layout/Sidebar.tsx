'use client';
import { LayoutDashboardIcon, UsersIcon, ShoppingBagIcon, ShoppingCartIcon, SettingsIcon, ChevronLeftIcon   } from "lucide-react";
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
  }, {
    name: 'Users',
    path: '/users',
    icon: <UsersIcon size={20} />
  }, {
    name: 'Products',
    path: '/products',
    icon: <ShoppingBagIcon size={20} />
  }, {
    name: 'Orders',
    path: '/orders',
    icon: <ShoppingCartIcon size={20} />
  }, {
    name: 'Settings',
    path: '/settings',
    icon: <SettingsIcon size={20} />
  }];
  return <div className={`${className} bg-background shrink-0 text-foreground transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 lg:w-20'} lg:relative h-full z-40`}>
      <div className="flex items-start justify-between h-16 px-4">
        <div className={`flex items-center ${isOpen ? '' : 'lg:justify-center'}`}>
          <div className="h-8 w-8 rounded bg-[#0EA5E9] flex items-center justify-center font-bold">
            E
          </div>
          {isOpen && <span className="ml-2 text-xl font-semibold">E-Admin</span>}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-md hover:bg-gray-700 hidden lg:block" aria-label="Toggle sidebar width">
          <ChevronLeftIcon size={20} className={`transition-transform ${isOpen ? '' : 'transform rotate-180'}`} />
        </button>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map(item => <li key={item.path}>
              <Link href={item.path} className={`flex items-center p-3 rounded-md ${pathname.startsWith(item.path) ? 'bg-[#0EA5E9] bg-opacity-20 text-white' : 'hover:bg-gray-700'} ${isOpen ? '' : 'lg:justify-center'}`}>
                <span>{item.icon}</span>
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>)}
        </ul>
      </nav>
    </div>;
};
