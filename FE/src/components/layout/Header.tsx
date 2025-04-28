import React from 'react';
import { BellIcon, MenuIcon, UserIcon, ChevronDownIcon } from 'lucide-react';
interface HeaderProps {
  toggleSidebar: () => void;
}
export const Header: React.FC<HeaderProps> = ({
  toggleSidebar
}) => {
  return <header className="bg-white bg-white z-20 border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 p-1 rounded-md hover:bg-gray-100 lg:hidden" aria-label="Toggle sidebar">
          <MenuIcon size={24} />
        </button>
        <h1 className="text-xl font-semibold text-[#1E40AF] md:hidden">
          Admin
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-1 rounded-full hover:bg-gray-100" aria-label="Notifications">
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#DC2626]"></span>
          </button>
        </div>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-[#1E40AF] flex items-center justify-center text-white">
            <UserIcon size={16} />
          </div>
          <div className="ml-2 hidden md:block">
            <p className="text-sm font-medium">Admin User</p>
          </div>
          <ChevronDownIcon size={16} className="ml-1" />
        </div>
      </div>
    </header>;
};
