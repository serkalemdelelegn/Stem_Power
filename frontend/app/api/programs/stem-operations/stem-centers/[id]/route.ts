import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend center to frontend format
function transformBackendCenterToFrontend(backendCenter: any) {
  if (!backendCenter || typeof backendCenter !== "object") {
    return null;
  }

  // Parse location to extract city and region
  const locationParts = (backendCenter.location || "")
    .split(",")
    .map((s: string) => s.trim());
  const city = locationParts[0] || "";
  const region = locationParts[1] || "";

  // Extract year from established_date
  let yearEstablished = "";
  if (backendCenter.established_date) {
    try {
      const establishedDate = new Date(backendCenter.established_date);
      yearEstablished = establishedDate.getFullYear().toString();
    } catch {
      yearEstablished = "";
    }
  }

  // Extract labs from relationship
  let labs: string[] = [];
  if (
    backendCenter.StemLaboratories &&
    Array.isArray(backendCenter.StemLaboratories)
  ) {
    labs = backendCenter.StemLaboratories.map(
      (lab: any) => lab.name || ""
    ).filter(Boolean);
  }

  return {
    id: String(backendCenter.id || ""),
    host: backendCenter.name || "",
    city: city,
    region: region || "Unknown",
    country: "Ethiopia",
    cluster: "",
    contact: backendCenter.director_name || "",
    phone: backendCenter.phone || "",
    email: "",
    website: backendCenter.website || "",
    labs: labs,
    funder: backendCenter.funded_by || "",
    yearEstablished: yearEstablished,
    featured: backendCenter.is_featured || false,
    imageQuery: backendCenter.image || "",
    image: backendCenter.image || null,
    featuredBadge: "",
  };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.putFormData(
        `/api/stem-centers/centers/${id}`,
        formData as any,
        req
      );
      const transformed = transformBackendCenterToFrontend(response);
      if (!transformed) {
        return Response.json(
          { error: "Failed to transform center" },
          { status: 500 }
        );
      }
      return Response.json(transformed);
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const updateData: any = {};
    if (data.host !== undefined) updateData.name = data.host;
    if (data.city !== undefined && data.region !== undefined) {
      updateData.location = `${data.city}, ${data.region}`;
    }
    if (data.yearEstablished !== undefined) {
      const establishedDate = new Date(`${data.yearEstablished}-01-01`);
      updateData.established_date = establishedDate.toISOString();
    }
    if (data.contact !== undefined) updateData.director_name = data.contact;
    if (data.funder !== undefined) updateData.funded_by = data.funder || null;
    if (data.website !== undefined) updateData.website = data.website || null;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.imageQuery !== undefined || data.image !== undefined) {
      updateData.image = data.imageQuery || data.image || null;
    }
    if (data.featured !== undefined) updateData.is_featured = data.featured;

    const response = await backendApiServer.put(
      `/api/stem-centers/centers/${id}`,
      updateData,
      req
    );
    const transformed = transformBackendCenterToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform center" },
        { status: 500 }
      );
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[STEM Centers] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update center" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    await backendApiServer.delete(`/api/stem-centers/centers/${id}`, req);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[STEM Centers] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete center" },
      { status: 400 }
    );
  }
}
