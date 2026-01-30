import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

function transformBackendTimelineToFrontend(item: any) {
  if (!item || typeof item !== "object") return null;
  return {
    id: String(item.id || ""),
    phase: item.phase || "",
    title: item.title || "",
    description: item.description || "",
    year: item.year || "",
    order: item.order ?? 0,
    university_outreach_id: item.university_outreach_id || null,
  };
}

function transformFrontendTimelineToBackend(item: any) {
  return {
    phase: item.phase || "",
    title: item.title || "",
    description: item.description || "",
    year: item.year || "",
    order: item.order ?? 0,
    university_outreach_id:
      item.university_outreach_id ??
      item.outreachId ??
      item.universityOutreachId ??
      null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const data = await backendApiServer.get(
      "/api/university-outreach/timelines",
      req
    );
    const arr = Array.isArray(data) ? data : [];
    const transformed = arr
      .map(transformBackendTimelineToFrontend)
      .filter((t): t is NonNullable<typeof t> => t !== null);
    return Response.json(transformed);
  } catch (error: any) {
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const backend = transformFrontendTimelineToBackend(payload);
    const created = await backendApiServer.post(
      "/api/university-outreach/timelines",
      backend,
      req
    );
    const transformed = transformBackendTimelineToFrontend(created);
    return Response.json(transformed, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to create timeline item" },
      { status: 400 }
    );
  }
}
