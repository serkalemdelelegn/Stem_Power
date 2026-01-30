import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/footer", req);
    // Backend returns { success: true, data: {...} }
    if (response.success && response.data) {
      return Response.json(response.data);
    }
    return Response.json(null);
  } catch (error: any) {
    console.error("[Footer] GET error:", error);
    // Return default footer structure on error
    return Response.json(
      {
        logo: "/STEMpower_s_logo.png",
        description:
          "Empowering Ethiopian youth through science, technology, engineering, and mathematics education.",
        copyrightText:
          "STEMpower Ethiopia. All rights reserved. | Empowering the next generation through STEM education.",
        contactEmail: "info@stempowerethiopia.org",
        contactPhone: "+251 91 123 4567",
        contactAddress: "Addis Ababa, Ethiopia",
        socialLinks: [],
        sections: [],
      },
      { status: 200 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.putFormData(
        "/api/footer",
        formData as any,
        req
      );
      if (response.success && response.data) {
        return Response.json(response.data);
      }
      return Response.json(response, { status: 200 });
    }

    // Otherwise, handle as JSON
    const data = await req.json();
    const response = await backendApiServer.put("/api/footer", data, req);
    if (response.success && response.data) {
      return Response.json(response.data);
    }
    return Response.json(response, { status: 200 });
  } catch (error: any) {
    console.error("[Footer] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update footer" },
      { status: 400 }
    );
  }
}
