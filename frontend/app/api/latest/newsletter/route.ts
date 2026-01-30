import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend newsletter to frontend format
function transformBackendNewsletterToFrontend(backendNewsletter: any) {
  if (!backendNewsletter || typeof backendNewsletter !== "object") {
    return null;
  }

  // Handle both direct object and data wrapper
  const newsletter = backendNewsletter.data || backendNewsletter;

  // Generate slug if missing
  const slugify = (value: string) =>
    value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  let slug = newsletter.slug || "";
  if (!slug && newsletter.title) {
    slug = slugify(newsletter.title);
  }

  // Format date
  let date = "";
  if (newsletter.date) {
    if (typeof newsletter.date === "string") {
      // Check if it's already in ISO format
      if (/^\d{4}-\d{2}-\d{2}/.test(newsletter.date)) {
        date = newsletter.date;
      } else {
        const parsed = new Date(newsletter.date);
        if (!isNaN(parsed.getTime())) {
          date = parsed.toISOString().split("T")[0];
        }
      }
    } else {
      date = new Date(newsletter.date).toISOString().split("T")[0];
    }
  }

  return {
    id: String(newsletter.id || ""),
    slug: slug,
    title: newsletter.title || "",
    excerpt: newsletter.excerpt || "",
    date: date || new Date().toISOString().split("T")[0],
    category: newsletter.category || "General",
    image: newsletter.image || "",
    readTime: newsletter.readTime || "",
    pdfUrl: newsletter.pdfUrl || "",
    featured: newsletter.featured || false,
    badge: newsletter.badge || "",
    author: newsletter.author || "",
    topic: newsletter.topic || "",
    source: newsletter.source || "newsletter",
    content: newsletter.content || "",
    publication: newsletter.publication || "",
    publicationType: newsletter.publicationType || "",
    quote: newsletter.quote || "",
  };
}

// Helper function to transform frontend newsletter to backend format
function transformFrontendNewsletterToBackend(frontendNewsletter: any) {
  // Generate slug if missing
  const slugify = (value: string) =>
    value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  let slug = frontendNewsletter.slug || "";
  if (!slug && frontendNewsletter.title) {
    slug = slugify(frontendNewsletter.title);
  }

  // Parse date
  let date: Date | null = null;
  if (frontendNewsletter.date) {
    if (typeof frontendNewsletter.date === "string") {
      // Check if it's in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(frontendNewsletter.date)) {
        date = new Date(frontendNewsletter.date);
      } else {
        date = new Date(frontendNewsletter.date);
      }
    }
  }
  if (!date || isNaN(date.getTime())) {
    date = new Date();
  }

  return {
    title: frontendNewsletter.title || "",
    content: frontendNewsletter.content || frontendNewsletter.excerpt || "",
    image:
      frontendNewsletter.image instanceof File
        ? null
        : frontendNewsletter.image || null,
    source: "newsletter", // Always set source to "newsletter"
    slug: slug,
    excerpt: frontendNewsletter.excerpt || "",
    category: frontendNewsletter.category || "General",
    date: date.toISOString(),
    readTime: frontendNewsletter.readTime || null,
    pdfUrl: frontendNewsletter.pdfUrl || null,
    featured: frontendNewsletter.featured || false,
    author: frontendNewsletter.author || null,
    publication: frontendNewsletter.publication || null,
    publicationType: frontendNewsletter.publicationType || null,
    quote: frontendNewsletter.quote || null,
    topic: frontendNewsletter.topic || null,
    badge: frontendNewsletter.badge || null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/news/newsletter", req);
    const newslettersArray = Array.isArray(response) ? response : [];

    // Transform newsletters
    const transformedNewsletters = newslettersArray
      .map(transformBackendNewsletterToFrontend)
      .filter((n: any): n is NonNullable<typeof n> => n !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1)); // Sort by date descending

    return Response.json(transformedNewsletters);
  } catch (error: any) {
    console.error("[Newsletter] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Extract data from FormData
      const newsletterData: any = {};
      for (const [key, value] of formData.entries()) {
        if (key === "file") {
          // File will be handled by backend middleware
          continue;
        }
        // Try to parse JSON strings, otherwise use as-is
        try {
          const parsed = JSON.parse(value as string);
          newsletterData[key] = parsed;
        } catch {
          newsletterData[key] = value;
        }
      }

      // Transform to backend format
      const backendData = transformFrontendNewsletterToBackend(newsletterData);

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

      const response = await backendApiServer.postFormData(
        "/api/news/newsletter",
        backendFormData as any,
        req
      );
      const transformed = transformBackendNewsletterToFrontend(response);
      if (!transformed) {
        return Response.json(
          { error: "Failed to transform newsletter" },
          { status: 500 }
        );
      }
      return Response.json(transformed, { status: 201 });
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const backendData = transformFrontendNewsletterToBackend(data);

    const response = await backendApiServer.post(
      "/api/latest/newsletter",
      backendData,
      req
    );
    const transformed = transformBackendNewsletterToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform newsletter" },
        { status: 500 }
      );
    }
    return Response.json(transformed, { status: 201 });
  } catch (error: any) {
    console.error("[Newsletter] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create newsletter" },
      { status: 400 }
    );
  }
}
