import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend-url";

const forwardCookies = (req: NextRequest) => {
  const cookie = req.headers.get("cookie");
  return cookie ? { cookie } : {};
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (value) query.set(key, value);
    });

    const qs = query.toString();
    const url = `${BACKEND_URL}/api/pages${qs ? `?${qs}` : ""}`;

    const response = await fetch(url, {
      headers: forwardCookies(req),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying GET /api/pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${BACKEND_URL}/api/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...forwardCookies(req),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying POST /api/pages:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
