import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend social media post to frontend format
function transformBackendPostToFrontend(backendPost: any) {
  if (!backendPost || typeof backendPost !== "object") {
    return null;
  }

  // Handle both direct object and data wrapper
  const post = backendPost.data || backendPost;

  // Format date
  let date = "";
  if (post.date) {
    if (typeof post.date === "string") {
      // Check if it's already in ISO format
      if (/^\d{4}-\d{2}-\d{2}/.test(post.date)) {
        date = post.date;
      } else {
        const parsed = new Date(post.date);
        if (!isNaN(parsed.getTime())) {
          date = parsed.toISOString().split("T")[0];
        }
      }
    } else {
      date = new Date(post.date).toISOString().split("T")[0];
    }
  }

  return {
    id: String(post.id || ""),
    platform: post.platform || "Instagram",
    content: post.content || "",
    date: date || new Date().toISOString().split("T")[0],
    link: post.link || post.event_url || "",
    image: post.image || "",
    likes:
      typeof post.likeCount === "number"
        ? post.likeCount
        : typeof post.likes === "number"
        ? post.likes
        : typeof post.likes === "string"
        ? parseInt(post.likes, 10) || 0
        : 0,
    comments:
      typeof post.commentCount === "number"
        ? post.commentCount
        : typeof post.comments === "number"
        ? post.comments
        : typeof post.comments === "string"
        ? parseInt(post.comments, 10) || 0
        : 0,
    shares:
      typeof post.shares === "number"
        ? post.shares
        : typeof post.shares === "string"
        ? parseInt(post.shares, 10) || 0
        : 0,
  };
}

// Helper function to transform frontend social media post to backend format
function transformFrontendPostToBackend(frontendPost: any) {
  // Parse date
  let date: Date | null = null;
  if (frontendPost.date) {
    if (typeof frontendPost.date === "string") {
      // Check if it's in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(frontendPost.date)) {
        date = new Date(frontendPost.date);
      } else {
        date = new Date(frontendPost.date);
      }
    }
  }
  if (!date || isNaN(date.getTime())) {
    date = new Date();
  }

  return {
    title: frontendPost.content?.substring(0, 255) || "Social Media Post", // News model requires title
    content: frontendPost.content || "",
    image:
      frontendPost.image instanceof File ? null : frontendPost.image || null,
    source: "social", // Always set source to "social"
    platform: frontendPost.platform || "Instagram",
    link: frontendPost.link || null,
    shares:
      typeof frontendPost.shares === "number"
        ? frontendPost.shares
        : parseInt(String(frontendPost.shares || 0), 10) || 0,
    likeCount:
      typeof frontendPost.likes === "number"
        ? frontendPost.likes
        : parseInt(String(frontendPost.likes || 0), 10) || 0,
    commentCount:
      typeof frontendPost.comments === "number"
        ? frontendPost.comments
        : parseInt(String(frontendPost.comments || 0), 10) || 0,
    date: date.toISOString(),
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
      `/api/latest/social-media/${id}`,
      req
    );
    const transformed = transformBackendPostToFrontend(response);
    if (!transformed) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Social Media] GET error:", error);
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
      const postData: any = {};
      for (const [key, value] of formData.entries()) {
        if (key === "file") {
          // File will be handled by backend middleware
          continue;
        }
        // Try to parse JSON strings, otherwise use as-is
        try {
          const parsed = JSON.parse(value as string);
          postData[key] = parsed;
        } catch {
          postData[key] = value;
        }
      }

      // Transform to backend format
      const backendData = transformFrontendPostToBackend(postData);

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

      const response = await backendApi.putFormData(
        `/api/news/${id}`,
        backendFormData as any
      );
      const transformed = transformBackendPostToFrontend(response);
      if (!transformed) {
        return Response.json(
          { error: "Failed to transform post" },
          { status: 500 }
        );
      }
      return Response.json(transformed);
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const backendData = transformFrontendPostToBackend(data);

    const response = await backendApiServer.put(
      `/api/news/social-media/${id}`,
      backendData,
      req
    );
    const transformed = transformBackendPostToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform post" },
        { status: 500 }
      );
    }
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Social Media] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update post" },
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

    await backendApiServer.delete(`/api/news/social-media/${id}`, req);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Social Media] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete post" },
      { status: 400 }
    );
  }
}
