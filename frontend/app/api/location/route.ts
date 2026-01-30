import { NextResponse } from "next/server"
import {
  listLocations,
  addLocation,
  type Location,
} from "@/lib/location-store"

export async function GET() {
  try {
    const locations = await listLocations()
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, host, city, country, latitude, longitude, mapLink } = data

    // Validate required fields
    if (!name || !host || !city || !country || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields", details: { name: !name, host: !host, city: !city, country: !country, latitude: latitude === undefined, longitude: longitude === undefined } },
        { status: 400 }
      )
    }

    const lat = Number(latitude)
    const lng = Number(longitude)

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: "Invalid coordinates. Latitude must be between -90 and 90, Longitude must be between -180 and 180" },
        { status: 400 }
      )
    }

    const newLocation = await addLocation({
      name: name.trim(),
      host: host.trim(),
      city: city.trim(),
      country: country.trim(),
      latitude: lat,
      longitude: lng,
      mapLink: mapLink?.trim() || undefined,
    })

    console.log("Created new location:", newLocation)
    return NextResponse.json(newLocation, { status: 201 })
  } catch (error) {
    console.error("Error creating location:", error)
    return NextResponse.json({ error: "Failed to create location" }, { status: 400 })
  }
}
