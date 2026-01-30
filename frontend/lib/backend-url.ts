// Shared backend URL configuration
// Uses localhost backend in development, production URL in production
function getBackendUrl(): string {
  // If explicitly set via environment variable, use that
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  
  // In development (client-side), check if we're on localhost
  if (typeof window !== "undefined") {
    const isLocalhost = window.location.hostname === "localhost" || 
                       window.location.hostname === "127.0.0.1";
    if (isLocalhost) {
      return "http://localhost:5000";
    }
  }
  
  // Server-side: check NODE_ENV
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }
  
  // Default to production
  return "https://api.ethiopia.stempower.org";
}

export const BACKEND_URL = getBackendUrl();

