import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/incubation-program/courses",
      req
    );
    const courses = Array.isArray(response) ? response : [];
    return Response.json(courses);
  } catch (error: any) {
    console.error("Error fetching incubation courses/phases:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.postFormData(
        "/api/incubation-program/courses",
        formData as any,
        req
      );
      return Response.json(response, { status: 201 });
    }

    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/incubation-program/courses",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating incubation course/phase:", error);
    return Response.json(
      { error: error.message || "Failed to create phase" },
      { status: 400 }
    );
  }
}
