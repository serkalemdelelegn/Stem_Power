"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50 relative">
        {isSidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(false)}
            className="absolute top-4 left-4 z-50 bg-white hover:bg-gray-100 text-gray-800 shadow-md"
            title="Open Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {children}
      </main>
      <Toaster />
    </div>
  );
}
