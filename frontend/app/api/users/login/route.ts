import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend-url";

const forwardCookies = (req: NextRequest) => {
  const cookie = req.headers.get("cookie");
  return cookie ? { Cookie: cookie } : {};
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch(`${BACKEND_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...forwardCookies(req),
      },
      credentials: "include",
      body: JSON.stringify(body),
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
    console.error("Error proxying POST /api/users/login:", error);
    return NextResponse.json(
      { error: "Failed to login", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

