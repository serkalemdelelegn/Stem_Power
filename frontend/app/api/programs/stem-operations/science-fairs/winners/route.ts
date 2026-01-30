import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/science-fairs/winners",
      req
    );
    // Backend returns array directly
    return Response.json(Array.isArray(response) ? response : []);
  } catch (error: any) {
    console.error("[Science Fairs Winners] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch winners" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.postFormData(
        "/api/science-fairs/winners",
        formData as any,
        req
      );
      return Response.json(response, { status: 201 });
    }

    // Otherwise, handle as JSON
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/science-fairs/winners",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Science Fairs Winners] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create winner project" },
      { status: 400 }
    );
  }
}
