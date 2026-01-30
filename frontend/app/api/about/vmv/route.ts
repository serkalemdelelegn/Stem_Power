import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/about/vmv/active", req);
    // Return as array to match what the frontend expects
    if (response) {
      return Response.json([response]);
    }
    return Response.json([]);
  } catch (error: any) {
    console.error("[About VMV] GET error:", error);
    return Response.json([], { status: 200 }); // Return empty array for graceful handling
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Extract all fields
      const badge = formData.get("badge") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const statistic = formData.get("statistic") as string;
      const mission = formData.get("mission") as string;
      const vision = formData.get("vision") as string;
      const whoWeAreBadge = formData.get("whoWeAreBadge") as string;
      const whoWeAreTitle = formData.get("whoWeAreTitle") as string;
      const whoWeAreDescription = formData.get("whoWeAreDescription") as string;

      // Parse JSON fields
      let values = [];
      try {
        const valuesStr = formData.get("values") as string;
        if (valuesStr) {
          values = JSON.parse(valuesStr);
        }
      } catch (e) {
        console.error("[About VMV] Error parsing values:", e);
        values = [];
      }

      // Handle images - create new FormData for backend
      const backendFormData = new FormData();

      // Add text fields
      if (badge) backendFormData.append("badge", badge);
      if (title) backendFormData.append("title", title);
      if (description) backendFormData.append("description", description);
      if (statistic) backendFormData.append("statistic", statistic);
      if (mission) backendFormData.append("mission", mission);
      if (vision) backendFormData.append("vision", vision);

      // Add whoWeAre fields
      if (whoWeAreBadge) backendFormData.append("whoWeAreBadge", whoWeAreBadge);
      if (whoWeAreTitle) backendFormData.append("whoWeAreTitle", whoWeAreTitle);
      if (whoWeAreDescription)
        backendFormData.append("whoWeAreDescription", whoWeAreDescription);

      const whoWeAreImageUrl = formData.get("whoWeAreImageUrl") as string;
      if (whoWeAreImageUrl)
        backendFormData.append("whoWeAreImageUrl", whoWeAreImageUrl);

      // Handle hero image
      const heroImage = formData.get("heroImage") as File | null;
      if (heroImage && heroImage instanceof File) {
        backendFormData.append("file", heroImage);
      } else if (formData.get("image")) {
        backendFormData.append("image", formData.get("image") as string);
      }

      // Handle whoWeAre image
      const whoWeAreImage = formData.get("whoWeAreImage") as File | null;
      if (whoWeAreImage && whoWeAreImage instanceof File) {
        backendFormData.append("whoWeAreImage", whoWeAreImage);
      }

      // Add values
      backendFormData.append("values", JSON.stringify(values));

      console.log("[About VMV] Sending to backend:", {
        badge: !!badge,
        title: !!title,
        hasMission: !!mission,
        hasVision: !!vision,
        valuesCount: Array.isArray(values) ? values.length : 0,
        hasWhoWeAre: !!whoWeAreBadge || !!whoWeAreTitle,
      });

      const response = await backendApi.postFormData(
        "/api/vmv",
        backendFormData as any
      );

      console.log("[About VMV] Backend response:", {
        hasWhoWeAre: !!response?.whoWeAre,
        valuesCount: Array.isArray(response?.values)
          ? response.values.length
          : 0,
      });

      // Return as array to match frontend expectations
      return Response.json([response], { status: 201 });
    }

    // Otherwise, handle as JSON
    const data = await req.json();
    const response = await backendApiServer.post("/api/about/vmv", data, req);
    // Return as array to match frontend expectations
    return Response.json([response], { status: 201 });
  } catch (error: any) {
    console.error("[About VMV] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to save VMV data" },
      { status: 400 }
    );
  }
}
