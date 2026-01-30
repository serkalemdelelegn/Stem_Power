import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const response = await backendApiServer.get(
      `/api/about/testimonials/${resolvedParams.id}`,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("[Testimonials] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch testimonial" },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.putFormData(
        `/api/about/testimonials/${resolvedParams.id}`,
        formData as any,
        req
      );
      return Response.json(response);
    }

    const data = await req.json();
    const response = await backendApiServer.put(
      `/api/about/testimonials/${resolvedParams.id}`,
      data,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("[Testimonials] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update testimonial" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    await backendApiServer.delete(
      `/api/about/testimonials/${resolvedParams.id}`,
      req
    );
    return Response.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("[Testimonials] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete testimonial" },
      { status: 400 }
    );
  }
}
