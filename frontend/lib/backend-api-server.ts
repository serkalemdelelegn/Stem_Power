// Server-side Backend API helper for Next.js API routes
// This version forwards cookies from NextRequest to the backend

import { BACKEND_URL } from "./backend-url";

/**
 * Extract cookies from NextRequest and format them for forwarding
 */
function getCookieHeader(req: Request): string {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader;
}

/**
 * Server-side backend API helper that forwards cookies from NextRequest
 */
export const backendApiServer = {
  baseUrl: BACKEND_URL,

  async get(endpoint: string, req: Request) {
    try {
      const cookieHeader = getCookieHeader(req);
      const headers: Record<string, string> = {};

      // Forward cookies from the incoming request
      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        headers,
        credentials: "include", // Include cookies
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

  async post(endpoint: string, data: any, req: Request) {
    const cookieHeader = getCookieHeader(req);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward cookies from the incoming request
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include", // Include cookies
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

  async put(endpoint: string, data: any, req: Request) {
    const cookieHeader = getCookieHeader(req);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward cookies from the incoming request
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "include", // Include cookies
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

  async delete(endpoint: string, req: Request) {
    const cookieHeader = getCookieHeader(req);
    const headers: Record<string, string> = {};

    // Forward cookies from the incoming request
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "DELETE",
      headers,
      credentials: "include", // Include cookies
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

  async postFormData(endpoint: string, formData: FormData, req: Request) {
    const cookieHeader = getCookieHeader(req);
    const headers: Record<string, string> = {};
    // Don't set Content-Type, browser will set it with boundary

    // Forward cookies from the incoming request
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include", // Include cookies
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
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
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

  async putFormData(endpoint: string, formData: FormData, req: Request) {
    const cookieHeader = getCookieHeader(req);
    const headers: Record<string, string> = {};
    // Don't set Content-Type, browser will set it with boundary

    // Forward cookies from the incoming request
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "include", // Include cookies
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
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
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
