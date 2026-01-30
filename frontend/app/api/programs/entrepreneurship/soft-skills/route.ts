import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/soft-skills-training/programs",
      req
    );
    const programs = Array.isArray(response) ? response : [];
    return Response.json(programs);
  } catch (error: any) {
    console.error("Error fetching soft-skills programs:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.postFormData(
        "/api/soft-skills-training/programs",
        formData as any,
        req
      );
      return Response.json(response, { status: 201 });
    }

    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/soft-skills-training/programs",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating soft-skills program:", error);
    return Response.json(
      { error: error.message || "Failed to create item" },
      { status: 400 }
    );
  }
}
