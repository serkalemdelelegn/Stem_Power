import { NextRequest, NextResponse } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Transform backend impact data to frontend format
function transformImpactData(impact: any) {
  // The frontend expects an array of stat objects
  // We'll create a default structure if backend data is available
  return [
    {
      icon: "Building",
      title: "STEM Centers",
      value: impact?.stem_centers || 0,
      displayValue: impact?.stem_centers ? `${impact.stem_centers}+` : "0+",
      description: "Active hands-on STEM learning centers across Ethiopia",
      progress: 75,
      trend: "+8 this year",
      location: "Nationwide Coverage",
    },
    {
      icon: "Users",
      title: "Program Participation",
      value: impact?.program_participation || 0,
      displayValue: impact?.program_participation
        ? impact.program_participation >= 1000
          ? `${Math.floor(impact.program_participation / 1000)}K+`
          : `${impact.program_participation}+`
        : "0+",
      description: "Students and participants in our comprehensive programs",
      progress: 88,
      trend: "+25K this year",
      location: "All Regions",
    },
    {
      icon: "Award",
      title: "Events Held",
      value: impact?.events_held || 0,
      displayValue: impact?.events_held ? `${impact.events_held}+` : "0+",
      description: "Science fairs, workshops, and educational events organized",
      progress: 78,
      trend: "+25 this year",
      location: "Multi-Regional",
    },
  ];
}

export async function GET(req: NextRequest) {
  try {
    const impacts = await backendApiServer.get("/api/home/impact", req);

    // Get the first active impact or use default
    const activeImpact = Array.isArray(impacts)
      ? impacts.find((i: any) => i.is_active !== false) || impacts[0]
      : impacts;

    // Transform to frontend format
    const transformedData = activeImpact
      ? transformImpactData(activeImpact)
      : [];

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching impact from backend:", error);
    // Return empty array on error
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const backendData = {
      program_participation: data.program_participation || 0,
      stem_centers: data.stem_centers || 0,
      events_held: data.events_held || 0,
      is_active: data.is_active !== false,
    };

    const newImpact = await backendApiServer.post(
      "/api/home/impact",
      backendData,
      req
    );
    return NextResponse.json(newImpact, { status: 201 });
  } catch (error) {
    console.error("Error creating impact:", error);
    return NextResponse.json(
      { error: "Failed to create impact" },
      { status: 500 }
    );
  }
}
