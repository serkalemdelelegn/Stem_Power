import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/fablab-services/machineries",
      req
    );
    const backendServices = Array.isArray(response) ? response : [];

    // Transform backend services to frontend machinery format
    const machineries = backendServices.map((service: any) =>
      transformBackendServiceToFrontend(service)
    );

    return Response.json(machineries);
  } catch (error: any) {
    console.error("[Services Machineries] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const incoming = await request.json();
    if (!Array.isArray(incoming)) {
      return Response.json(
        { error: "Expected an array of machineries" },
        { status: 400 }
      );
    }

    // Get existing machineries from backend to identify which ones to delete
    const existingMachineries = await backendApiServer.get(
      "/api/fablab-services/machineries",
      request
    );
    const existingMachineriesArray = Array.isArray(existingMachineries)
      ? existingMachineries
      : [];
    const incomingIds = incoming
      .map((m: any) => m.id)
      .filter(
        (id: any) =>
          id && !String(id).startsWith("temp-") && !String(id).match(/^\d{13}$/)
      );

    // Delete machineries that are not in the incoming array
    const machineriesToDelete = existingMachineriesArray.filter(
      (existing: any) => !incomingIds.includes(String(existing.id))
    );

    // Delete removed machineries
    await Promise.all(
      machineriesToDelete.map((machinery: any) =>
        backendApiServer
          .delete(`/api/fablab-services/services/${machinery.id}`, request)
          .catch((err) => {
            console.error(`Failed to delete machinery ${machinery.id}:`, err);
          })
      )
    );

    // Update or create machineries individually
    const results = await Promise.all(
      incoming.map(async (machinery: any) => {
        // Transform frontend format to backend format
        const backendData: any = {
          title: machinery.title || machinery.name || "",
          description: machinery.description || "",
          icon: machinery.icon || null,
          capabilities: Array.isArray(machinery.keyFeatures)
            ? machinery.keyFeatures
            : machinery.capabilities || [],
          applications: Array.isArray(machinery.commonApplications)
            ? machinery.commonApplications
            : machinery.applications || [],
          specs: {
            ...(machinery.precision && { precision: machinery.precision }),
            ...(machinery.power && { power: machinery.power }),
            ...(machinery.area && { area: machinery.area }),
            ...(machinery.specs || {}),
          },
        };

        // Check if image is a base64 string (from FileReader) or a File object
        const isBase64Image =
          typeof machinery.image === "string" &&
          (machinery.image.startsWith("data:image/") ||
            machinery.image.startsWith("blob:"));

        // Determine if this is an existing machinery (has a real backend ID)
        // Real backend IDs are usually UUIDs or numeric strings that exist in the backend
        // New machineries have Date.now() IDs which are 13-digit numbers
        const isNewMachinery =
          !machinery.id ||
          String(machinery.id).startsWith("temp-") ||
          String(machinery.id).match(/^\d{13}$/);

        if (!isNewMachinery) {
          // Try to update existing machinery
          try {
            // If image is base64, we need to convert it to a File or send as URL
            // For now, if it's base64, we'll send it as-is in JSON (backend should handle it)
            // But ideally, we should convert base64 to File and use FormData
            if (isBase64Image) {
              // Convert base64 to File
              const response = await fetch(machinery.image);
              const blob = await response.blob();
              const file = new File([blob], "image.jpg", { type: blob.type });

              const formData = new FormData();
              formData.append("file", file);
              formData.append("title", backendData.title);
              formData.append("description", backendData.description);
              if (backendData.icon) formData.append("icon", backendData.icon);
              formData.append(
                "capabilities",
                JSON.stringify(backendData.capabilities)
              );
              formData.append(
                "applications",
                JSON.stringify(backendData.applications)
              );
              formData.append("specs", JSON.stringify(backendData.specs));

              const response2 = await backendApiServer.putFormData(
                `/api/fablab-services/services/${machinery.id}`,
                formData as any,
                request
              );
              return transformBackendServiceToFrontend(response2);
            } else {
              // Image is a URL string or null
              const response = await backendApiServer.put(
                `/api/fablab-services/services/${machinery.id}`,
                {
                  ...backendData,
                  image: machinery.image || null,
                },
                request
              );
              return transformBackendServiceToFrontend(response);
            }
          } catch (error) {
            // If update fails (machinery doesn't exist), create new one
            if (isBase64Image) {
              const response = await fetch(machinery.image);
              const blob = await response.blob();
              const file = new File([blob], "image.jpg", { type: blob.type });

              const formData = new FormData();
              formData.append("file", file);
              formData.append("title", backendData.title);
              formData.append("description", backendData.description);
              if (backendData.icon) formData.append("icon", backendData.icon);
              formData.append(
                "capabilities",
                JSON.stringify(backendData.capabilities)
              );
              formData.append(
                "applications",
                JSON.stringify(backendData.applications)
              );
              formData.append("specs", JSON.stringify(backendData.specs));

              const response2 = await backendApiServer.postFormData(
                "/api/fablab-services/services",
                formData as any,
                request
              );
              return transformBackendServiceToFrontend(response2);
            } else {
              const response = await backendApiServer.post(
                "/api/fablab-services/services",
                {
                  ...backendData,
                  image: machinery.image || null,
                },
                request
              );
              return transformBackendServiceToFrontend(response);
            }
          }
        } else {
          // Create new machinery
          if (isBase64Image) {
            // Convert base64 to File
            const response = await fetch(machinery.image);
            const blob = await response.blob();
            const file = new File([blob], "image.jpg", { type: blob.type });

            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", backendData.title);
            formData.append("description", backendData.description);
            if (backendData.icon) formData.append("icon", backendData.icon);
            formData.append(
              "capabilities",
              JSON.stringify(backendData.capabilities)
            );
            formData.append(
              "applications",
              JSON.stringify(backendData.applications)
            );
            formData.append("specs", JSON.stringify(backendData.specs));

            const response2 = await backendApiServer.postFormData(
              "/api/fablab-services/services",
              formData as any,
              request
            );
            return transformBackendServiceToFrontend(response2);
          } else {
            const response = await backendApiServer.post(
              "/api/fablab-services/services",
              {
                ...backendData,
                image: machinery.image || null,
              },
              request
            );
            return transformBackendServiceToFrontend(response);
          }
        }
      })
    );

    return Response.json(results);
  } catch (error: any) {
    console.error("[Services Machineries] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update machineries" },
      { status: 400 }
    );
  }
}

