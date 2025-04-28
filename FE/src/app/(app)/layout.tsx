"use client";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const layout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div className="flex min-h-0 grow flex-col">
      <Header toggleSidebar={() => setIsOpen((p) => !p)} />
      <div className="flex min-h-0 grow gap-x-4 px-4 py-8">
        <Sidebar className="max-h-dvh" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="grow overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default layout;
