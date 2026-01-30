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
    cluster: "", // Backend doesn't have cluster, will need to be added or defaulted
    contact: backendCenter.director_name || "",
    phone: backendCenter.phone || "",
    email: "", // Backend doesn't have email
    website: backendCenter.website || "",
    labs: labs,
    funder: backendCenter.funded_by || "",
    yearEstablished: yearEstablished,
    featured: backendCenter.is_featured || false,
    imageQuery: backendCenter.image || "",
    image: backendCenter.image || null,
    featuredBadge: "", // Backend doesn't have featuredBadge
  };
}

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/stem-centers/centers",
      req
    );
    const backendCenters = Array.isArray(response) ? response : [];

    // Transform backend format to frontend format
    const transformedCenters = backendCenters
      .map(transformBackendCenterToFrontend)
      .filter(
        (center): center is NonNullable<typeof center> => center !== null
      );

    return Response.json(transformedCenters);
  } catch (error: any) {
    console.error("[STEM Centers] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.postFormData(
        "/api/stem-centers/centers",
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
      return Response.json(transformed, { status: 201 });
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const location = `${data.city || ""}, ${data.region || ""}`;
    const establishedDate = data.yearEstablished
      ? new Date(`${data.yearEstablished}-01-01`)
      : new Date();

    const backendData: any = {
      name: data.host || "",
      location: location,
      established_date: establishedDate.toISOString(),
      director_name: data.contact || "",
      funded_by: data.funder || null,
      website: data.website || null,
      phone: data.phone || null,
      image: data.imageQuery || data.image || null,
      is_featured: data.featured || false,
    };

    const response = await backendApiServer.post(
      "/api/stem-centers/centers",
      backendData,
      req
    );
    const transformed = transformBackendCenterToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform center" },
        { status: 500 }
      );
    }
    return Response.json(transformed, { status: 201 });
  } catch (error: any) {
    console.error("[STEM Centers] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create center" },
      { status: 400 }
    );
  }
}
