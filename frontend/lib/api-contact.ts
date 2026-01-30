import { backendApi } from "./backend-api";

// ===== Frontend Interfaces =====

export interface ContactInfo {
  address: string;
  addressDetails: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  officeHours: string;
  mapLink: string;
  image: string;
}

export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

// ===== Backend Interfaces =====

interface BackendContactOffice {
  id: number;
  country_office: string;
  office_name: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  latitude: number | null;
  longtiude: number | null;
  map_link: string | null;
  website: string | null;
  office_hours: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendSocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Transform Functions =====

export function transformBackendContactToFrontend(
  backendOffice: BackendContactOffice | null
): ContactInfo {
  if (!backendOffice) {
    return {
      address: "",
      addressDetails: "",
      phone: "",
      mobile: "",
      email: "",
      website: "",
      officeHours: "",
      mapLink: "",
      image: "",
    };
  }

  // Map backend fields to frontend format
  // Combine address fields if needed
  const address = backendOffice.address || "";
  const addressDetails =
    backendOffice.city && backendOffice.region
      ? `${backendOffice.city}, ${backendOffice.region}`
      : backendOffice.city || backendOffice.region || "";

  return {
    address: address,
    addressDetails: addressDetails,
    phone: backendOffice.phone || "",
    mobile: backendOffice.mobile || "",
    email: backendOffice.email || "",
    website: backendOffice.website || "",
    officeHours: backendOffice.office_hours || "",
    mapLink: backendOffice.map_link || 
      (backendOffice.latitude && backendOffice.longtiude
        ? `https://www.google.com/maps?q=${backendOffice.latitude},${backendOffice.longtiude}`
        : ""),
    image: backendOffice.image || "",
  };
}

export function transformFrontendContactToBackend(
  frontendData: ContactInfo
): Partial<BackendContactOffice> {
  // Parse addressDetails to extract city and region
  const addressParts = frontendData.addressDetails
    .split(",")
    .map((s) => s.trim());
  const city = addressParts[0] || null;
  const region = addressParts[1] || null;

  // Parse mapLink to extract coordinates if it's a Google Maps link
  let latitude: number | null = null;
  let longtiude: number | null = null;
  if (frontendData.mapLink) {
    try {
      const url = new URL(frontendData.mapLink);
      const q = url.searchParams.get("q");
      if (q) {
        const coords = q.split(",");
        if (coords.length === 2) {
          latitude = parseFloat(coords[0]);
          longtiude = parseFloat(coords[1]);
        }
      }
    } catch {
      // If parsing fails, leave as null
    }
  }

  return {
    country_office: "Ethiopia", // Default
    office_name: null,
    address: frontendData.address || null,
    city: city,
    region: region,
    postal_code: null,
    email: frontendData.email || null,
    phone: frontendData.phone || null,
    mobile: frontendData.mobile || null,
    latitude: latitude,
    longtiude: longtiude,
    map_link: frontendData.mapLink || null,
    website: frontendData.website || null,
    office_hours: frontendData.officeHours || null,
    image: frontendData.image || null,
  };
}

function transformBackendSocialLinkToFrontend(
  backendLink: BackendSocialLink
): SocialMediaLink {
  return {
    id: String(backendLink.id),
    platform: backendLink.platform,
    url: backendLink.url,
  };
}

function transformFrontendSocialLinkToBackend(frontendLink: SocialMediaLink): {
  platform: string;
  url: string;
  icon: string;
} {
  // Map platform to icon (use platform name as icon for now, or map to specific icons)
  const platformIcons: Record<string, string> = {
    facebook: "f",
    twitter: "𝕏",
    linkedin: "in",
    instagram: "📷",
    youtube: "▶",
    tiktok: "♪",
    whatsapp: "💬",
    telegram: "✈",
    github: "⚙",
    pinterest: "P",
  };

  return {
    platform: frontendLink.platform,
    url: frontendLink.url,
    icon: platformIcons[frontendLink.platform] || frontendLink.platform,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch contact information from backend
 */
export async function fetchContactInfo(): Promise<ContactInfo> {
  try {
    const response = await backendApi.get("/api/contact-office");
    const offices: BackendContactOffice[] = Array.isArray(response)
      ? response
      : [];

    // Get the first office or return default
    const office = offices.length > 0 ? offices[0] : null;
    return transformBackendContactToFrontend(office);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return transformBackendContactToFrontend(null);
  }
}

/**
 * Update contact information
 */
export async function updateContactInfo(
  contactData: ContactInfo & { image?: string | File | null }
): Promise<ContactInfo> {
  const backendData = transformFrontendContactToBackend(contactData);

  // Get existing offices to update the first one, or create new
  const existingOffices = await backendApi.get("/api/contact-office");
  const officesArray = Array.isArray(existingOffices) ? existingOffices : [];

  // If image is a File, upload using FormData
  if (contactData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", contactData.image);
    
    // Append all other fields - ensure all required fields are included
    Object.keys(backendData).forEach((key) => {
      const value = backendData[key as keyof typeof backendData];
      if (value !== null && value !== undefined) {
        if (typeof value === "object" && !Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    // Ensure country_office is always included (required field)
    if (!backendData.country_office) {
      formData.append("country_office", "Ethiopia");
    }
    
    console.log("[updateContactInfo] Sending FormData with fields:", Array.from(formData.keys()));

    if (officesArray.length > 0) {
      // Update first office
      const office = officesArray[0];
      const response = await backendApi.putFormData(
        `/api/contact-office/${office.id}`,
        formData
      );
      return transformBackendContactToFrontend(response);
    } else {
      // Create new office - POST doesn't support FormData in this route, so convert to JSON
      // For creation, we'll send image URL after upload or handle separately
      const response = await backendApi.post("/api/contact-office", backendData);
      return transformBackendContactToFrontend(response);
    }
  }

  // Otherwise, send as JSON
  if (officesArray.length > 0) {
    // Update first office
    const office = officesArray[0];
    const response = await backendApi.put(
      `/api/contact-office/${office.id}`,
      backendData
    );
    return transformBackendContactToFrontend(response);
  } else {
    // Create new office
    const response = await backendApi.post("/api/contact-office", backendData);
    return transformBackendContactToFrontend(response);
  }
}

/**
 * Fetch all social media links
 */
export async function fetchSocialLinks(): Promise<SocialMediaLink[]> {
  try {
    const response = await backendApi.get("/api/social-links");
    const links: BackendSocialLink[] = Array.isArray(response) ? response : [];
    return links.map(transformBackendSocialLinkToFrontend);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
}

/**
 * Create a social media link
 */
export async function createSocialLink(
  link: Omit<SocialMediaLink, "id">
): Promise<SocialMediaLink> {
  const backendData = transformFrontendSocialLinkToBackend(
    link as SocialMediaLink
  );
  const response = await backendApi.post("/api/social-links", backendData);
  return transformBackendSocialLinkToFrontend(response);
}

/**
 * Update a social media link
 */
export async function updateSocialLink(
  id: string,
  link: Partial<Omit<SocialMediaLink, "id">>
): Promise<SocialMediaLink> {
  const updateData: any = {};
  if (link.platform !== undefined) updateData.platform = link.platform;
  if (link.url !== undefined) updateData.url = link.url;

  // If platform changed, update icon too
  if (link.platform !== undefined) {
    const platformIcons: Record<string, string> = {
      facebook: "f",
      twitter: "𝕏",
      linkedin: "in",
      instagram: "📷",
      youtube: "▶",
      tiktok: "♪",
      whatsapp: "💬",
      telegram: "✈",
      github: "⚙",
      pinterest: "P",
    };
    updateData.icon = platformIcons[link.platform] || link.platform;
  }

  const response = await backendApi.put(`/api/social-links/${id}`, updateData);
  return transformBackendSocialLinkToFrontend(response);
}

/**
 * Delete a social media link
 */
export async function deleteSocialLink(id: string): Promise<void> {
  await backendApi.delete(`/api/social-links/${id}`);
}
