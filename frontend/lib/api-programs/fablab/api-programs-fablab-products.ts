import { backendApi } from "../../backend-api";
import {
  Printer,
  Users,
  Lightbulb,
  Award,
  Factory,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ===== Backend Interfaces =====

interface BackendHero {
  id: string;
  badge: string;
  title: string;
  subtitle: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendStat {
  id: string;
  title: string;
  value: string;
  heroId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendProduct {
  id: string;
  title: string;
  description: string;
  price: number | string;
  image: string | null;
  status: "in stock" | "out of stock" | "coming soon";
  product_overview: string | null;
  whats_included: string | string[] | null;
  heroId?: number;
  createdAt: string;
  updatedAt: string;
  FabLabProductFeatures?: Array<{ feature: string }>;
  FabLabProductApplications?: Array<{ application: string }>;
}

// ===== Frontend Interfaces =====

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: LucideIcon;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  category: string;
  description: string;
  features: string[];
  applications?: string[];
  image: string;
  status: string;
  overview?: string;
  whatsIncluded?: string[];
}

// ===== Icon Mapping =====

const iconNameToComponent: Record<string, LucideIcon> = {
  printer: Printer,
  users: Users,
  lightbulb: Lightbulb,
  award: Award,
  factory: Factory,
  package: Package,
};

// ===== Helper Functions =====

/**
 * Generate slug from product name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Format price to string
 */
function formatPrice(price: number | string): string {
  if (typeof price === "string") return price;
  return `ETB ${price.toFixed(2)}`;
}

// ===== Transform Functions =====

function transformHero(backendHero: BackendHero): HeroContent {
  return {
    badge: backendHero.badge || "",
    title: backendHero.title || "",
    description: backendHero.subtitle || "",
  };
}

function transformStat(backendStat: BackendStat): ImpactStat {
  // Map stat title to icon based on common patterns
  const titleLower = backendStat.title?.toLowerCase() || "";
  let iconName = "factory"; // default

  if (titleLower.includes("printer") || titleLower.includes("3d")) {
    iconName = "printer";
  } else if (titleLower.includes("student") || titleLower.includes("user")) {
    iconName = "users";
  } else if (titleLower.includes("project") || titleLower.includes("built")) {
    iconName = "lightbulb";
  } else if (titleLower.includes("mentor") || titleLower.includes("expert")) {
    iconName = "award";
  }

  const iconComponent = iconNameToComponent[iconName] || Factory;

  return {
    number: backendStat.value,
    label: backendStat.title,
    icon: iconComponent,
  };
}

export function transformProduct(backendProduct: BackendProduct): Product {
  const features =
    backendProduct.FabLabProductFeatures?.map((f) => f.feature) || [];
  const applications =
    backendProduct.FabLabProductApplications?.map((a) => a.application) || [];

  // Parse whats_included if it's a string (comma-separated or JSON)
  let whatsIncluded: string[] = [];
  if (backendProduct.whats_included) {
    if (typeof backendProduct.whats_included === "string") {
      // Try to parse as JSON array first
      try {
        const parsed = JSON.parse(backendProduct.whats_included);
        if (Array.isArray(parsed)) {
          whatsIncluded = parsed;
        } else {
          // If not JSON array, split by comma
          whatsIncluded = backendProduct.whats_included
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } catch {
        // If not JSON, split by comma
        whatsIncluded = backendProduct.whats_included
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } else if (Array.isArray(backendProduct.whats_included)) {
      whatsIncluded = backendProduct.whats_included;
    }
  }

  // Determine category based on product title/description
  // This is a simple heuristic - you may want to add a category field to the backend model
  const titleLower = backendProduct.title?.toLowerCase() || "";
  const descLower = backendProduct.description?.toLowerCase() || "";
  let category = "Science Kits"; // default

  if (
    titleLower.includes("manufacturing") ||
    titleLower.includes("agricultural") ||
    descLower.includes("manufacturing") ||
    descLower.includes("agricultural")
  ) {
    category = "Manufacturing Solution";
  }

  return {
    id: backendProduct.id,
    name: backendProduct.title,
    slug: generateSlug(backendProduct.title),
    price: formatPrice(backendProduct.price),
    category,
    description: backendProduct.description,
    features,
    applications: applications.length > 0 ? applications : undefined,
    image: backendProduct.image || "",
    status: backendProduct.status,
    overview: backendProduct.product_overview || undefined,
    whatsIncluded: whatsIncluded.length > 0 ? whatsIncluded : undefined,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch hero content from backend
 */
export async function fetchHero(): Promise<HeroContent | null> {
  try {
    const response = await backendApi.get("/api/fablab-products/hero");
    const backendHeroes: BackendHero[] = Array.isArray(response)
      ? response
      : [];

    if (backendHeroes.length === 0) {
      return null;
    }

    // Get the most recent hero (first in DESC order)
    return transformHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return null;
  }
}

/**
 * Fetch impact stats from backend
 */
export async function fetchStats(): Promise<ImpactStat[]> {
  try {
    const response = await backendApi.get("/api/fablab-products/stats");
    const backendStats: BackendStat[] = Array.isArray(response) ? response : [];

    if (backendStats.length === 0) {
      return [];
    }

    return backendStats.map(transformStat);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return [];
  }
}

/**
 * Fetch products from backend, with fallback to empty array
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await backendApi.get("/api/fablab-products/products");
    const backendProducts: BackendProduct[] = Array.isArray(response)
      ? response
      : [];

    if (backendProducts.length === 0) {
      return [];
    }

    return backendProducts.map(transformProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch a single product by slug from backend
 */
export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    // Fetch all products and find the one matching the slug
    const products = await fetchProducts();
    const product = products.find((p) => p.slug === slug);
    return product || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// ===== Admin CRUD Functions =====

/**
 * Map frontend availability to backend status
 */
function mapAvailabilityToStatus(
  availability: string
): "in stock" | "out of stock" | "coming soon" {
  const lower = availability.toLowerCase();
  if (lower.includes("out") || lower.includes("stock")) {
    return "out of stock";
  }
  if (
    lower.includes("pre") ||
    lower.includes("coming") ||
    lower.includes("soon")
  ) {
    return "coming soon";
  }
  return "in stock";
}

/**
 * Map backend status to frontend availability
 */
function mapStatusToAvailability(status: string): string {
  if (status === "out of stock") return "Out of Stock";
  if (status === "coming soon") return "Pre-order";
  return "Available";
}

/**
 * Extract numeric price from string (e.g., "Br 9,499.00" -> 9499.00)
 */
function extractPrice(priceString: string): number {
  // Remove currency symbols, spaces, and commas
  const cleaned = priceString.replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Create a product
 */
export async function createProduct(productData: {
  name: string;
  category: "Science Kits" | "Manufacturing Solution";
  subcategory?: string;
  price: string;
  availability: string;
  description: string;
  overview: string;
  keyFeatures: string[];
  whatsIncluded: string[];
  applications: string[];
  image?: string | File | null;
}): Promise<BackendProduct> {
  // Transform frontend format to backend format
  // If category is "Manufacturing Solution" but title/description don't have keywords, add them
  let title = productData.name;
  let description = productData.description || "";

  if (productData.category === "Manufacturing Solution") {
    const titleLower = (title || "").toLowerCase();
    const descLower = description.toLowerCase();
    const hasManufacturingKeyword =
      titleLower.includes("manufacturing") ||
      titleLower.includes("agricultural") ||
      descLower.includes("manufacturing") ||
      descLower.includes("agricultural");

    // If no keyword found, prepend to description to ensure proper categorization
    if (!hasManufacturingKeyword) {
      if (description) {
        description = `Agricultural & Manufacturing Solution: ${description}`;
      } else {
        description = "Agricultural & Manufacturing Solution";
      }
    }
  }

  const backendData: any = {
    title: title,
    description: description,
    price: extractPrice(productData.price),
    status: mapAvailabilityToStatus(productData.availability),
    product_overview: productData.overview || null,
    whatsIncluded:
      productData.whatsIncluded.length > 0 ? productData.whatsIncluded : null,
    keyFeatures: productData.keyFeatures,
    applications: productData.applications,
  };

  // If image is a File, upload using FormData
  if (productData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", productData.image);
    formData.append("title", backendData.title);
    formData.append("description", backendData.description);
    formData.append("price", backendData.price.toString());
    formData.append("status", backendData.status);
    if (backendData.product_overview)
      formData.append("product_overview", backendData.product_overview);
    if (backendData.whatsIncluded) {
      formData.append(
        "whatsIncluded",
        JSON.stringify(backendData.whatsIncluded)
      );
    }
    if (backendData.keyFeatures && backendData.keyFeatures.length > 0) {
      backendData.keyFeatures.forEach((feature: string) => {
        formData.append("keyFeatures[]", feature);
      });
    }
    if (backendData.applications && backendData.applications.length > 0) {
      backendData.applications.forEach((app: string) => {
        formData.append("applications[]", app);
      });
    }

    const response = await backendApi.postFormData(
      "/api/fablab-products/products",
      formData
    );
    return response; // backendApi.postFormData returns the JSON directly
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {
    title: backendData.title,
    description: backendData.description,
    price: backendData.price,
    status: backendData.status,
    product_overview: backendData.product_overview,
    whatsIncluded: backendData.whatsIncluded,
    keyFeatures: backendData.keyFeatures,
    applications: backendData.applications,
  };
  if (productData.image !== undefined) {
    jsonData.image = productData.image;
  }

  const response = await backendApi.post(
    "/api/fablab-products/products",
    jsonData
  );
  return response; // backendApi.post returns the JSON directly
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  productData: Partial<{
    name?: string;
    category?: "Science Kits" | "Manufacturing Solution";
    subcategory?: string;
    price?: string;
    availability?: string;
    description?: string;
    overview?: string;
    keyFeatures?: string[];
    whatsIncluded?: string[];
    applications?: string[];
    image?: string | File | null;
  }>
): Promise<BackendProduct> {
  // Transform frontend format to backend format
  const backendData: any = {};

  if (productData.name !== undefined) backendData.title = productData.name;
  if (productData.description !== undefined) {
    let description = productData.description || "";
    // If category is "Manufacturing Solution" but title/description don't have keywords, add them
    if (productData.category === "Manufacturing Solution") {
      const titleLower = (productData.name || "").toLowerCase();
      const descLower = description.toLowerCase();
      const hasManufacturingKeyword =
        titleLower.includes("manufacturing") ||
        titleLower.includes("agricultural") ||
        descLower.includes("manufacturing") ||
        descLower.includes("agricultural");

      // If no keyword found, prepend to description to ensure proper categorization
      if (!hasManufacturingKeyword) {
        if (description) {
          description = `Agricultural & Manufacturing Solution: ${description}`;
        } else {
          description = "Agricultural & Manufacturing Solution";
        }
      }
    }
    backendData.description = description;
  }
  if (productData.price !== undefined)
    backendData.price = extractPrice(productData.price);
  if (productData.availability !== undefined)
    backendData.status = mapAvailabilityToStatus(productData.availability);
  if (productData.overview !== undefined)
    backendData.product_overview = productData.overview || null;
  if (productData.whatsIncluded !== undefined) {
    backendData.whatsIncluded =
      productData.whatsIncluded.length > 0 ? productData.whatsIncluded : null;
  }
  if (productData.keyFeatures !== undefined)
    backendData.keyFeatures = productData.keyFeatures;
  if (productData.applications !== undefined)
    backendData.applications = productData.applications;

  // If image is a File, upload using FormData
  if (productData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", productData.image);
    if (backendData.title) formData.append("title", backendData.title);
    if (backendData.description)
      formData.append("description", backendData.description);
    if (backendData.price !== undefined)
      formData.append("price", backendData.price.toString());
    if (backendData.status) formData.append("status", backendData.status);
    if (backendData.product_overview !== undefined) {
      formData.append("product_overview", backendData.product_overview || "");
    }
    if (backendData.whatsIncluded !== undefined) {
      formData.append(
        "whatsIncluded",
        backendData.whatsIncluded
          ? JSON.stringify(backendData.whatsIncluded)
          : ""
      );
    }
    if (
      backendData.keyFeatures !== undefined &&
      backendData.keyFeatures.length > 0
    ) {
      backendData.keyFeatures.forEach((feature: string) => {
        formData.append("keyFeatures[]", feature);
      });
    }
    if (
      backendData.applications !== undefined &&
      backendData.applications.length > 0
    ) {
      backendData.applications.forEach((app: string) => {
        formData.append("applications[]", app);
      });
    }

    const response = await backendApi.putFormData(
      `/api/fablab-products/products/${id}`,
      formData
    );
    return response.data;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {};
  if (backendData.title) jsonData.title = backendData.title;
  if (backendData.description !== undefined)
    jsonData.description = backendData.description;
  if (backendData.price !== undefined) jsonData.price = backendData.price;
  if (backendData.status) jsonData.status = backendData.status;
  if (backendData.product_overview !== undefined)
    jsonData.product_overview = backendData.product_overview;
  if (backendData.whatsIncluded !== undefined)
    jsonData.whatsIncluded = backendData.whatsIncluded;
  if (backendData.keyFeatures !== undefined)
    jsonData.keyFeatures = backendData.keyFeatures;
  if (backendData.applications !== undefined)
    jsonData.applications = backendData.applications;
  if (productData.image !== undefined) jsonData.image = productData.image;

  const response = await backendApi.put(
    `/api/fablab-products/products/${id}`,
    jsonData
  );
  return response; // backendApi.put returns the JSON directly
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  await backendApi.delete(`/api/fablab-products/products/${id}`);
}
