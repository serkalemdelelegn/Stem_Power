import { backendApi } from "./backend-api";

// Backend Member structure
interface BackendMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  type: "board" | "staff";
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend Member structure
export interface Member {
  name: string;
  role: string;
  bio: string;
  image: string;
}

// Frontend Members Data structure (matching page expectations)
export interface MembersData {
  staffHero?: {
    badge: string;
    title: string;
    subtitle: string;
    statistics: Array<{
      id: string;
      label: string;
      value: string;
      icon?: string;
    }>;
  };
  boardMembers?: {
    ethiopia: Member[];
    stempower?: Member[];
    africa?: Member[];
  };
  staffMembers?: Member[];
}

// Transform backend member to frontend format
function transformMember(backendMember: BackendMember): Member {
  return {
    name: backendMember.name,
    role: backendMember.role,
    bio: backendMember.bio || "",
    image: backendMember.photo_url || "/placeholder.svg",
  };
}

// Transform backend members array to frontend format
function transformMembersData(backendMembers: BackendMember[]): MembersData {
  // Filter out inactive members
  const activeMembers = backendMembers.filter(
    (member) => member.is_active !== false
  );

  // Separate board and staff members
  const boardMembers = activeMembers.filter(
    (member) => member.type === "board"
  );
  const staffMembers = activeMembers.filter(
    (member) => member.type === "staff"
  );

  // Transform to frontend format
  const transformedBoardMembers = boardMembers.map(transformMember);
  const transformedStaffMembers = staffMembers.map(transformMember);

  return {
    boardMembers: {
      ethiopia: transformedBoardMembers,
      // Note: Backend doesn't distinguish between ethiopia/stempower/africa
      // All board members go to ethiopia, or you can split them if needed
    },
    staffMembers: transformedStaffMembers,
  };
}

// Fetch members from backend via Next.js API routes
export async function fetchMembers(): Promise<MembersData | null> {
  try {
    // Fetch members via Next.js API route
    let backendMembers: BackendMember[] = [];
    try {
      const membersResponse = await fetch("/api/about/members");
      if (membersResponse.ok) {
        const data = await membersResponse.json();
        backendMembers = Array.isArray(data) ? data : [];
      } else {
        console.error("Failed to fetch members:", membersResponse.status);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }

    // Fetch staff hero via Next.js API route
    let staffHero = null;
    try {
      const heroResponse = await fetch("/api/about/staff-hero");
      if (heroResponse.ok) {
        const heroData = await heroResponse.json();
        if (heroData && heroData.id) {
          staffHero = heroData;
        }
      } else {
        console.error("Failed to fetch staff hero:", heroResponse.status);
      }
    } catch (error) {
      console.error("Error fetching staff hero:", error);
    }

    // Fetch staff hero statistics via Next.js API route
    let statistics: Array<{
      id: string;
      label: string;
      value: string;
      icon?: string;
    }> = [];
    if (staffHero && staffHero.id) {
      try {
        // Fetch stats filtered by staff_hero_id
        const statsResponse = await fetch(
          `/api/about/staff-hero/stats?staff_hero_id=${staffHero.id}`
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (Array.isArray(statsData) && statsData.length > 0) {
            statistics = statsData.map((s: any) => ({
              id: String(s.id),
              label: s.label || "",
              value: s.value || "",
              icon: s.icon || "users",
            }));
          }
        } else {
          console.error("Failed to fetch stats:", statsResponse.status);
        }
      } catch (error) {
        console.error("Error fetching staff hero stats:", error);
      }
    }

    // Transform to frontend format
    const transformedData = transformMembersData(backendMembers);

    // Add staff hero data if available
    if (staffHero) {
      transformedData.staffHero = {
        badge: staffHero.badge || "",
        title: staffHero.title || "",
        subtitle: staffHero.subtitle || "",
        statistics: statistics,
      };
    }

    return transformedData;
  } catch (error) {
    console.error("Error fetching members:", error);
    return null;
  }
}
