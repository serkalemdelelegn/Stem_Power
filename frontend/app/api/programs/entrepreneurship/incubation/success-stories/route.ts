import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/incubation-program/success-stories",
      req
    );
    const stories = Array.isArray(response) ? response : [];
    return Response.json(stories);
  } catch (error: any) {
    console.error("Error fetching incubation success stories:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/incubation-program/success-stories",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating incubation success story:", error);
    return Response.json(
      { error: error.message || "Failed to create success story" },
      { status: 400 }
    );
  }
}
