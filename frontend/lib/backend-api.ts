// Backend API configuration
import { BACKEND_URL } from "./backend-url";

/**
 * Get authorization token from localStorage or environment variable
 * NOTE: For admin pages, authentication uses HTTP-only cookies (sent automatically with credentials: "include")
 * This function is kept for backward compatibility and as a fallback for non-admin API clients
 */
function getAuthToken(): string | null {
  // Check localStorage first (client-side only)
  // Note: Admin pages should NOT store tokens in localStorage - use HTTP-only cookies instead
  if (typeof window !== "undefined") {
    // Try common token key names
    const tokenKeys = [
      "authToken",
      "token",
      "accessToken",
      "adminToken",
      "jwtToken",
    ];
    for (const key of tokenKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        return token;
      }
    }
  }

  // Fall back to environment variable
  return process.env.NEXT_PUBLIC_AUTH_TOKEN || null;
}

/**
 * Get headers with authorization token if available
 * NOTE: For admin pages, JWT is sent via HTTP-only cookie automatically (credentials: "include")
 * Authorization header is optional fallback for backward compatibility
 */
function getHeaders(
  customHeaders?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = {
    ...customHeaders,
  };

  // Add authorization token if available (fallback for non-cookie clients)
  // Admin pages primarily use HTTP-only cookies sent automatically
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export const backendApi = {
  baseUrl: BACKEND_URL,

  async get(endpoint: string, options?: { headers?: Record<string, string> }) {
    try {
      const headers = getHeaders(options?.headers);

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        headers,
        credentials: "include", // Include cookies (JWT) in request
      });
      if (!response.ok) {
        let errorMessage = `Backend API error: ${response.statusText}`;
        try {
          const errorData = await response.json();
          // Handle standardized error response format
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
          } catch {
            // Use default error message
          }
        }
        console.error(`Backend API error (${response.status}):`, errorMessage);
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error: any) {
      // Handle network errors (backend not running, CORS, etc.)
      // More specific detection: network errors typically have these characteristics
      const isNetworkError =
        error.name === "TypeError" &&
        (error.message.includes("fetch") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("Network request failed") ||
          error.cause?.code === "ENOTFOUND" ||
          error.cause?.code === "ECONNREFUSED");

      if (isNetworkError) {
        // Only log in development or when explicitly needed
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[Backend API] Connection failed to ${BACKEND_URL}. Is the backend running?`
          );
        }
        throw new Error(
          `Backend server is not reachable. Please ensure the backend is running on ${BACKEND_URL}`
        );
      }
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    const headers = getHeaders({ "Content-Type": "application/json" });
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include", // Include cookies (JWT) in request
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage = `Backend API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        // Handle standardized error response format
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const headers = getHeaders({ "Content-Type": "application/json" });
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "include", // Include cookies (JWT) in request
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage = `Backend API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        // Handle standardized error response format
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const headers = getHeaders();
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "DELETE",
      headers,
      credentials: "include", // Include cookies (JWT) in request
    });
    if (!response.ok) {
      let errorMessage = `Backend API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, use statusText
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async postFormData(endpoint: string, formData: FormData) {
    const headers = getHeaders(); // Don't set Content-Type, browser will set it with boundary
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include", // Include cookies (JWT) in request
      body: formData,
    });
    if (!response.ok) {
      let errorMessage = `Backend API error: ${response.statusText}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          // Handle standardized error response format
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } else {
          // If response is not JSON, try to get text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        // If parsing fails, use statusText
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      // If response is not JSON, try to parse as text and then JSON
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(
          `Unexpected response format: ${text.substring(0, 100)}`
        );
      }
    }
  },

  async putFormData(endpoint: string, formData: FormData) {
    const headers = getHeaders(); // Don't set Content-Type, browser will set it with boundary
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "include", // Include cookies (JWT) in request
      body: formData,
    });
    if (!response.ok) {
      let errorMessage = `Backend API error: ${response.statusText}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          // Handle standardized error response format
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } else {
          // If response is not JSON, try to get text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        // If parsing fails, use statusText
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      // If response is not JSON, try to parse as text and then JSON
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(
          `Unexpected response format: ${text.substring(0, 100)}`
        );
      }
    }
  },
};
