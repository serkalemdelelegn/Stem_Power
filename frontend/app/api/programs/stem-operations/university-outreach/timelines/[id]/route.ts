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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    const payload = await req.json();
    const backend = transformFrontendTimelineToBackend(payload);
    const updated = await backendApiServer.put(
      `/api/university-outreach/timelines/${id}`,
      backend,
      req
    );
    const transformed = transformBackendTimelineToFrontend(updated);
    return Response.json(transformed);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to update timeline item" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    await backendApiServer.delete(
      `/api/university-outreach/timelines/${id}`,
      _req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to delete timeline item" },
      { status: 400 }
    );
  }
}
