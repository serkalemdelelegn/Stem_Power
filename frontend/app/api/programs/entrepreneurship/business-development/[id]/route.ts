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
    if (data.name !== undefined) backendData.business_name = data.name;
    if (data.licenseStatus !== undefined)
      backendData.license_status = data.licenseStatus;
    if (data.category !== undefined) backendData.category = data.category;
    if (data.categoryColor !== undefined)
      backendData.category_color = data.categoryColor;
    if (data.contactPerson !== undefined)
      backendData.contact_person = data.contactPerson;
    if (data.phone !== undefined) backendData.phone = data.phone;
    if (data.email !== undefined) backendData.email = data.email;

    const response = await backendApiServer.put(
      `/api/business-development/success-stories/${resolvedParams.id}`,
      backendData,
      req
    );
    // Backend returns { success: true, data: story }
    const story = response.data;
    // Transform back to admin format
    return Response.json({
      id: story.id,
      name: story.business_name,
      licenseStatus: story.license_status,
      category: story.category,
      categoryColor: story.category_color || "blue",
      contactPerson: story.contact_person,
      phone: story.phone,
      email: story.email || "",
    });
  } catch (error: any) {
    console.error("Error updating success story:", error);
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
    console.log("Deleting success story with ID:", resolvedParams.id);
    await backendApiServer.delete(
      `/api/business-development/success-stories/${resolvedParams.id}`,
      req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting success story:", error);
    return Response.json(
      { error: error.message || "Not found" },
      { status: 404 }
    );
  }
}
