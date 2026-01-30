import { NextRequest, NextResponse } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Transform backend hero data to frontend format
function transformHero(hero: any) {
  return {
    id: hero.id?.toString() || hero.id,
    title: hero.title || "",
    subtitle: hero.subtitle || "",
    image: hero.image_url || "",
    description: hero.description || "",
    stats: hero.stats || {},
  };
}

export async function GET(req: NextRequest) {
  try {
    const heroes = await backendApiServer.get("/api/heroes", req);

    // Filter only active heroes and transform data
    const activeHeroes = Array.isArray(heroes)
      ? heroes.filter((h: any) => h.isActive !== false).map(transformHero)
      : [];

    // Return in the format expected by the frontend
    return NextResponse.json(activeHeroes.length > 0 ? activeHeroes : []);
  } catch (error: any) {
    console.error("Error fetching heroes from backend:", error);
    // Return empty array on error to prevent frontend crashes
    // Log the error details for debugging
    const errorMessage = error?.message || "Unknown error";
    console.error("Backend connection error details:", errorMessage);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Check if request is FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Forward FormData directly to backend
      const response = await backendApiServer.postFormData(
        "/api/heroes",
        formData as any,
        req
      );

      // Backend returns hero object directly (not wrapped in { success, data })
      return NextResponse.json(transformHero(response), { status: 201 });
    }

    // Handle JSON request
    const slide = await req.json();

    // Create FormData from JSON data
    const formData = new FormData();
    formData.append("title", slide.title || "");
    formData.append("subtitle", slide.subtitle || "");
    formData.append("description", slide.description || "");
    formData.append("isActive", slide.isActive !== false ? "true" : "false");

    // Handle image - could be base64 string, File, Blob, or URL
    let imageFile: File | Blob | null = null;

    if (slide.image) {
      // Check if it's a base64 data URL
      if (
        typeof slide.image === "string" &&
        slide.image.startsWith("data:image")
      ) {
        // Convert base64 to Blob (Node.js environment)
        const base64Data = slide.image.split(",")[1] || slide.image;
        const mimeType = slide.image.match(/data:([^;]+);/)?.[1] || "image/png";
        // Use Buffer in Node.js environment
        const buffer = Buffer.from(base64Data, "base64");
        imageFile = new Blob([buffer], { type: mimeType });
      } else if (slide.image instanceof File || slide.image instanceof Blob) {
        imageFile = slide.image;
      } else if (
        typeof slide.image === "string" &&
        slide.image.startsWith("http")
      ) {
        // If it's a URL, fetch it and convert to Blob
        try {
          const imageResponse = await fetch(slide.image);
          imageFile = await imageResponse.blob();
        } catch (fetchError) {
          console.error("Error fetching image from URL:", fetchError);
          return NextResponse.json(
            { error: "Failed to fetch image from URL" },
            { status: 400 }
          );
        }
      }
    }

    // If no image provided, return error (backend requires image)
    if (!imageFile) {
      return NextResponse.json(
        { error: "Image is required. Please upload an image file." },
        { status: 400 }
      );
    }

    // Append image file to FormData
    // The backend expects the field name to be "file"
    formData.append("file", imageFile, "hero-image.png");

    const response = await backendApiServer.postFormData(
      "/api/heroes",
      formData,
      req
    );
    return NextResponse.json(transformHero(response), { status: 201 });
  } catch (error: any) {
    console.error("Error creating hero:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create hero" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    // Handle array of slides or single slide
    if (Array.isArray(data.slides)) {
      // Update multiple heroes
      const updates = await Promise.all(
        data.slides.map((slide: any) => {
          const backendData = {
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description || "",
            isActive: slide.isActive !== false,
          };
          return slide.id
            ? backendApiServer.put(`/api/heroes/${slide.id}`, backendData, req)
            : backendApiServer.post("/api/heroes", backendData, req);
        })
      );
      return NextResponse.json(updates.map(transformHero));
    } else if (data.id) {
      // Update single hero
      const backendData = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description || "",
        isActive: data.isActive !== false,
      };
      const updated = await backendApiServer.put(
        `/api/heroes/${data.id}`,
        backendData,
        req
      );
      return NextResponse.json(transformHero(updated));
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error updating hero:", error);
    return NextResponse.json(
      { error: "Failed to update hero" },
      { status: 500 }
    );
  }
}
