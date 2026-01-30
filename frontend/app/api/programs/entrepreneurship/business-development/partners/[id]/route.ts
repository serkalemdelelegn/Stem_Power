import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params;
    const data = await req.json();
    // Transform admin format to backend format
    const backendData: any = {};
    if (data.title !== undefined) backendData.name = data.title;
    if (data.image !== undefined) backendData.logo = data.image;
    if (
      data.contribution !== undefined ||
      data.contributionDescription !== undefined
    ) {
      backendData.contribution_description =
        data.contribution || data.contributionDescription;
    }
    if (data.focusArea !== undefined) backendData.focus_area = data.focusArea;
    if (data.partnerSince !== undefined)
      backendData.partnership_duration = data.partnerSince;
    if (data.peopleImpacted !== undefined)
      backendData.people_impacted = data.peopleImpacted;

    const response = await backendApiServer.put(
      `/api/business-development/partners/${resolvedParams.id}`,
      backendData,
      req
    );
    // Backend returns { success: true, data: partner }
    const partner = response.data;
    // Transform back to admin format
    return Response.json({
      id: partner.id,
      image: partner.logo || "",
      title: partner.name,
      contribution: partner.contribution_description || "",
      contributionDescription: partner.contribution_description || "",
      focusArea: partner.focus_area || "",
      partnerSince: partner.partnership_duration || "",
      peopleImpacted: partner.people_impacted || "",
    });
  } catch (error: any) {
    console.error("Error updating partner:", error);
    return Response.json(
      { error: error.message || "Failed to update" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params;
    console.log("Deleting partner with ID:", resolvedParams.id);
    await backendApiServer.delete(
      `/api/business-development/partners/${resolvedParams.id}`,
      req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting partner:", error);
    return Response.json(
      { error: error.message || "Not found" },
      { status: 404 }
    );
  }
}
