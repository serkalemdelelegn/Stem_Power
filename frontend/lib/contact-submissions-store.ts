import path from "path"
import { promises as fs } from "fs"

export interface ContactSubmission {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  organization?: string
  subject: string
  message: string
  createdAt: string
  read?: boolean
}

const DATA_DIR = path.join(process.cwd(), "data")
const SUBMISSIONS_FILE = path.join(DATA_DIR, "contact-submissions.json")

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

export async function listSubmissions(): Promise<ContactSubmission[]> {
  const items = await readJsonFile<ContactSubmission[]>(SUBMISSIONS_FILE, [])
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function saveSubmissions(items: ContactSubmission[]): Promise<void> {
  await writeJsonFile(SUBMISSIONS_FILE, items)
}

export async function getSubmissionById(id: string): Promise<ContactSubmission | undefined> {
  const items = await listSubmissions()
  return items.find((item) => item.id === id)
}

export async function addSubmission(submission: Omit<ContactSubmission, "id" | "createdAt">): Promise<ContactSubmission> {
  const items = await listSubmissions()
  const newSubmission: ContactSubmission = {
    ...submission,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    read: false,
  }
  items.push(newSubmission)
  await saveSubmissions(items)
  return newSubmission
}

export async function updateSubmission(id: string, updates: Partial<ContactSubmission>): Promise<ContactSubmission | null> {
  const items = await listSubmissions()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null
  
  items[index] = { ...items[index], ...updates }
  await saveSubmissions(items)
  return items[index]
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const items = await listSubmissions()
  const filtered = items.filter((item) => item.id !== id)
  if (filtered.length === items.length) return false
  
  await saveSubmissions(filtered)
  return true
}

