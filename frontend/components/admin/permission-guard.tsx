"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
// Removed backendApi import - using Next.js API routes instead to avoid CORS
import { hasPagePermission, getPageIdFromPath } from "@/lib/permissions";
import { Loader2 } from "lucide-react";

interface PermissionGuardProps {
  children: React.ReactNode;
  pageId?: string; // Optional: if not provided, will be extracted from pathname
}

/**
 * Permission Guard Component
 * Checks if the current user has permission to access the page
 * Redirects to /admin if they don't have permission
 */
export function PermissionGuard({ children, pageId }: PermissionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Use Next.js API route to avoid CORS issues
        const response = await fetch("/api/users/me", {
          credentials: "include", // Include cookies (JWT) in request
        });
        
        if (!response.ok) {
          // If unauthorized, redirect to login
          if (response.status === 401 || response.status === 403) {
            router.push("/admin/login");
            return;
          }
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        
        const user = await response.json();
        
        // Determine page ID
        const currentPageId = pageId || getPageIdFromPath(pathname);
        
        // Check permission
        const access = hasPagePermission(
          currentPageId,
          user.permissions,
          user.role
        );

        if (!access) {
          // Redirect to admin home if no permission
          router.push("/admin");
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error("Error checking permissions:", error);
        // On error, redirect to login
        router.push("/admin/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkPermission();
  }, [pathname, pageId, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#00BFA6]" />
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 bg-[#00BFA6] text-white rounded hover:bg-[#00A693]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

