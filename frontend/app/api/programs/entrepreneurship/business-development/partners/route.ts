import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/business-development/partners",
      req
    );
    // Backend returns { success: true, data: [...] }
    const partners = response.data || [];
    // Transform backend format to admin page format
    const transformedPartners = partners.map((partner: any) => ({
      id: partner.id,
      image: partner.logo || "",
      title: partner.name, // Backend uses 'name', admin uses 'title'
      contribution: partner.contribution_description || "",
      contributionDescription: partner.contribution_description || "",
      focusArea: partner.focus_area || "",
      partnerSince: partner.partnership_duration || "",
      peopleImpacted: partner.people_impacted || "",
    }));
    return Response.json(transformedPartners);
  } catch (error: any) {
    console.error("Error fetching partners:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Check if request is FormData (file upload) - browser sets boundary in content-type
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      try {
        // Forward FormData directly to backend
        const response = await backendApiServer.postFormData(
          "/api/business-development/partners",
          formData as any,
          req
        );

        // Backend returns { success: true, data: partner }
        if (!response || !response.data) {
          throw new Error("Invalid response from backend");
        }
        const partner = response.data;
        // Transform back to admin format
        return Response.json(
          {
            id: partner.id,
            image: partner.logo || "",
            title: partner.name,
            contribution: partner.contribution_description || "",
            contributionDescription: partner.contribution_description || "",
            focusArea: partner.focus_area || "",
            partnerSince: partner.partnership_duration || "",
            peopleImpacted: partner.people_impacted || "",
          },
          { status: 201 }
        );
      } catch (backendError: any) {
        console.error("Backend error details:", backendError);
        throw backendError;
      }
    }

    // Handle JSON request (for URL strings)
    // Try to parse as JSON, but if it fails, it might be FormData without proper content-type
    let data;
    try {
      data = await req.json();
    } catch (jsonError) {
      // If JSON parsing fails, try FormData
      const formData = await req.formData();
      const response = await backendApiServer.postFormData(
        "/api/business-development/partners",
        formData as any,
        req
      );
      const partner = response.data;
      return Response.json(
        {
          id: partner.id,
          image: partner.logo || "",
          title: partner.name,
          contribution: partner.contribution_description || "",
          contributionDescription: partner.contribution_description || "",
          focusArea: partner.focus_area || "",
          partnerSince: partner.partnership_duration || "",
          peopleImpacted: partner.people_impacted || "",
        },
        { status: 201 }
      );
    }
    // Transform admin format to backend format
    const backendData = {
      name: data.title, // Admin uses 'title', backend uses 'name'
      logo: data.image || null,
      contribution_description:
        data.contribution || data.contributionDescription || "",
      focus_area: data.focusArea || "",
      partnership_duration: data.partnerSince || null,
      people_impacted: data.peopleImpacted || null,
    };
    const response = await backendApiServer.post(
      "/api/business-development/partners",
      backendData,
      req
    );
    // Backend returns { success: true, data: partner }
    const partner = response.data;
    // Transform back to admin format
    return Response.json(
      {
        id: partner.id,
        image: partner.logo || "",
        title: partner.name,
        contribution: partner.contribution_description || "",
        contributionDescription: partner.contribution_description || "",
        focusArea: partner.focus_area || "",
        partnerSince: partner.partnership_duration || "",
        peopleImpacted: partner.people_impacted || "",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating partner:", error);
    // Handle both Error objects and response errors
    const errorMessage =
      error?.message || error?.toString() || "Failed to create partner";
    return Response.json({ error: errorMessage }, { status: 400 });
  }
}
