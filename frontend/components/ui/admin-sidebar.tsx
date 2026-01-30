"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Lightbulb,
  Newspaper,
  LogOut,
  X,
  Phone,
  Layout,
  Navigation,
  MapPin,
  User,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// Removed backendApi import - using Next.js API routes instead to avoid CORS

const navigation = [
  {
    name: "Home",
    icon: Home,
    href: "/admin/home",
    pageId: "home",
  },
  {
    name: "About Us",
    href: "/admin/about",
    icon: FileText,
    pageId: "about",
  },
  {
    name: "Programs",
    icon: Lightbulb,
    href: "/admin/programs",
    pageId: "programs",
  },
  {
    name: "Latest News",
    icon: Newspaper,
    href: "/admin/latest",
    pageId: "latest",
  },
  { name: "Contact Us", href: "/admin/contact", icon: Phone, pageId: "contact" },
  { name: "Locations", href: "/admin/location", icon: MapPin, pageId: "location" },
  { name: "Header Navigation", href: "/admin/header", icon: Navigation, pageId: "header" },
  { name: "Footer", href: "/admin/footer", icon: Layout, pageId: "footer" },
  { name: "Account Management", href: "/admin/account", icon: Home, pageId: "account" },
  { name: "Profile", href: "/admin/profile", icon: User, pageId: "profile" },
];

export function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const [aboutOpen, setAboutOpen] = useState(true);
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean> | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  // Fetch current user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        // Use Next.js API route to avoid CORS issues
        const response = await fetch("/api/users/me", {
          credentials: "include", // Include cookies (JWT) in request
        });
        
        if (!response.ok) {
          // If unauthorized, user is not logged in
          if (response.status === 401 || response.status === 403) {
            setUserPermissions(null);
            setUserRole("");
            return;
          }
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        
        const user = await response.json();
        setUserRole(user.role || "");
        setUserPermissions(user.permissions || null);
      } catch (error: any) {
        // Silently handle errors - show navigation with fallback permissions
        // This allows the sidebar to render even if the API call fails
        console.warn("Could not fetch user permissions:", error.message);
        // On error, assume full access (fallback) so sidebar still shows
        setUserPermissions(null);
        setUserRole("");
      } finally {
        setIsLoadingPermissions(false);
      }
    };
    fetchUserPermissions();
  }, []);

  // Filter navigation based on permissions
  const getFilteredNavigation = () => {
    // If loading, show all items
    if (isLoadingPermissions) {
      return navigation;
    }

    // Super admin (admin role with null permissions) has full access
    if (userRole === "admin" && (userPermissions === null || userPermissions === undefined)) {
      return navigation;
    }

    // If user has permissions object, filter based on it
    if (userPermissions && typeof userPermissions === "object") {
      return navigation.filter((item) => {
        // Account Management is only for super admin (null permissions)
        if (item.pageId === "account") {
          return false; // Limited admins cannot access account management
        }
        // Profile is always accessible for admin/editor
        if (item.pageId === "profile") {
          return userRole === "admin" || userRole === "editor";
        }
        // Check if user has permission for this page
        return userPermissions[item.pageId] === true;
      });
    }

    // If permissions is empty object, user has no access (except profile for admin/editor)
    if (userPermissions && Object.keys(userPermissions).length === 0) {
      return navigation.filter((item) => {
        if (item.pageId === "profile") {
          return userRole === "admin" || userRole === "editor";
        }
        return false;
      });
    }

    // Default: show all for admin/editor, none for others
    if (userRole === "admin" || userRole === "editor") {
      return navigation;
    }

    return [];
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-linear-to-b from-[#367375] to-[#24C3BC] text-white transition-all duration-300",
        isCollapsed ? "w-0 overflow-hidden" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/STEMpower_s_logo.png"
            alt="STEMpower Logo"
            width={50}
            height={50}
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="font-semibold text-lg leading-tight">STEMpower</h1>
            <p className="text-xs text-white/80">Admin Dashboard</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-8 w-8 text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {getFilteredNavigation().map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-[#E0F7F6] hover:text-[#367375] transition-colors",
                  pathname === item.href && "bg-white/20 text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-[#E0F7F6] hover:text-[#367375] transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
