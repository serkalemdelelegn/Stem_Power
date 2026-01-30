import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/business-development/success-stories",
      req
    );
    // Backend returns { success: true, data: [...] }
    const stories = response.data || [];
    // Transform backend format to admin page format
    const transformedStories = stories.map((story: any) => ({
      id: story.id,
      name: story.business_name, // Backend uses 'business_name', admin uses 'name'
      licenseStatus: story.license_status,
      category: story.category,
      categoryColor: story.category_color || "blue",
      contactPerson: story.contact_person,
      phone: story.phone,
      email: story.email || "",
    }));
    return Response.json(transformedStories);
  } catch (error: any) {
    console.error("Error fetching success stories:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Transform admin format to backend format
    const backendData = {
      business_name: data.name, // Admin uses 'name', backend uses 'business_name'
      license_status: data.licenseStatus,
      category: data.category,
      category_color: data.categoryColor || null,
      contact_person: data.contactPerson,
      phone: data.phone,
      email: data.email || "",
    };
    const response = await backendApiServer.post(
      "/api/business-development/success-stories",
      backendData,
      req
    );
    // Backend returns { success: true, data: story }
    const story = response.data;
    // Transform back to admin format
    return Response.json(
      {
        id: story.id,
        name: story.business_name,
        licenseStatus: story.license_status,
        category: story.category,
        categoryColor: story.category_color || "blue",
        contactPerson: story.contact_person,
        phone: story.phone,
        email: story.email || "",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating success story:", error);
    return Response.json(
      { error: error.message || "Failed to create item" },
      { status: 400 }
    );
  }
}
