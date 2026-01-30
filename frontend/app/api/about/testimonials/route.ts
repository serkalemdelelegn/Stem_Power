import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/about/testimonials", req);
    return Response.json(response || []);
  } catch (error: any) {
    console.error("[Testimonials] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.postFormData(
        "/api/about/testimonials",
        formData as any,
        req
      );
      return Response.json(response, { status: 201 });
    }

    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/about/testimonials",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Testimonials] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create testimonial" },
      { status: 400 }
    );
  }
}
