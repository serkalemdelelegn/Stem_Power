import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend event to frontend format
function transformBackendEventToFrontend(backendEvent: any) {
  if (!backendEvent || typeof backendEvent !== "object") {
    return null;
  }

  // Handle both direct object and data wrapper
  const event = backendEvent.data || backendEvent;

  // Parse highlights if it's a JSON string
  let highlights: string[] = [];
  if (event.highlights) {
    if (Array.isArray(event.highlights)) {
      highlights = event.highlights;
    } else if (typeof event.highlights === "string") {
      try {
        highlights = JSON.parse(event.highlights);
      } catch {
        highlights = [];
      }
    }
  }

  // Format dates - for admin page date inputs, use YYYY-MM-DD format
  let date = "";
  if (event.start_date) {
    // For date input fields, use YYYY-MM-DD format
    const dateObj = new Date(event.start_date);
    date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD format
  } else if (event.date) {
    // Check if it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
      date = event.date;
    } else {
      // Try to parse formatted date string
      const parsed = new Date(event.date);
      if (!isNaN(parsed.getTime())) {
        date = parsed.toISOString().split("T")[0];
      } else {
        date = event.date;
      }
    }
  }

  let endDate: string | undefined = undefined;
  if (event.end_date) {
    const dateObj = new Date(event.end_date);
    endDate = dateObj.toISOString().split("T")[0];
  } else if (event.endDate) {
    // Check if it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(event.endDate)) {
      endDate = event.endDate;
    } else {
      const parsed = new Date(event.endDate);
      if (!isNaN(parsed.getTime())) {
        endDate = parsed.toISOString().split("T")[0];
      } else {
        endDate = event.endDate;
      }
    }
  }

  // Determine status
  let status: "upcoming" | "past" = event.status || "upcoming";
  if (!event.status && event.end_date) {
    const endDateObj = new Date(event.end_date);
    const now = new Date();
    status = endDateObj < now ? "past" : "upcoming";
  }

  return {
    id: String(event.id || ""),
    title: event.title || "",
    badge: event.badge || event.category || "",
    description: event.description || "",
    fullDescription: event.fullDescription || event.description || "",
    image: event.image_url || event.image || "",
    date: date,
    endDate: endDate,
    time: event.time || "",
    location: event.location || "",
    category: event.category || event.badge || "Event",
    participants: event.participants || "",
    status: status,
    featured: event.featured || false,
    registrationLink: event.registrationLink || event.event_url || "",
    registrationDeadline: event.registrationDeadline || "",
    highlights: highlights,
  };
}

// Helper function to transform frontend event to backend format
function transformFrontendEventToBackend(frontendEvent: any) {
  // Parse date strings to ISO strings for backend
  // Frontend sends dates as "YYYY-MM-DD" format from date inputs
  let start_date: string = "";
  if (frontendEvent.date) {
    if (typeof frontendEvent.date === "string") {
      // Check if it's already in ISO format (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(frontendEvent.date)) {
        start_date = new Date(frontendEvent.date).toISOString();
      } else {
        // Try to parse as formatted date string
        const parsed = new Date(frontendEvent.date);
        if (!isNaN(parsed.getTime())) {
          start_date = parsed.toISOString();
        } else {
          start_date = new Date().toISOString();
        }
      }
    }
  }
  if (!start_date) {
    start_date = new Date().toISOString(); // Default to now
  }

  let end_date: string | null = null;
  if (frontendEvent.endDate) {
    if (typeof frontendEvent.endDate === "string") {
      // Check if it's already in ISO format (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(frontendEvent.endDate)) {
        end_date = new Date(frontendEvent.endDate).toISOString();
      } else {
        const parsed = new Date(frontendEvent.endDate);
        if (!isNaN(parsed.getTime())) {
          end_date = parsed.toISOString();
        }
      }
    }
  }
  if (!end_date) {
    end_date = start_date; // Use start_date if no end_date
  }

  // Determine status
  let status = frontendEvent.status || "upcoming";
  if (!frontendEvent.status && end_date) {
    const endDateObj = new Date(end_date);
    const now = new Date();
    status = endDateObj < now ? "past" : "upcoming";
  }

  return {
    title: frontendEvent.title || "",
    description: frontendEvent.description || "",
    start_date: start_date,
    end_date: end_date,
    location: frontendEvent.location || null,
    is_virtual: false,
    event_url: frontendEvent.registrationLink || null,
    category: frontendEvent.category || frontendEvent.badge || "Event",
    badge: frontendEvent.badge || frontendEvent.category || "Event",
    status: status,
    featured: frontendEvent.featured || false,
    time: frontendEvent.time || "",
    participants: frontendEvent.participants || null,
    registrationLink: frontendEvent.registrationLink || null,
    registrationDeadline: frontendEvent.registrationDeadline || null,
    fullDescription:
      frontendEvent.fullDescription || frontendEvent.description || null,
    highlights: Array.isArray(frontendEvent.highlights)
      ? frontendEvent.highlights
      : typeof frontendEvent.highlights === "string"
      ? (() => {
          try {
            return JSON.parse(frontendEvent.highlights);
          } catch {
            return [];
          }
        })()
      : [],
    image_url:
      frontendEvent.image instanceof File ? null : frontendEvent.image || null,
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
      `/api/latest/events/${id}`,
      req
    );
    const transformed = transformBackendEventToFrontend(response);
    if (!transformed) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Events] GET error:", error);
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
      const eventData: any = {};
      for (const [key, value] of formData.entries()) {
        if (key === "file") {
          // File will be handled by backend middleware
          continue;
        }
        // Try to parse JSON strings, otherwise use as-is
        try {
          const parsed = JSON.parse(value as string);
          eventData[key] = parsed;
        } catch {
          eventData[key] = value;
        }
      }

      // Transform to backend format
      const backendData = transformFrontendEventToBackend(eventData);

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
          if (Array.isArray(value)) {
            backendFormData.append(key, JSON.stringify(value));
          } else if (typeof value === "boolean") {
            backendFormData.append(key, value ? "true" : "false");
          } else {
            backendFormData.append(key, String(value));
          }
        }
      });

      const response = await backendApiServer.putFormData(
        `/api/latest/events/${id}`,
        backendFormData as any,
        req
      );
      const transformed = transformBackendEventToFrontend(response);
      if (!transformed) {
        return Response.json(
          { error: "Failed to transform event" },
          { status: 500 }
        );
      }
      return Response.json(transformed);
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const backendData = transformFrontendEventToBackend(data);

    const response = await backendApiServer.put(
      `/api/events/${id}`,
      backendData,
      req
    );
    const transformed = transformBackendEventToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform event" },
        { status: 500 }
      );
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Events] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update event" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    await backendApiServer.delete(`/api/events/${id}`, req);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Events] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete event" },
      { status: 400 }
    );
  }
}
