import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend-url";

const forwardCookies = (req: NextRequest) => {
  const cookie = req.headers.get("cookie");
  return cookie ? { cookie } : {};
};

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/header`, {
      headers: forwardCookies(req),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying GET /api/header:", error);
    return NextResponse.json(
      { error: "Failed to fetch header" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${BACKEND_URL}/api/header`, {
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
    console.error("Error proxying POST /api/header:", error);
    return NextResponse.json(
      { error: "Failed to create header item" },
      { status: 500 }
    );
  }
}
