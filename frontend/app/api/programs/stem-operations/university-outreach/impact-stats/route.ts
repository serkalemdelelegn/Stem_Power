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

export async function GET(req: NextRequest) {
  try {
    const stats = await backendApiServer.get(
      "/api/university-outreach/impact-stats",
      req
    );
    const arr = Array.isArray(stats) ? stats : [];
    const transformed = arr
      .map(transformBackendStatToFrontend)
      .filter((s): s is NonNullable<typeof s> => s !== null);
    return Response.json(transformed);
  } catch (error: any) {
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const backend = transformFrontendStatToBackend(data);
    const created = await backendApiServer.post(
      "/api/university-outreach/impact-stats",
      backend,
      req
    );
    const transformed = transformBackendStatToFrontend(created);
    return Response.json(transformed, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}
