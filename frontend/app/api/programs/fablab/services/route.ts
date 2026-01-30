import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/programs/fablab/services",
      req
    );
    const services = Array.isArray(response) ? response : [];
    return Response.json(services);
  } catch (error: any) {
    console.error("[Services] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Check if request is FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      try {
        // Forward FormData directly to backend
        const response = await backendApiServer.postFormData(
          "/api/fablab-services/services",
          formData as any,
          req
        );

        if (!response || !response.id) {
          throw new Error("Invalid response from backend");
        }

        return Response.json(response, { status: 201 });
      } catch (error: any) {
        console.error("[Services] POST FormData error:", error);
        return Response.json(
          { error: error.message || "Failed to create service" },
          { status: 400 }
        );
      }
    }

    // Handle JSON request (for URL strings or no image)
    try {
      const data = await req.json();
      const response = await backendApiServer.post(
        "/api/programs/fablab/services",
        data,
        req
      );
      return Response.json(response, { status: 201 });
    } catch (error: any) {
      // If JSON parsing fails, try FormData as fallback
      if (error.message?.includes("JSON")) {
        try {
          const formData = await req.formData();
          const response = await backendApiServer.postFormData(
            "/api/programs/fablab/services",
            formData as any,
            req
          );
          return Response.json(response, { status: 201 });
        } catch (formDataError: any) {
          console.error("[Services] POST error:", formDataError);
          return Response.json(
            { error: formDataError.message || "Failed to create service" },
            { status: 400 }
          );
        }
      }
      throw error;
    }
  } catch (error: any) {
    console.error("[Services] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create service" },
      { status: 400 }
    );
  }
}
