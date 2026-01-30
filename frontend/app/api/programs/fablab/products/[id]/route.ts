import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Check if request is FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      try {
        // Forward FormData directly to backend
        const response = await backendApiServer.putFormData(
          `/api/fablab-products/products/${params.id}`,
          formData as any,
          req
        );

        // Backend returns the updated product directly or wrapped in data
        if (!response) {
          throw new Error("Invalid response from backend");
        }
        const product = response.data || response;
        return Response.json(product);
      } catch (error: any) {
        console.error("[Products] PUT FormData error:", error);
        return Response.json(
          { error: error.message || "Failed to update product" },
          { status: 400 }
        );
      }
    }

    // Handle JSON request (for URL strings or no image)
    try {
      const data = await req.json();
      const response = await backendApiServer.put(
        `/api/fablab-products/products/${params.id}`,
        data,
        req
      );
      // Backend returns product directly or wrapped in data
      const product = response.data || response;
      return Response.json(product);
    } catch (error: any) {
      // If JSON parsing fails, try FormData as fallback
      if (error.message?.includes("JSON")) {
        try {
          const formData = await req.formData();
          const response = await backendApiServer.putFormData(
            `/api/fablab-products/products/${params.id}`,
            formData as any,
            req
          );
          // Backend returns product directly or wrapped in data
          const product = response.data || response;
          return Response.json(product);
        } catch (formDataError: any) {
          console.error("[Products] PUT error:", formDataError);
          return Response.json(
            { error: formDataError.message || "Failed to update product" },
            { status: 400 }
          );
        }
      }
      throw error;
    }
  } catch (error: any) {
    console.error("[Products] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await backendApiServer.delete(
      `/api/fablab-products/products/${params.id}`,
      req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Products] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete product" },
      { status: 400 }
    );
  }
}
