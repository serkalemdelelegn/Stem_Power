import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params;
    const data = await req.json();
    // Transform admin format to backend format
    const backendData: any = {};
    if (data.title !== undefined) backendData.program_title = data.title.trim();
    if (data.email !== undefined)
      backendData.email =
        (data.email && data.email.trim()) || "info@stempower.org";
    if (data.level !== undefined)
      backendData.about = data.level === "Closed" ? "closed" : "open";
    if (data.status !== undefined) backendData.status = data.status;
    if (data.duration !== undefined)
      backendData.duration = (data.duration && data.duration.trim()) || null;
    if (data.description !== undefined)
      backendData.description =
        (data.description && data.description.trim()) || null;
    if (data.image !== undefined)
      backendData.image = (data.image && data.image.trim()) || null;
    if (data.startDate !== undefined)
      backendData.start_date =
        data.startDate && data.startDate.trim()
          ? new Date(data.startDate + "T00:00:00").toISOString()
          : null;
    // google_form_link has isUrl validation, so empty string will fail - must be null or valid URL
    if (data.googleFormLink !== undefined)
      backendData.google_form_link =
        data.googleFormLink &&
        data.googleFormLink.trim() &&
        data.googleFormLink.trim().startsWith("http")
          ? data.googleFormLink.trim()
          : null;

    const response = await backendApiServer.put(
      `/api/digital-skill-training/programs/${resolvedParams.id}`,
      backendData,
      req
    );
    // Backend returns the program directly
    const program = response;
    // Transform back to admin format
    return Response.json({
      id: program.id,
      title: program.program_title || data.title || "",
      icon: data.icon || "code", // Preserve from request
      iconColor: data.iconColor || "teal", // Preserve from request
      projectCount: data.projectCount || "", // Preserve from request
      duration: program.duration || "",
      level: program.about === "closed" ? "Closed" : "Open",
      description: program.description || "",
      skills: data.skills || [], // Preserve from request
      email: program.email || data.email || "info@stempower.org",
      startDate: program.start_date
        ? (() => {
            const date = new Date(program.start_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          })()
        : data.startDate || "",
      image: program.image || data.image || null,
      googleFormLink: program.google_form_link || data.googleFormLink || null,
      status: program.status || data.status || "free",
    });
  } catch (error: any) {
    console.error("Error updating program:", error);
    return Response.json(
      { error: error.message || "Failed to update" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params;
    console.log("Deleting program with ID:", resolvedParams.id);
    await backendApiServer.delete(
      `/api/digital-skill-training/programs/${resolvedParams.id}`,
      req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting program:", error);
    return Response.json(
      { error: error.message || "Not found" },
      { status: 404 }
    );
  }
}
