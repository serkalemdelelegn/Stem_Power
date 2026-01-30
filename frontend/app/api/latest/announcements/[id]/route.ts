import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend announcement to frontend format
function transformBackendAnnouncementToFrontend(backendAnnouncement: any) {
  if (!backendAnnouncement || typeof backendAnnouncement !== "object") {
    return null;
  }

  // Handle both direct object and data wrapper
  const announcement = backendAnnouncement.data || backendAnnouncement;

  return {
    id: String(announcement.id || ""),
    title: announcement.title || "",
    category: announcement.category || announcement.type || "General",
    type: announcement.type || "update",
    date: announcement.start_date
      ? new Date(announcement.start_date).toISOString().split("T")[0]
      : announcement.date || new Date().toISOString().split("T")[0],
    location: announcement.location || "",
    priority: announcement.priority || undefined,
    excerpt:
      announcement.excerpt || announcement.content?.substring(0, 200) || "",
    content: announcement.content || "",
    image: announcement.media_url || announcement.image || "",
    deadline: announcement.deadline
      ? new Date(announcement.deadline).toISOString().split("T")[0]
      : undefined,
    link: announcement.link || undefined,
    googleFormUrl: announcement.googleFormUrl || undefined,
    eventId: announcement.eventId ? String(announcement.eventId) : undefined,
    featured: announcement.featured || false,
    endDate: announcement.end_date
      ? new Date(announcement.end_date).toISOString().split("T")[0]
      : undefined,
    is_active:
      announcement.is_active !== undefined ? announcement.is_active : true,
  };
}

// Helper function to transform frontend announcement to backend format
function transformFrontendAnnouncementToBackend(frontendAnnouncement: any) {
  return {
    title: frontendAnnouncement.title || "",
    content: frontendAnnouncement.content || frontendAnnouncement.excerpt || "",
    media_url: frontendAnnouncement.image || null,
    start_date: frontendAnnouncement.date
      ? new Date(frontendAnnouncement.date).toISOString()
      : new Date().toISOString(),
    end_date: frontendAnnouncement.endDate
      ? new Date(frontendAnnouncement.endDate).toISOString()
      : null,
    is_active:
      frontendAnnouncement.is_active !== undefined
        ? frontendAnnouncement.is_active
        : true,
    priority: frontendAnnouncement.priority || "medium",
    category:
      frontendAnnouncement.category || frontendAnnouncement.type || "General",
    type: frontendAnnouncement.type || "update",
    location: frontendAnnouncement.location || null,
    excerpt: frontendAnnouncement.excerpt || null,
    deadline: frontendAnnouncement.deadline
      ? new Date(frontendAnnouncement.deadline).toISOString()
      : null,
    link: frontendAnnouncement.link || null,
    googleFormUrl: frontendAnnouncement.googleFormUrl || null,
    eventId: frontendAnnouncement.eventId
      ? parseInt(frontendAnnouncement.eventId, 10)
      : null,
    featured: frontendAnnouncement.featured || false,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const response = await backendApiServer.get(
      `/api/announcements/${id}`,
      req
    );
    // Backend returns { data: {...} } format
    const transformed = transformBackendAnnouncementToFrontend(response);
    if (!transformed) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Announcements] GET error:", error);
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Extract data from FormData
      const announcementData: any = {};
      for (const [key, value] of formData.entries()) {
        if (key === "file") {
          // File will be handled by backend middleware
          continue;
        }
        // Try to parse JSON strings, otherwise use as-is
        try {
          const parsed = JSON.parse(value as string);
          announcementData[key] = parsed;
        } catch {
          announcementData[key] = value;
        }
      }

      // Transform to backend format
      const backendData =
        transformFrontendAnnouncementToBackend(announcementData);

      // Create FormData for backend
      const backendFormData = new FormData();
      const file = formData.get("file") as File | null;
      if (file) {
        backendFormData.append("file", file);
      }

      // Add other fields
      Object.keys(backendData).forEach((key) => {
        const value = (backendData as Record<string, any>)[key];
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            backendFormData.append(key, value ? "true" : "false");
          } else {
            backendFormData.append(key, String(value));
          }
        }
      });

      const response = await backendApiServer.putFormData(
        `/api/announcements/${id}`,
        backendFormData as any,
        req
      );
      const transformed = transformBackendAnnouncementToFrontend(response);
      if (!transformed) {
        return Response.json(
          { error: "Failed to transform announcement" },
          { status: 500 }
        );
      }
      return Response.json(transformed);
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const backendData = transformFrontendAnnouncementToBackend(data);

    const response = await backendApiServer.put(
      `/api/announcements/${id}`,
      backendData,
      req
    );
    const transformed = transformBackendAnnouncementToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform announcement" },
        { status: 500 }
      );
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Announcements] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update announcement" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    await backendApiServer.delete(`/api/announcements/${id}`, req);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Announcements] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete announcement" },
      { status: 400 }
    );
  }
}
