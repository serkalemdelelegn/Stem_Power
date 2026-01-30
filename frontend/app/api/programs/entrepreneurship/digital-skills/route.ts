import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/programs/entrepreneurship/digital-skills/programs",
      req
    );
    // Backend returns array directly (not wrapped in { success, data })
    const programs = response || [];
    // Transform backend format to admin page format
    const transformedPrograms = programs.map((program: any) => ({
      id: program.id,
      title: program.program_title || "", // Backend uses 'program_title', admin uses 'title'
      icon: program.icon || "code", // Not in backend, use default
      iconColor: program.iconColor || "teal", // Not in backend, use default
      projectCount: program.projectCount || "", // Not in backend, use default
      duration: program.duration || "",
      level: program.about === "closed" ? "Closed" : "Open", // Map about enum to level
      description: program.description || "",
      skills: program.skills || [], // Not in backend, use default
      email: program.email || "info@stempower.org",
      startDate: program.start_date
        ? (() => {
            const date = new Date(program.start_date);
            // Get date in local timezone to avoid timezone shifts
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          })()
        : "",
      image: program.image || null,
      googleFormLink: program.google_form_link || null,
      status: program.status || "free",
    }));
    return Response.json(transformedPrograms);
  } catch (error: any) {
    console.error("Error fetching programs:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.title.trim()) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    // Transform admin format to backend format
    // Backend expects: program_title, email (required), about, status, duration, description, etc.
    // Admin sends: title, icon, iconColor, projectCount, duration, level, description, skills
    const backendData: any = {
      program_title: data.title.trim(), // Admin uses 'title', backend uses 'program_title'
      email: (data.email && data.email.trim()) || "info@stempower.org", // Required field, use default if not provided
      about: data.level === "Closed" ? "closed" : "open", // Map level to about enum
      status: data.status || "free", // Default to free
      duration: (data.duration && data.duration.trim()) || null,
      description: (data.description && data.description.trim()) || null,
      image: (data.image && data.image.trim()) || null,
      start_date:
        data.startDate && data.startDate.trim()
          ? new Date(data.startDate + "T00:00:00").toISOString()
          : null,
      // google_form_link has isUrl validation, so empty string will fail - must be null or valid URL
      google_form_link:
        data.googleFormLink &&
        data.googleFormLink.trim() &&
        data.googleFormLink.trim().startsWith("http")
          ? data.googleFormLink.trim()
          : null,
      // Note: icon, iconColor, projectCount, skills are not in backend model
      // They will be stored in a separate field or ignored
    };

    console.log(
      "Creating program with backend data:",
      JSON.stringify(backendData, null, 2)
    );

    const response = await backendApiServer.post(
      "/api/programs/entrepreneurship/digital-skills/programs",
      backendData,
      req
    );
    // Backend returns the program directly
    const program = response;
    console.log(
      "Backend response after create:",
      JSON.stringify(program, null, 2)
    );

    // Verify all fields were saved
    if (!program.email) {
      console.warn("Warning: email not returned from backend");
    }
    if (!program.start_date && backendData.start_date) {
      console.warn("Warning: start_date not returned from backend");
    }
    if (!program.image && backendData.image) {
      console.warn("Warning: image not returned from backend");
    }
    if (!program.google_form_link && backendData.google_form_link) {
      console.warn("Warning: google_form_link not returned from backend");
    }
    // Transform back to admin format
    return Response.json(
      {
        id: program.id,
        title: program.program_title || "",
        icon: data.icon || "code", // Preserve from request since backend doesn't store it
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
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating program:", error);
    // Extract more detailed error message
    let errorMessage = error.message || "Failed to create item";
    if (errorMessage.includes("email") || errorMessage.includes("Email")) {
      errorMessage = "Invalid email address. Please provide a valid email.";
    } else if (
      errorMessage.includes("program_title") ||
      errorMessage.includes("title")
    ) {
      errorMessage = "Program title is required.";
    } else if (errorMessage.includes("Internal Server Error")) {
      errorMessage =
        "Server error. Please check the console for details and ensure all required fields are provided.";
    }
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}
