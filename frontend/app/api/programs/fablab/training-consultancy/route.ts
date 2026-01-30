import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/training-consultancy/programs",
      req
    );
    const programs = Array.isArray(response) ? response : [];
    // Transform backend format to frontend format
    const transformedPrograms = programs.map((program: any) => {
      // Parse features and outcomes
      let features: string[] = [];
      if (Array.isArray(program.features)) {
        features = program.features;
      } else if (typeof program.features === "string") {
        try {
          features = JSON.parse(program.features);
        } catch {
          features = [];
        }
      }

      let outcomes: string[] = [];
      if (Array.isArray(program.outcomes)) {
        outcomes = program.outcomes;
      } else if (typeof program.outcomes === "string") {
        try {
          outcomes = JSON.parse(program.outcomes);
        } catch {
          outcomes = [];
        }
      }

      return {
        id: String(program.id || ""),
        title: program.title || "",
        description: program.description || "",
        image: program.image || "",
        features: Array.isArray(features) ? features : [],
        outcomes: Array.isArray(outcomes) ? outcomes : [],
      };
    });
    return Response.json(transformedPrograms);
  } catch (error: any) {
    console.error("[Training Consultancy Programs] GET error:", error);
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
        "/api/training-consultancy/programs",
        formData as any,
        req
      );
      // Transform backend response to frontend format
      const transformedProgram = {
        id: String(response.id),
        title: response.title || "",
        description: response.description || "",
        image: response.image || "",
        features: Array.isArray(response.features)
          ? response.features
          : typeof response.features === "string"
          ? JSON.parse(response.features)
          : [],
        outcomes: Array.isArray(response.outcomes)
          ? response.outcomes
          : typeof response.outcomes === "string"
          ? JSON.parse(response.outcomes)
          : [],
      };
      return Response.json(transformedProgram, { status: 201 });
    }

    // Otherwise, handle as JSON
    const data = await req.json();
    const backendData = {
      title: data.title || "",
      description: data.description || "",
      icon: data.icon || "graduationcap",
      image: data.image || null,
      features: Array.isArray(data.features) ? data.features : [],
      outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
    };
    const response = await backendApiServer.post(
      "/api/training-consultancy/programs",
      backendData,
      req
    );
    // Transform backend response to frontend format
    const transformedProgram = {
      id: String(response.id),
      title: response.title || "",
      description: response.description || "",
      image: response.image || "",
      features: Array.isArray(response.features)
        ? response.features
        : typeof response.features === "string"
        ? JSON.parse(response.features)
        : [],
      outcomes: Array.isArray(response.outcomes)
        ? response.outcomes
        : typeof response.outcomes === "string"
        ? JSON.parse(response.outcomes)
        : [],
    };
    return Response.json(transformedProgram, { status: 201 });
  } catch (error: any) {
    console.error("[Training Consultancy Programs] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create offering" },
      { status: 400 }
    );
  }
}
