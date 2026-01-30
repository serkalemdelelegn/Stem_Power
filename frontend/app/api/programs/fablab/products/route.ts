import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const response = await backendApiServer.get(
      "/api/fablab-products/products",
      request
    );
    // Backend returns array directly, or wrapped in data property
    const products = Array.isArray(response) ? response : response.data || [];

    // If slug is provided, return single product
    if (slug) {
      const product = products.find((p: any) => {
        const productSlug = generateSlug(p.title || "");
        return productSlug === slug;
      });

      if (!product) {
        return Response.json({ error: "Product not found" }, { status: 404 });
      }

      return Response.json(product);
    }

    // Otherwise return all products
    return Response.json(products);
  } catch (error: any) {
    console.error("[Products] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Check if request is FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      try {
        // Forward FormData directly to backend
        const response = await backendApiServer.postFormData(
          "/api/fablab-products/products",
          formData as any,
          req
        );

        // Backend returns the created product directly or wrapped in data
        if (!response) {
          throw new Error("Invalid response from backend");
        }
        const product = response.data || response;

        return Response.json(product, { status: 201 });
      } catch (error: any) {
        console.error("[Products] POST FormData error:", error);
        return Response.json(
          { error: error.message || "Failed to create product" },
          { status: 400 }
        );
      }
    }

    // Handle JSON request (for URL strings or no image)
    try {
      const data = await req.json();
      const response = await backendApiServer.post(
        "/api/fablab-products/products",
        data,
        req
      );
      return Response.json(response.data, { status: 201 });
    } catch (error: any) {
      // If JSON parsing fails, try FormData as fallback
      if (error.message?.includes("JSON")) {
        try {
          const formData = await req.formData();
          const response = await backendApiServer.postFormData(
            "/api/fablab-products/products",
            formData as any,
            req
          );
          // Backend returns product directly or wrapped in data
          const product = response.data || response;
          return Response.json(product, { status: 201 });
        } catch (formDataError: any) {
          console.error("[Products] POST error:", formDataError);
          return Response.json(
            { error: formDataError.message || "Failed to create product" },
            { status: 400 }
          );
        }
      }
      throw error;
    }
  } catch (error: any) {
    console.error("[Products] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
