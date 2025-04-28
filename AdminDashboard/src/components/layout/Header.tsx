import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { BellIcon, ChevronDownIcon, MenuIcon, UserIcon } from "lucide-react";
import type React from "react";
interface HeaderProps {
  toggleSidebar: () => void;
}
export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("api/auth/me/");
      return res.data;
    },
  });

  const username = data?.username;

  return (
    <header className="z-20 flex items-center justify-between border-gray-200 border-b bg-white bg-white px-4 py-3">
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleSidebar}
          className="mr-4 rounded-md p-1 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon size={24} />
        </button>
        <h1 className="font-semibold text-[#1E40AF] text-xl md:hidden">
          {username}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            type="button"
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#DC2626]" />
          </button>
        </div>
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E40AF] text-white">
            <UserIcon size={16} />
          </div>
          <div className="ml-2 hidden md:block">
            <p className="font-medium text-sm">{username}</p>
          </div>
          <ChevronDownIcon size={16} className="ml-1" />
        </div>
      </div>
    </header>
  );
};
