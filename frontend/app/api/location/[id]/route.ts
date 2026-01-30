import { NextResponse } from "next/server";
import { updateLocation, deleteLocation } from "@/lib/location-store";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const data = await req.json();

    const updates: any = {};
    if (data.name !== undefined) updates.name = data.name.trim();
    if (data.host !== undefined) updates.host = data.host.trim();
    if (data.city !== undefined) updates.city = data.city.trim();
    if (data.country !== undefined) updates.country = data.country.trim();
    if (data.latitude !== undefined) {
      const lat = Number(data.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return NextResponse.json(
          { error: "Invalid latitude" },
          { status: 400 }
        );
      }
      updates.latitude = lat;
    }
    if (data.longitude !== undefined) {
      const lng = Number(data.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return NextResponse.json(
          { error: "Invalid longitude" },
          { status: 400 }
        );
      }
      updates.longitude = lng;
    }
    if (data.mapLink !== undefined)
      updates.mapLink = data.mapLink?.trim() || undefined;

    const updated = await updateLocation(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    console.log("Updated location:", updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const deleted = await deleteLocation(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    console.log("Deleted location:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting location:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
