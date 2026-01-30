"use client";

export async function logout() {
  try {
    // Call backend logout endpoint through Next.js API route to avoid CORS issues
    await fetch("/api/users/logout", {
      method: "POST",
      credentials: "include", // Include cookies in request
    });
  } catch (error) {
    console.error("Logout error:", error);
    // Continue with logout even if backend call fails
  } finally {
    // Clear frontend auth cookie
    document.cookie = "admin-auth=; path=/; max-age=0";
    // Redirect to login page
    window.location.href = "/admin/login";
  }
}

export function isAuthenticated(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("admin-auth=true");
}