// Helper function to transform backend service to frontend machinery format
function transformBackendServiceToFrontend(backendService: any) {
  // Safety check: if backendService is null/undefined, return empty machinery
  if (!backendService || typeof backendService !== "object") {
    return {
      id: "",
      title: "",
      description: "",
      keyFeatures: [],
      commonApplications: [],
      precision: "",
      power: "",
      area: "",
      image: "",
    };
  }

  // Safely extract capabilities
  let capabilities: string[] = [];
  if (Array.isArray(backendService.capabilities)) {
    capabilities = backendService.capabilities;
  } else if (
    backendService.FabLabServiceFeatures &&
    Array.isArray(backendService.FabLabServiceFeatures)
  ) {
    capabilities = backendService.FabLabServiceFeatures.map(
      (f: any) => f.feature || ""
    ).filter(Boolean);
  }

  // Safely extract applications
  let applications: string[] = [];
  if (Array.isArray(backendService.applications)) {
    applications = backendService.applications;
  } else if (
    backendService.FabLabServiceApplications &&
    Array.isArray(backendService.FabLabServiceApplications)
  ) {
    applications = backendService.FabLabServiceApplications.map(
      (a: any) => a.application || ""
    ).filter(Boolean);
  }

  // Safely extract specs
  const specs =
    typeof backendService.specs === "object" &&
    backendService.specs &&
    !Array.isArray(backendService.specs)
      ? backendService.specs
      : {};

  return {
    id: String(backendService.id || ""),
    title: backendService.title || "",
    description: backendService.description || "",
    keyFeatures: Array.isArray(capabilities) ? capabilities : [],
    commonApplications: Array.isArray(applications) ? applications : [],
    precision: specs.precision || "",
    power: specs.power || "",
    area: specs.area || "",
    image: backendService.image || "",
  };
}
