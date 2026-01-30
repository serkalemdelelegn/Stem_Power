import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend-url";

const forwardCookies = (req: NextRequest) => {
  const cookie = req.headers.get("cookie");
  return cookie ? { Cookie: cookie } : {};
};

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...forwardCookies(req),
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    
    // Forward cookies from backend response
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      responseHeaders.set("set-cookie", setCookieHeader);
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error proxying GET /api/users/me:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch user", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
