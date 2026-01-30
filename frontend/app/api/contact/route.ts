import { NextRequest, NextResponse } from "next/server";
import { fetchContactInfo } from "@/lib/api-contact";
import { backendApiServer } from "@/lib/backend-api-server";
import { transformBackendContactToFrontend, transformFrontendContactToBackend } from "@/lib/api-contact";

export async function GET() {
  try {
    const contactInfo = await fetchContactInfo();
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get existing offices to update the first one
    const existingOffices = await backendApiServer.get("/api/contact-office", req);
    const officesArray = Array.isArray(existingOffices) ? existingOffices : [];
    
    if (officesArray.length === 0) {
      return NextResponse.json(
        { error: "No contact office found to update" },
        { status: 404 }
      );
    }

    const office = officesArray[0];
    const officeId = office.id;

    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Create FormData for backend
      const backendFormData = new FormData();
      
      // Extract image file if present
      const image = formData.get("image") as File | null;
      if (image instanceof File) {
        backendFormData.append("file", image);
      }
      
      // Extract and append all other fields
      const address = formData.get("address") as string;
      const addressDetails = formData.get("addressDetails") as string;
      const phone = formData.get("phone") as string;
      const mobile = formData.get("mobile") as string;
      const email = formData.get("email") as string;
      const website = formData.get("website") as string;
      const officeHours = formData.get("officeHours") as string;
      const mapLink = formData.get("mapLink") as string;
      
      // Transform frontend data to backend format
      const frontendData = {
        address: address || "",
        addressDetails: addressDetails || "",
        phone: phone || "",
        mobile: mobile || "",
        email: email || "",
        website: website || "",
        officeHours: officeHours || "",
        mapLink: mapLink || "",
        image: image instanceof File ? image : (formData.get("image") as string) || "",
      };
      
      const backendData = transformFrontendContactToBackend(frontendData);
      
      // Append all backend fields to FormData
      Object.keys(backendData).forEach((key) => {
        const value = backendData[key as keyof typeof backendData];
        if (value !== null && value !== undefined) {
          if (typeof value === "object" && !Array.isArray(value)) {
            backendFormData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            backendFormData.append(key, JSON.stringify(value));
          } else {
            backendFormData.append(key, String(value));
          }
        }
      });
      
      // Ensure country_office is always included
      if (!backendData.country_office) {
        backendFormData.append("country_office", "Ethiopia");
      }
      
      // Send to backend using server-side API with cookie forwarding
      const response = await backendApiServer.putFormData(
        `/api/contact-office/${officeId}`,
        backendFormData as any,
        req
      );
      
      return NextResponse.json(transformBackendContactToFrontend(response));
    }
    
    // Otherwise, handle as JSON
    const data = await req.json();
    const backendData = transformFrontendContactToBackend(data);
    
    // Send to backend using server-side API with cookie forwarding
    const response = await backendApiServer.put(
      `/api/contact-office/${officeId}`,
      backendData,
      req
    );
    
    return NextResponse.json(transformBackendContactToFrontend(response));
  } catch (error: any) {
    console.error("Error updating contact info:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update contact info" },
      { status: 400 }
    );
  }
}
