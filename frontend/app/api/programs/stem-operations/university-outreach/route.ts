import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend university to frontend format
function transformBackendUniversityToFrontend(backendUniversity: any) {
  if (!backendUniversity || typeof backendUniversity !== "object") {
    return null;
  }

  return {
    id: String(backendUniversity.id || ""),
    name: backendUniversity.name || "",
    location: backendUniversity.location || "",
    description:
      backendUniversity.description ||
      backendUniversity.university_details ||
      "",
    studentsServed: backendUniversity.studentsServed || "",
    programStartYear: backendUniversity.programStartYear || null,
    facilities: Array.isArray(backendUniversity.facilities)
      ? backendUniversity.facilities
      : backendUniversity.key_facilities
      ? JSON.parse(backendUniversity.key_facilities)
      : [],
    achievements: Array.isArray(backendUniversity.achievements)
      ? backendUniversity.achievements
      : backendUniversity.notable_achievements
      ? JSON.parse(backendUniversity.notable_achievements)
      : [],
    image:
      backendUniversity.image || backendUniversity.university_image || null,
    established: backendUniversity.established || null,
  };
}

// Helper function to transform frontend university to backend format
function transformFrontendUniversityToBackend(frontendUniversity: any) {
  // Helper to safely parse JSON strings
  const parseArray = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Helper to parse integer from various formats
  const parseYear = (value: any): number | null => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace("Since ", "").replace("Est. ", "").trim();
      const parsed = parseInt(cleaned, 10);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  };

  return {
    name: frontendUniversity.name || "",
    location: frontendUniversity.location || "",
    description: frontendUniversity.description || "",
    studentsServed:
      frontendUniversity.students || frontendUniversity.studentsServed || "",
    programStartYear:
      parseYear(frontendUniversity.programStartYear) ??
      parseYear(frontendUniversity.programs),
    facilities:
      parseArray(frontendUniversity.keyFacilities) ||
      parseArray(frontendUniversity.facilities),
    achievements:
      parseArray(frontendUniversity.notableAchievements) ||
      parseArray(frontendUniversity.achievements),
    established:
      parseYear(frontendUniversity.established) ??
      parseYear(frontendUniversity.establishmentYear),
    image: frontendUniversity.image || null,
  };
}

export async function GET(req: NextRequest) {
  try {
    // Fetch universities
    const universities = await backendApiServer.get(
      "/api/university-outreach/universities",
      req
    );
    const universitiesArray = Array.isArray(universities) ? universities : [];

    // Fetch hero data (outreach)
    let hero = null;
    try {
      const outreachData = await backendApiServer.get(
        "/api/university-outreach",
        req
      );
      const outreachArray = Array.isArray(outreachData) ? outreachData : [];
      hero = outreachArray.length > 0 ? outreachArray[0] : null;
    } catch (error) {
      console.error("Error fetching hero data:", error);
    }

    // Fetch stats
    let stats = [];
    try {
      const statsData = await backendApiServer.get(
        "/api/university-outreach/impact-stats",
        req
      );
      stats = Array.isArray(statsData) ? statsData : [];
    } catch (error) {
      console.error("Error fetching stats:", error);
    }

    // Transform universities
    const transformedUniversities = universitiesArray
      .map(transformBackendUniversityToFrontend)
      .filter((u): u is NonNullable<typeof u> => u !== null);

    return Response.json({
      universities: transformedUniversities,
      hero: hero,
      stats: stats,
    });
  } catch (error: any) {
    console.error("[University Outreach] GET error:", error);
    return Response.json(
      {
        universities: [],
        hero: null,
        stats: [],
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Extract data from FormData
      const universityData: any = {};
      for (const [key, value] of formData.entries()) {
        if (key === "file") {
          // File will be handled by backend middleware
          continue;
        }
        // Try to parse JSON strings, otherwise use as-is
        try {
          const parsed = JSON.parse(value as string);
          universityData[key] = parsed;
        } catch {
          universityData[key] = value;
        }
      }

      // Transform to backend format
      const backendData = transformFrontendUniversityToBackend(universityData);

      // Create FormData for backend
      const backendFormData = new FormData();
      const file = formData.get("file") as File | null;
      if (file) {
        backendFormData.append("file", file);
      }

      // Add other fields
      Object.keys(backendData).forEach((key) => {
        const value = (backendData as Record<string, any>)[key];
        if (key !== "image" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            backendFormData.append(key, JSON.stringify(value));
          } else {
            backendFormData.append(key, String(value));
          }
        }
      });

      const response = await backendApiServer.postFormData(
        "/api/programs/stem-operations/university-outreach/universities",
        backendFormData as any,
        req
      );
      const transformed = transformBackendUniversityToFrontend(response);
      if (!transformed) {
        return Response.json(
          { error: "Failed to transform university" },
          { status: 500 }
        );
      }
      return Response.json(transformed, { status: 201 });
    }

    // Otherwise, handle as JSON
    const data = await req.json();

    // Transform frontend format to backend format
    const backendData = transformFrontendUniversityToBackend(data);

    const response = await backendApiServer.post(
      "/api/programs/stem-operations/university-outreach/universities",
      backendData,
      req
    );
    const transformed = transformBackendUniversityToFrontend(response);
    if (!transformed) {
      return Response.json(
        { error: "Failed to transform university" },
        { status: 500 }
      );
    }
    return Response.json(transformed, { status: 201 });
  } catch (error: any) {
    console.error("[University Outreach] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create university" },
      { status: 400 }
    );
  }
}
