import path from "path"
import { promises as fs } from "fs"

import type { Newsletter, NewsletterHero } from "./api-types"

const DATA_DIR = path.join(process.cwd(), "data")
const NEWSLETTERS_FILE = path.join(DATA_DIR, "newsletters.json")
const HERO_FILE = path.join(DATA_DIR, "newsletter-hero.json")

const slugify = (value: string) =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || ""

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

function normalizeNewsletter(item: Newsletter): Newsletter {
  if (item.slug && item.slug.trim()) {
    return item
  }
  return {
    ...item,
    slug: slugify(item.title || item.id || "newsletter"),
  }
}

export async function listNewsletters(): Promise<Newsletter[]> {
  const items = await readJsonFile<Newsletter[]>(NEWSLETTERS_FILE, [])
  return items.map(normalizeNewsletter)
}

export async function saveNewsletters(items: Newsletter[]): Promise<void> {
  await writeJsonFile(NEWSLETTERS_FILE, items.map(normalizeNewsletter))
}

export async function getNewsletterById(id: string): Promise<Newsletter | undefined> {
  const items = await listNewsletters()
  return items.find((item) => item.id === id)
}

export async function getNewsletterHero(): Promise<NewsletterHero | null> {
  return readJsonFile<NewsletterHero | null>(HERO_FILE, null)
}

export async function saveNewsletterHero(hero: NewsletterHero): Promise<NewsletterHero> {
  await writeJsonFile(HERO_FILE, hero)
  return hero
}

export function slugifyNewsletter(value: string) {
  return slugify(value)
}

