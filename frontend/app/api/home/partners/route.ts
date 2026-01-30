import { NextRequest, NextResponse } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Transform backend partner data to frontend format
function transformPartner(partner: any) {
  return {
    id: partner.id?.toString() || partner.id,
    name: partner.name || "",
    logo: partner.logo_url || "",
    website: partner.website_url || "",
    isActive: partner.is_active !== false,
  };
}

export async function GET(req: NextRequest) {
  try {
    const partners = await backendApiServer.get("/api/home/partners", req);

    // Filter only active partners and transform data
    const activePartners = Array.isArray(partners)
      ? partners.filter((p: any) => p.is_active !== false).map(transformPartner)
      : [];

    return NextResponse.json(activePartners);
  } catch (error) {
    console.error("Error fetching partners from backend:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const backendData = {
      name: data.name,
      website_url: data.website || null,
      is_active: data.isActive !== false,
    };

    // Note: Logo upload would need to be handled separately with FormData
    const newPartner = await backendApiServer.post(
      "/api/home/partners",
      backendData,
      req
    );
    return NextResponse.json(transformPartner(newPartner), { status: 201 });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}
