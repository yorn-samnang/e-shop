"use client";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import PageLoader from "@/components/ui/PageLoader";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const layout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const pathname = usePathname();

  // Only dismiss the loader when the new page's pathname is actually rendered.
  // Do NOT use window.location.href polling — that fires before React has
  // swapped in the new page content, causing the loader to vanish while the
  // old page is still visible.
  React.useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Safety-valve timeout so the loader never gets stuck forever.
  React.useEffect(() => {
    if (!isNavigating) return;
    const timeout = window.setTimeout(() => setIsNavigating(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [isNavigating]);

  const handleNavigationClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.target === "_blank") return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin === window.location.origin && destination.href !== window.location.href && !destination.hash) {
      setIsNavigating(true);
    }
  };

  return (
    <div
      className="flex min-h-0 grow bg-gray-50 dark:bg-slate-950"
      onClickCapture={handleNavigationClick}
    >
      {isNavigating && <PageLoader />}
      <Sidebar className="h-dvh max-h-dvh" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex min-w-0 grow flex-col">
        <Header toggleSidebar={() => setIsOpen((p) => !p)} />
        <main className="min-h-0 grow overflow-y-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default layout;
