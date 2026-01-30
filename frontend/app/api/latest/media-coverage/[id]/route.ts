import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend press article to frontend format
function transformBackendArticleToFrontend(backendArticle: any) {
  if (!backendArticle || typeof backendArticle !== "object") {
    return null;
  }

  // Handle both direct object and data wrapper
  const article = backendArticle.data || backendArticle;

  // Generate slug if missing
  const slugify = (value: string) =>
    value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  let slug = article.slug || "";
  if (!slug && article.title) {
    slug = slugify(article.title);
  }

  // Format date
  let date = "";
  if (article.date) {
    if (typeof article.date === "string") {
      // Check if it's already in ISO format
      if (/^\d{4}-\d{2}-\d{2}/.test(article.date)) {
        date = article.date;
      } else {
        const parsed = new Date(article.date);
        if (!isNaN(parsed.getTime())) {
          date = parsed.toISOString().split("T")[0];
        }
      }
    } else {
      date = new Date(article.date).toISOString().split("T")[0];
    }
  }

  return {
    id: String(article.id || ""),
    slug: slug,
    title: article.title || "",
    excerpt:
      article.excerpt || article.content?.substring(0, 200) + "..." || "",
    date: date || new Date().toISOString().split("T")[0],
    category: article.category || "General",
    image: article.image || "",
    readTime: article.readTime || "",
    pdfUrl: article.pdfUrl || "",
    featured: article.featured || false,
    badge: article.badge || "",
    author: article.author || "",
    topic: article.topic || "",
    source: article.source || "press",
    content: article.content || "",
    publication: article.publication || "",
    publicationType: article.publicationType || "",
    quote: article.quote || "",
  };
}

// Helper function to transform frontend article to backend format
function transformFrontendArticleToBackend(frontendArticle: any) {
  // Generate slug if missing
  const slugify = (value: string) =>
    value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  let slug = frontendArticle.slug || "";
  if (!slug && frontendArticle.title) {
    slug = slugify(frontendArticle.title);
  }

  // Parse date
  let date: Date | null = null;
  if (frontendArticle.date) {
    if (typeof frontendArticle.date === "string") {
      // Check if it's in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(frontendArticle.date)) {
        date = new Date(frontendArticle.date);
      } else {
        date = new Date(frontendArticle.date);
      }
    }
  }
  if (!date || isNaN(date.getTime())) {
    date = new Date();
  }

  return {
    title: frontendArticle.title || "",
    content: frontendArticle.content || frontendArticle.excerpt || "",
    image:
      frontendArticle.image instanceof File
        ? null
        : frontendArticle.image || null,
    source: frontendArticle.source || null,
    slug: slug,
    excerpt: frontendArticle.excerpt || "",
    category: frontendArticle.category || "General",
    date: date.toISOString(),
    readTime: frontendArticle.readTime || null,
    pdfUrl: frontendArticle.pdfUrl || null,
    featured: frontendArticle.featured || false,
    author: frontendArticle.author || null,
    publication: frontendArticle.publication || null,
    publicationType: frontendArticle.publicationType || null,
    quote: frontendArticle.quote || null,
    topic: frontendArticle.topic || null,
    badge: frontendArticle.badge || null,
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const response = await backendApiServer.get(
      `/api/news/press/${id}`,
      req
    );
    const transformed = transformBackendArticleToFrontend(response);
    if (!transformed) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Media Coverage] GET error:", error);
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
      const articleData: any = {};
      for (const [key, value] of formData.entries()) {
        if (key === "file") {
          // File will be handled by backend middleware
          continue;
        }
        // Try to parse JSON strings, otherwise use as-is
        try {
          const parsed = JSON.parse(value as string);
          articleData[key] = parsed;
        } catch {
          articleData[key] = value;
        }
      }

      // Transform to backend format
      const backendData = transformFrontendArticleToBackend(articleData);

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
        `/api/news/press/${id}`,
        backendFormData as any,
        req
      );
      const transformed = transformBackendArticleToFrontend(response);
      if (!transformed) {
        return Response.json(
          { error: "Failed to transform article" },
          { status: 500 }
        );
      }
      return Response.json(transformed);
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const backendData = transformFrontendArticleToBackend(data);

    const response = await backendApiServer.put(
      `/api/news/press/${id}`,
      backendData,
      req
    );
    const transformed = transformBackendArticleToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform article" },
        { status: 500 }
      );
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Media Coverage] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update article" },
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

    await backendApiServer.delete(`/api/news/press/${id}`, req);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Media Coverage] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete article" },
      { status: 400 }
    );
  }
}
