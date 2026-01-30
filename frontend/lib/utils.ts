import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a URL by adding protocol if missing
 * Handles cases like "www.example.com" -> "https://www.example.com"
 * Preserves existing protocols and internal routes
 */
export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  // If it's already a valid URL with protocol, return as-is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If it starts with /, it's an internal route - return as-is
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // If it looks like a domain (contains dots and no slashes at start), add https://
  // This handles cases like "www.example.com" or "example.com"
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // If it doesn't match any pattern, return as-is (might be a relative path or invalid)
  return trimmed;
}

/**
 * Checks if a URL is an external URL (has protocol or looks like a domain)
 */
export function isExternalUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  // If it starts with /, it's an internal route
  if (trimmed.startsWith("/")) {
    return false;
  }

  // If it has a protocol, it's external
  if (/^https?:\/\//i.test(trimmed)) {
    return true;
  }

  // If it looks like a domain, it's external
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(trimmed)) {
    return true;
  }

  return false;
}
