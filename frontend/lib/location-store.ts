import path from "path"
import { promises as fs } from "fs"
import type { Location } from "./api-types"

const DATA_DIR = path.join(process.cwd(), "data")
const LOCATIONS_FILE = path.join(DATA_DIR, "locations.json")

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data) as T
  } catch {
    return fallback
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataDir()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function listLocations(): Promise<Location[]> {
  const items = await readJsonFile<Location[]>(LOCATIONS_FILE, [])
  return items
}

export async function saveLocations(items: Location[]): Promise<void> {
  await writeJsonFile(LOCATIONS_FILE, items)
}

export async function getLocationById(id: string): Promise<Location | undefined> {
  const items = await listLocations()
  return items.find((item) => item.id === id)
}

export async function addLocation(location: Omit<Location, "id">): Promise<Location> {
  const items = await listLocations()
  const newLocation: Location = {
    ...location,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  }
  items.push(newLocation)
  await saveLocations(items)
  return newLocation
}

export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
  const items = await listLocations()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null
  
  items[index] = { ...items[index], ...updates }
  await saveLocations(items)
  return items[index]
}

export async function deleteLocation(id: string): Promise<boolean> {
  const items = await listLocations()
  const filtered = items.filter((item) => item.id !== id)
  if (filtered.length === items.length) return false
  
  await saveLocations(filtered)
  return true
}

