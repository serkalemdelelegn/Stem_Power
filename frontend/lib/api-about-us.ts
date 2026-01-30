import { backendApi } from "./backend-api";

// ===== Backend Interfaces =====

interface BackendVMV {
  id: string;
  type: "vision" | "mission" | "value" | "hero" | "whoWeAre" | "ecosystem";
  title: string;
  content: string;
  is_active: boolean;
  badge?: string | null;
  description?: string | null;
  image?: string | null;
  statistic?: string | null;
  whoWeAreBadge?: string | null;
  whoWeAreTitle?: string | null;
  whoWeAreDescription?: string | null;
  whoWeAreImage?: string | null;
  values?: string | any[] | null;
  testimonials?: string | any[] | null;
  ecosystem?: string | any[] | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface Value {
  title: string;
  description: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  message?: string;
  quote?: string;
  content?: string;
  image: string;
}

export interface EcosystemStep {
  title: string;
  icon?: string;
  items: string[];
}

export interface AboutUsData {
  hero: {
    badge: string;
    title: string;
    description: string;
    image: string;
    statistic: string;
  };
  whoWeAre: {
    badge: string;
    title: string;
    description: string;
    image: string;
  };
  mission: string;
  vision: string;
  values: Value[];
  testimonials: Testimonial[];
  ecosystem: EcosystemStep[];
}

// ===== Fallback Data =====

const fallbackData: AboutUsData = {
  hero: {
    badge: "About STEMpower Ethiopia",
    title: "Inside Every Child is a Scientist",
    description:
      "Empowering Ethiopia's future through hands-on STEM education. With 61 active STEM Centers across the nation, we're transforming how students learn science, technology, engineering, and mathematics.",
    image: "/ethiopian-students-working-with-science-equipment-.jpg",
    statistic: "61",
  },
  whoWeAre: {
    badge: "Our Story",
    title: "Who We Are",
    description: "",
    image: "",
  },
  mission:
    "To establish and sustain hands-on STEM Centers across Ethiopia that provide accessible, quality science and technology education through practical lab-based learning experiences that inspire innovation and entrepreneurship.",
  vision:
    "A future where every Ethiopian student has access to world-class STEM education, empowering them to become innovators, entrepreneurs, and leaders who drive sustainable development and prosperity for their communities and nation.",
  values: [
    { title: "Excellence", description: "Excellence in education" },
    { title: "Accessibility", description: "Accessibility for all" },
    { title: "Innovation", description: "Innovation and creativity" },
    { title: "Community", description: "Community engagement" },
    { title: "Sustainability", description: "Sustainability" },
  ],
  testimonials: [],
  ecosystem: [],
};

// ===== Helper Functions =====

function parseJSONField<T>(field: string | T[] | null | undefined): T[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch (e) {
      return [];
    }
  }
  return [];
}

// ===== Transform Functions =====

function transformVMVData(backendVMVs: BackendVMV[]): AboutUsData {
  const data: AboutUsData = { ...fallbackData };

  // Find hero data
  const heroVMV = backendVMVs.find((v) => v.type === "hero");
  if (heroVMV) {
    data.hero = {
      badge: heroVMV.badge || fallbackData.hero.badge,
      title: heroVMV.title || fallbackData.hero.title,
      description: heroVMV.description || fallbackData.hero.description,
      image: heroVMV.image || fallbackData.hero.image,
      statistic: heroVMV.statistic || fallbackData.hero.statistic,
    };
  }

  // Find whoWeAre data
  const whoWeAreVMV = backendVMVs.find((v) => v.type === "whoWeAre");
  if (whoWeAreVMV) {
    data.whoWeAre = {
      badge: whoWeAreVMV.whoWeAreBadge || fallbackData.whoWeAre.badge,
      title: whoWeAreVMV.whoWeAreTitle || fallbackData.whoWeAre.title,
      description:
        whoWeAreVMV.whoWeAreDescription || fallbackData.whoWeAre.description,
      image: whoWeAreVMV.whoWeAreImage || fallbackData.whoWeAre.image,
    };
  }

  // Find mission
  const missionVMV = backendVMVs.find((v) => v.type === "mission");
  if (missionVMV) {
    data.mission = missionVMV.content || fallbackData.mission;
  }

  // Find vision
  const visionVMV = backendVMVs.find((v) => v.type === "vision");
  if (visionVMV) {
    data.vision = visionVMV.content || fallbackData.vision;
  }

  // Find values
  const valuesVMV = backendVMVs.find((v) => v.type === "value");
  if (valuesVMV && valuesVMV.values) {
    const parsedValues = parseJSONField<Value>(valuesVMV.values);
    if (parsedValues.length > 0) {
      data.values = parsedValues;
    }
  }

  // Find testimonials
  const testimonialsVMV = backendVMVs.find((v) => v.type === "whoWeAre");
  if (testimonialsVMV && testimonialsVMV.testimonials) {
    const parsedTestimonials = parseJSONField<any>(
      testimonialsVMV.testimonials
    );
    if (parsedTestimonials.length > 0) {
      // Transform testimonials to match expected format
      data.testimonials = parsedTestimonials.map((t: any) => ({
        id: t.id,
        name: t.name || "",
        role: t.role || "",
        message: t.message || t.content || "",
        quote: t.quote || t.content || "",
        image: t.image || "/placeholder.svg",
      }));
    }
  }

  // Find ecosystem
  const ecosystemVMV = backendVMVs.find((v) => v.type === "ecosystem");
  if (ecosystemVMV && ecosystemVMV.ecosystem) {
    const parsedEcosystem = parseJSONField<EcosystemStep>(
      ecosystemVMV.ecosystem
    );
    if (parsedEcosystem.length > 0) {
      data.ecosystem = parsedEcosystem;
    }
  }

  return data;
}

// ===== Fetch Functions =====

/**
 * Fetch all about us data from backend, with fallback to default data
 */
export async function fetchAboutUsData(): Promise<AboutUsData> {
  try {
    const response = await backendApi.get("/api/vmv");
    const backendVMVs: BackendVMV[] = Array.isArray(response) ? response : [];

    if (backendVMVs.length === 0) {
      return fallbackData;
    }

    return transformVMVData(backendVMVs);
  } catch (error) {
    console.error("Error fetching about us data:", error);
    return fallbackData;
  }
}
