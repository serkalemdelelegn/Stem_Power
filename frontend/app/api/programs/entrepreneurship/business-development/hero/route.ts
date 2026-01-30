import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/business-development/hero",
      req
    );
    // Backend returns { success: true, data: [...] }
    const heroes = response.data || [];
    // Return the most recent hero (first in DESC order) or null
    return Response.json(heroes.length > 0 ? heroes[0] : null);
  } catch (error: any) {
    console.error("Error fetching hero:", error);
    return Response.json(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Check if request is FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Forward FormData directly to backend
      const response = await backendApiServer.postFormData(
        "/api/business-development/hero",
        formData as any,
        req
      );

      // Backend returns { success: true, data: hero }
      return Response.json(response.data, { status: 201 });
    }

    // Handle JSON request (for URL strings)
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/business-development/hero",
      data,
      req
    );
    // Backend returns { success: true, data: hero }
    return Response.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating hero:", error);
    return Response.json(
      { error: error.message || "Failed to save hero section" },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // First get the hero to get its ID
    const getResponse = await backendApiServer.get(
      "/api/business-development/hero",
      req
    );
    const heroes = getResponse.data || [];
    if (heroes.length === 0) {
      return Response.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }
    const heroId = heroes[0].id;

    // Check if request is FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Forward FormData directly to backend
      const response = await backendApiServer.putFormData(
        `/api/programs/entrepreneurship/business-development/hero/${heroId}`,
        formData as any,
        req
      );

      // Backend returns { success: true, data: hero }
      return Response.json(response.data);
    }

    // Handle JSON request (for URL strings)
    const data = await req.json();
    const response = await backendApiServer.put(
      `/api/business-development/hero/${heroId}`,
      data,
      req
    );
    // Backend returns { success: true, data: hero }
    return Response.json(response.data);
  } catch (error: any) {
    console.error("Error updating hero:", error);
    return Response.json(
      { error: error.message || "Failed to update hero section" },
      { status: 400 }
    );
  }
}
