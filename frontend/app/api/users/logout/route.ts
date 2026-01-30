import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend-url";

const forwardCookies = (req: NextRequest) => {
  const cookie = req.headers.get("cookie");
  return cookie ? { cookie } : {};
};

export async function POST(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...forwardCookies(req),
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    
    // Forward cookies from backend response (to clear JWT cookie)
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
    console.error("Error proxying POST /api/users/logout:", error);
    // Continue with logout even if backend call fails
    return NextResponse.json(
      { message: "Logged out" },
      { status: 200 }
    );
  }
}

