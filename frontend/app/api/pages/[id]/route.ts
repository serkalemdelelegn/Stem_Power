import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend-url";

const forwardCookies = (req: NextRequest) => {
  const cookie = req.headers.get("cookie");
  return cookie ? { cookie } : {};
};

async function resolveParams(
  params: Promise<{ id: string }> | { id: string }
): Promise<{ id: string }> {
  if (params instanceof Promise) {
    return await params;
  }
  return params;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await resolveParams(params);
    const response = await fetch(`${BACKEND_URL}/api/pages/${id}`, {
      headers: forwardCookies(req),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying GET /api/pages/:id:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const data = await req.json();
    const { id } = await resolveParams(params);

    const response = await fetch(`${BACKEND_URL}/api/pages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...forwardCookies(req),
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const body = await response.json().catch(() => null);
    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    console.error("Error proxying PUT /api/pages/:id:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await resolveParams(params);
    const response = await fetch(`${BACKEND_URL}/api/pages/${id}`, {
      method: "DELETE",
      headers: forwardCookies(req),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error proxying DELETE /api/pages/:id:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
