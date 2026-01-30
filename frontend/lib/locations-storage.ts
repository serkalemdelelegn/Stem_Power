// Shared storage for locations (replace with database in production)
// This allows both /api/locations and /api/locations/[id] to access the same data

export interface Location {
  id: string
  name: string
  host: string
  city: string
  country: string
  latitude?: number
  longitude?: number
  mapLink?: string
}

let locations: Location[] = [
  {
    id: "1",
    name: "Université d'Abomey-Calavi STEM Center",
    host: "Université d'Abomey-Calavi",
    city: "Dangbo",
    country: "Benin",
    mapLink: "https://maps.google.com/maps?q=Dangbo,Benin",
  },
]

export function getLocations(): Location[] {
  return locations
}

export function getLocationById(id: string): Location | undefined {
  return locations.find((loc) => loc.id === id)
}

export function createLocation(location: Omit<Location, "id">): Location {
  const newLocation: Location = {
    id: Date.now().toString(),
    ...location,
  }
  locations.push(newLocation)
  return newLocation
}

export function updateLocation(id: string, location: Partial<Location>): Location | null {
  const index = locations.findIndex((loc) => loc.id === id)
  if (index === -1) return null

  locations[index] = { ...locations[index], ...location }
  return locations[index]
}

export function deleteLocation(id: string): boolean {
  const index = locations.findIndex((loc) => loc.id === id)
  if (index === -1) return false

  locations.splice(index, 1)
  return true
}
