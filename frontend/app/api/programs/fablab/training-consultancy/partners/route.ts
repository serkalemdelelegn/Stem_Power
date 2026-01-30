import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/training-consultancy/partners",
      req
    );
    const partners = Array.isArray(response) ? response : [];
    // Transform backend format to frontend format
    const transformedPartners = partners.map((partner: any) => ({
      id: String(partner.id || ""),
      name: partner.name || "",
      logo: partner.logo || "",
    }));
    return Response.json(transformedPartners);
  } catch (error: any) {
    console.error("[Training Consultancy Partners] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if this is multipart/form-data (file upload)
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const response = await backendApiServer.postFormData(
        "/api/training-consultancy/partners",
        formData as any,
        request
      );
      // Transform backend response to frontend format
      const transformedPartner = {
        id: String(response.id),
        name: response.name || "",
        logo: response.logo || "",
      };
      return Response.json(transformedPartner, { status: 201 });
    }

    // Otherwise, handle as JSON
    const payload = await request.json();
    const backendData = {
      name: payload.name || "",
      logo: payload.logo || null,
    };
    const response = await backendApiServer.post(
      "/api/training-consultancy/partners",
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedPartner = {
      id: String(response.id),
      name: response.name || "",
      logo: response.logo || "",
    };
    return Response.json(transformedPartner, { status: 201 });
  } catch (error: any) {
    console.error("[Training Consultancy Partners] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create partner" },
      { status: 400 }
    );
  }
}
