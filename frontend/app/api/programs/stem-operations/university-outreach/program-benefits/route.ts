import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

function transformBackendBenefitToFrontend(item: any) {
  if (!item || typeof item !== "object") return null;
  return {
    id: String(item.id || ""),
    title: item.title || "",
    description: item.description || "",
    icon: item.icon || "",
    order: item.order ?? 0,
    university_outreach_id: item.university_outreach_id || null,
  };
}

function transformFrontendBenefitToBackend(item: any) {
  return {
    title: item.title || "",
    description: item.description || "",
    icon: item.icon || "",
    order: item.order ?? 0,
    university_outreach_id:
      item.university_outreach_id ??
      item.outreachId ??
      item.universityOutreachId ??
      null,
  };
}

export async function GET() {
  try {
    const data = await backendApiServer.get(
      "/api/university-outreach/program-benefits",
      req
    );
    const arr = Array.isArray(data) ? data : [];
    const transformed = arr
      .map(transformBackendBenefitToFrontend)
      .filter((b): b is NonNullable<typeof b> => b !== null);
    return Response.json(transformed);
  } catch (error: any) {
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const backend = transformFrontendBenefitToBackend(payload);
    const created = await backendApiServer.post(
      "/api/university-outreach/program-benefits",
      backend,
      req
    );
    const transformed = transformBackendBenefitToFrontend(created);
    return Response.json(transformed, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to create benefit" },
      { status: 400 }
    );
  }
}
