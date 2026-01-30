import { NextResponse } from "next/server";
import { backendApi } from "@/lib/backend-api";
import { updateSocialLink, deleteSocialLink } from "@/lib/api-contact";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const data = await req.json();
    const link = await updateSocialLink(id, data);
    return NextResponse.json(link);
  } catch (error: any) {
    console.error("Error updating social link:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update social link" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    await deleteSocialLink(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting social link:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete social link" },
      { status: 400 }
    );
  }
}
