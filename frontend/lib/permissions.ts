/**
 * Permission utilities for checking user access to admin pages
 */

export interface UserPermissions {
  permissions: Record<string, boolean> | null;
  role: string;
}

/**
 * Check if user has permission to access a specific page
 * @param pageId - The page ID to check (e.g., 'home', 'about', 'programs')
 * @param userPermissions - User's permissions object (from /api/users/me)
 * @param userRole - User's role
 * @returns true if user has access, false otherwise
 */
export function hasPagePermission(
  pageId: string,
  userPermissions: Record<string, boolean> | null | undefined,
  userRole: string
): boolean {
  // Super admin (admin role with null permissions) has full access
  if (userRole === "admin" && (userPermissions === null || userPermissions === undefined)) {
    return true;
  }

  // Account Management is only accessible to super admin (admin with null permissions)
  if (pageId === "account") {
    return userRole === "admin" && (userPermissions === null || userPermissions === undefined);
  }
  
  // Profile is always accessible for admin/editor
  if (pageId === "profile") {
    return userRole === "admin" || userRole === "editor";
  }

  // If user has permissions object, check if this page is allowed
  if (userPermissions && typeof userPermissions === "object") {
    return userPermissions[pageId] === true;
  }

  // If permissions is empty object, user has no access
  if (userPermissions && Object.keys(userPermissions).length === 0) {
    return false;
  }

  // Default: admin/editor have access, others don't
  return userRole === "admin" || userRole === "editor";
}

/**
 * Get page ID from pathname
 * @param pathname - Current pathname (e.g., '/admin/home')
 * @returns page ID (e.g., 'home')
 */
export function getPageIdFromPath(pathname: string): string {
  const match = pathname.match(/\/admin\/([^/]+)/);
  return match ? match[1] : "";
}

