import { NextResponse } from "next/server";
import { backendApi } from "@/lib/backend-api";
import {
  fetchSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "@/lib/api-contact";

export async function GET() {
  try {
    const links = await fetchSocialLinks();
    return NextResponse.json(links);
  } catch (error: any) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const link = await createSocialLink(data);
    return NextResponse.json(link, { status: 201 });
  } catch (error: any) {
    console.error("Error creating social link:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create social link" },
      { status: 400 }
    );
  }
}
