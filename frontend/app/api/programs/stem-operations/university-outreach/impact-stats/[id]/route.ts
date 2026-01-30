import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

function transformBackendStatToFrontend(item: any) {
  if (!item || typeof item !== "object") return null;
  return {
    id: String(item.id || ""),
    label: item.label || "",
    value: item.value || item.number || "",
    icon: item.icon || "",
    university_outreach_id: item.university_outreach_id || null,
  };
}

function transformFrontendStatToBackend(item: any) {
  return {
    label: item.label || "",
    number: item.value || item.number || "",
    icon: item.icon || "",
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
    const data = await req.json();
    const backend = transformFrontendStatToBackend(data);
    const updated = await backendApiServer.put(
      `/api/university-outreach/impact-stats/${id}`,
      backend,
      req
    );
    const transformed = transformBackendStatToFrontend(updated);
    return Response.json(transformed);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to update stat" },
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
      `/api/university-outreach/impact-stats/${id}`,
      _req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to delete stat" },
      { status: 400 }
    );
  }
}
