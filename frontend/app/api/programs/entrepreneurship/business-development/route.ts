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
    
    // Validate required fields
    if (!data.name || !data.name.trim()) {
      return Response.json({ error: "Business name is required" }, { status: 400 });
    }
    if (!data.licenseStatus || !data.licenseStatus.trim()) {
      return Response.json({ error: "License status is required" }, { status: 400 });
    }
    if (!data.category || !data.category.trim()) {
      return Response.json({ error: "Category is required" }, { status: 400 });
    }
    if (!data.contactPerson || !data.contactPerson.trim()) {
      return Response.json({ error: "Contact person is required" }, { status: 400 });
    }
    if (!data.phone || !data.phone.trim()) {
      return Response.json({ error: "Phone is required" }, { status: 400 });
    }
    if (!data.email || !data.email.trim()) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    
    // Transform admin format to backend format
    const backendData = {
      business_name: data.name.trim(), // Admin uses 'name', backend uses 'business_name'
      license_status: data.licenseStatus.trim(),
      category: data.category.trim(),
      category_color: data.categoryColor || null,
      contact_person: data.contactPerson.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
    };
    
    const response = await backendApiServer.post(
      "/api/business-development/success-stories",
      backendData,
      req
    );
    
    // Backend returns { success: true, data: story }
    if (!response || !response.data) {
      return Response.json(
        { error: "Invalid response from backend" },
        { status: 500 }
      );
    }
    
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
    // Extract error message from backend response if available
    const errorMessage = error.response?.data?.message || error.message || "Failed to create item";
    return Response.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
