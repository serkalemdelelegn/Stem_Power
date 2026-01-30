"use client";

import type React from "react";
import { AdminHeader } from "@/components/ui/admin-header";
import { BackButton } from "@/components/ui/back-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Save,
  MapPin,
  Award,
  Heart,
  GraduationCap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function StemPowerMembersPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Staff Hero State
  const [heroId, setHeroId] = useState<string | null>(null);
  const [staffHero, setStaffHero] = useState({
    badge: "",
    title: "",
    subtitle: "",
    statistics: [] as Array<{
      id: string;
      label: string;
      value: string;
      icon?: string;
    }>,
  });

  // Board Members State
  const [boardMembers, setBoardMembers] = useState<{
    ethiopia: Array<{
      id: string;
      name: string;
      title: string;
      image: string | File | null;
      imagePreview?: string;
      bio: string;
      fullBio: string;
    }>;
  }>({
    ethiopia: [],
  });

  // Staff Members State
  const [staffMembers, setStaffMembers] = useState<
    Array<{
      id: string;
      name: string;
      position: string;
      image: string | File | null;
      imagePreview?: string;
      bio: string;
    }>
  >([]);

  const boardMemberImageRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});
  const staffMemberImageRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch members
        const membersResponse = await fetch("/api/about/members");
        if (!membersResponse.ok) {
          throw new Error("Failed to fetch members");
        }
        const membersData = await membersResponse.json();
        console.log("[v0] Loaded STEMpower members:", membersData);

        // Transform backend data to frontend format
        if (Array.isArray(membersData)) {
          const boardMembersList = membersData
            .filter((m: any) => m.type === "board")
            .map((m: any) => ({
              id: String(m.id),
              name: m.name || "",
              title: m.role || "",
              image: m.photo_url || null,
              bio: m.bio || "",
              fullBio: m.bio || "", // Backend doesn't have separate fullBio, using bio for both
            }));

          const staffMembersList = membersData
            .filter((m: any) => m.type === "staff")
            .map((m: any) => ({
              id: String(m.id),
              name: m.name || "",
              position: m.role || "",
              image: m.photo_url || null,
              bio: m.bio || "",
            }));

          if (boardMembersList.length > 0) {
            setBoardMembers({ ethiopia: boardMembersList });
          }
          if (staffMembersList.length > 0) {
            setStaffMembers(staffMembersList);
          }
        }

        // Fetch staff hero
        let loadedHeroId: string | null = null;
        try {
          const heroResponse = await fetch("/api/about/staff-hero");
          if (heroResponse.ok) {
            const heroData = await heroResponse.json();
            if (heroData && heroData.id) {
              loadedHeroId = String(heroData.id);
              setHeroId(loadedHeroId);
              setStaffHero({
                badge: heroData.badge || "",
                title: heroData.title || "",
                subtitle: heroData.subtitle || "",
                statistics: [],
              });
            }
          }
        } catch (e) {
          console.error("Failed to fetch staff hero:", e);
        }

        // Fetch staff hero stats (only if we have a hero)
        if (loadedHeroId) {
          try {
            const statsResponse = await fetch(
              `/api/about/staff-hero/stats?staff_hero_id=${loadedHeroId}`
            );
            if (statsResponse.ok) {
              const statsData = await statsResponse.json();
              if (Array.isArray(statsData)) {
                setStaffHero((prev) => ({
                  ...prev,
                  statistics: statsData.map((s: any) => ({
                    id: String(s.id),
                    label: s.label || "",
                    value: s.value || "",
                    icon: s.icon || "users",
                  })),
                }));
              }
            }
          } catch (e) {
            console.error("Failed to fetch staff hero stats:", e);
          }
        }
      } catch (err: any) {
        console.error("[v0] Error loading members data:", err);
        setError(err.message || "Failed to load members data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addBoardMember = () => {
    const newMember = {
      id: `temp-${Date.now()}`,
      name: "",
      title: "",
      image: null,
      bio: "",
      fullBio: "",
    };
    setBoardMembers({
      ...boardMembers,
      ethiopia: [...boardMembers.ethiopia, newMember],
    });
  };

  const removeBoardMember = async (id: string) => {
    // Don't delete if it's a temp ID (not saved yet)
    if (id.startsWith("temp-")) {
      const member = boardMembers.ethiopia.find((m) => m.id === id);
      if (member?.imagePreview && member.image instanceof File) {
        URL.revokeObjectURL(member.imagePreview);
      }
      setBoardMembers({
        ...boardMembers,
        ethiopia: boardMembers.ethiopia.filter((m) => m.id !== id),
      });
      return;
    }

    try {
      const response = await fetch(`/api/about/members/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to delete" }));
        throw new Error(
          errorData.error ||
            errorData.message ||
            "Failed to delete board member"
        );
      }

      setBoardMembers({
        ...boardMembers,
        ethiopia: boardMembers.ethiopia.filter((m) => m.id !== id),
      });
    } catch (error: any) {
      console.error("Error deleting board member:", error);
      alert(
        error.message || "Failed to delete board member. Please try again."
      );
    }
  };

  const addStaffMember = () => {
    setStaffMembers([
      ...staffMembers,
      {
        id: `temp-${Date.now()}`,
        name: "",
        position: "",
        image: null,
        bio: "",
      },
    ]);
  };

  const removeStaffMember = async (id: string) => {
    // Don't delete if it's a temp ID (not saved yet)
    if (id.startsWith("temp-")) {
      const member = staffMembers.find((m) => m.id === id);
      if (member?.imagePreview && member.image instanceof File) {
        URL.revokeObjectURL(member.imagePreview);
      }
      setStaffMembers(staffMembers.filter((m) => m.id !== id));
      return;
    }

    try {
      const response = await fetch(`/api/about/members/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to delete" }));
        throw new Error(
          errorData.error ||
            errorData.message ||
            "Failed to delete staff member"
        );
      }

      setStaffMembers(staffMembers.filter((m) => m.id !== id));
    } catch (error: any) {
      console.error("Error deleting staff member:", error);
      alert(
        error.message || "Failed to delete staff member. Please try again."
      );
    }
  };

  const handleBoardMemberImageUpload = (
    memberId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL if it exists
      const existingMember = boardMembers.ethiopia.find(
        (m) => m.id === memberId
      );
      if (
        existingMember?.imagePreview &&
        existingMember.image instanceof File
      ) {
        URL.revokeObjectURL(existingMember.imagePreview);
      }
      // Create preview URL and store File object
      const previewUrl = URL.createObjectURL(file);
      const newMembers = boardMembers.ethiopia.map((m) =>
        m.id === memberId ? { ...m, image: file, imagePreview: previewUrl } : m
      );
      setBoardMembers({ ...boardMembers, ethiopia: newMembers });
    }
  };

  const handleStaffMemberImageUpload = (
    memberId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL if it exists
      const existingMember = staffMembers.find((m) => m.id === memberId);
      if (
        existingMember?.imagePreview &&
        existingMember.image instanceof File
      ) {
        URL.revokeObjectURL(existingMember.imagePreview);
      }
      // Create preview URL and store File object
      const previewUrl = URL.createObjectURL(file);
      const newMembers = staffMembers.map((m) =>
        m.id === memberId ? { ...m, image: file, imagePreview: previewUrl } : m
      );
      setStaffMembers(newMembers);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      // Save all board members
      for (const member of boardMembers.ethiopia) {
        const isNew = !member.id || member.id.startsWith("temp-");
        const memberData: any = {
          name: member.name,
          role: member.title,
          bio: member.bio || null,
          type: "board",
          is_active: true,
        };

        // Handle image upload
        if (member.image instanceof File) {
          const formData = new FormData();
          formData.append("file", member.image);
          formData.append("name", memberData.name);
          formData.append("role", memberData.role);
          formData.append("bio", memberData.bio || "");
          formData.append("type", memberData.type);
          formData.append("is_active", "true");

          const url = isNew
            ? "/api/about/members"
            : `/api/about/members/${member.id}`;
          const method = isNew ? "POST" : "PUT";

          const response = await fetch(url, {
            method,
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Failed to save" }));
            throw new Error(
              errorData.error ||
                errorData.message ||
                "Failed to save board member"
            );
          }

          const saved = await response.json();

          // Clean up preview URL
          if (member.imagePreview) {
            URL.revokeObjectURL(member.imagePreview);
          }

          // Update local state with saved data
          if (isNew) {
            setBoardMembers({
              ...boardMembers,
              ethiopia: boardMembers.ethiopia.map((m) =>
                m.id === member.id
                  ? {
                      ...m,
                      id: String(saved.id),
                      image: saved.photo_url || null,
                      imagePreview: undefined,
                    }
                  : m
              ),
            });
          } else {
            setBoardMembers({
              ...boardMembers,
              ethiopia: boardMembers.ethiopia.map((m) =>
                m.id === member.id
                  ? {
                      ...m,
                      image: saved.photo_url || null,
                      imagePreview: undefined,
                    }
                  : m
              ),
            });
          }
        } else {
          // No file upload, use JSON
          memberData.photo_url = member.image || null;

          const url = isNew
            ? "/api/about/members"
            : `/api/about/members/${member.id}`;
          const method = isNew ? "POST" : "PUT";

          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(memberData),
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Failed to save" }));
            throw new Error(
              errorData.error ||
                errorData.message ||
                "Failed to save board member"
            );
          }

          const saved = await response.json();
          if (isNew) {
            setBoardMembers({
              ...boardMembers,
              ethiopia: boardMembers.ethiopia.map((m) =>
                m.id === member.id ? { ...m, id: String(saved.id) } : m
              ),
            });
          }
        }
      }

      // Save all staff members
      for (const member of staffMembers) {
        const isNew = !member.id || member.id.startsWith("temp-");
        const memberData: any = {
          name: member.name,
          role: member.position,
          bio: member.bio || null,
          type: "staff",
          is_active: true,
        };

        // Handle image upload
        if (member.image instanceof File) {
          const formData = new FormData();
          formData.append("file", member.image);
          formData.append("name", memberData.name);
          formData.append("role", memberData.role);
          formData.append("bio", memberData.bio || "");
          formData.append("type", memberData.type);
          formData.append("is_active", "true");

          const url = isNew
            ? "/api/about/members"
            : `/api/about/members/${member.id}`;
          const method = isNew ? "POST" : "PUT";

          const response = await fetch(url, {
            method,
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Failed to save" }));
            throw new Error(
              errorData.error ||
                errorData.message ||
                "Failed to save staff member"
            );
          }

          const saved = await response.json();

          // Clean up preview URL
          if (member.imagePreview) {
            URL.revokeObjectURL(member.imagePreview);
          }

          // Update local state with saved data
          if (isNew) {
            setStaffMembers(
              staffMembers.map((m) =>
                m.id === member.id
                  ? {
                      ...m,
                      id: String(saved.id),
                      image: saved.photo_url || null,
                      imagePreview: undefined,
                    }
                  : m
              )
            );
          } else {
            setStaffMembers(
              staffMembers.map((m) =>
                m.id === member.id
                  ? {
                      ...m,
                      image: saved.photo_url || null,
                      imagePreview: undefined,
                    }
                  : m
              )
            );
          }
        } else {
          // No file upload, use JSON
          memberData.photo_url = member.image || null;

          const url = isNew
            ? "/api/about/members"
            : `/api/about/members/${member.id}`;
          const method = isNew ? "POST" : "PUT";

          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(memberData),
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Failed to save" }));
            throw new Error(
              errorData.error ||
                errorData.message ||
                "Failed to save staff member"
            );
          }

          const saved = await response.json();
          if (isNew) {
            setStaffMembers(
              staffMembers.map((m) =>
                m.id === member.id ? { ...m, id: String(saved.id) } : m
              )
            );
          }
        }
      }

      // Save staff hero
      let currentHeroId = heroId;
      try {
        const heroPayload = {
          badge: staffHero.badge,
          title: staffHero.title,
          subtitle: staffHero.subtitle,
        };

        if (currentHeroId) {
          const heroResponse = await fetch(
            `/api/about/staff-hero/${currentHeroId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(heroPayload),
            }
          );
          if (!heroResponse.ok) {
            const errorData = await heroResponse.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to update staff hero");
          }
        } else {
          const heroResponse = await fetch("/api/about/staff-hero", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(heroPayload),
          });
          if (!heroResponse.ok) {
            const errorData = await heroResponse.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to create staff hero");
          }
          const savedHero = await heroResponse.json();
          if (savedHero?.id) {
            currentHeroId = String(savedHero.id);
            setHeroId(currentHeroId);
          }
        }
      } catch (e: any) {
        throw new Error(e.message || "Failed to save staff hero section");
      }

      // Save staff hero statistics
      if (currentHeroId) {
        // First, get existing stats for this hero from backend to find ones to delete
        const existingStatsResponse = await fetch(
          `/api/about/staff-hero/stats?staff_hero_id=${currentHeroId}`
        );
        const existingStats: any[] = existingStatsResponse.ok
          ? await existingStatsResponse.json()
          : [];
        const existingStatIds = new Set<string>(
          existingStats.map((s: any) => String(s.id))
        );
        const currentStatIds = new Set<string>(
          staffHero.statistics
            .filter((s) => !s.id.startsWith("temp-"))
            .map((s) => s.id)
        );

        // Delete stats that were removed
        const existingIdsArray = Array.from(existingStatIds);
        for (const existingId of existingIdsArray) {
          if (!currentStatIds.has(existingId)) {
            try {
              await fetch(`/api/about/staff-hero/stats/${existingId}`, {
                method: "DELETE",
              });
            } catch (e) {
              console.error("Failed to delete stat:", e);
            }
          }
        }

        // Create or update stats
        for (let index = 0; index < staffHero.statistics.length; index++) {
          const stat = staffHero.statistics[index];
          const isNew = !stat.id || stat.id.startsWith("temp-");
          const statPayload = {
            label: stat.label,
            value: stat.value,
            icon: stat.icon || "users",
            staff_hero_id: parseInt(currentHeroId, 10), // Ensure it's a number
            order: index,
          };

          if (isNew) {
            const statResponse = await fetch("/api/about/staff-hero/stats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(statPayload),
            });
            if (!statResponse.ok) {
              const errorData = await statResponse.json().catch(() => ({}));
              throw new Error(errorData.error || "Failed to create stat");
            }
            const savedStat = await statResponse.json();
            setStaffHero((prev) => ({
              ...prev,
              statistics: prev.statistics.map((s) =>
                s.id === stat.id ? { ...s, id: String(savedStat.id) } : s
              ),
            }));
          } else {
            const statResponse = await fetch(
              `/api/about/staff-hero/stats/${stat.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(statPayload),
              }
            );
            if (!statResponse.ok) {
              const errorData = await statResponse.json().catch(() => ({}));
              throw new Error(errorData.error || "Failed to update stat");
            }
          }
        }
      }

      // Clean up any remaining object URLs
      boardMembers.ethiopia.forEach((m) => {
        if (m.imagePreview && m.image instanceof File) {
          URL.revokeObjectURL(m.imagePreview);
        }
      });
      staffMembers.forEach((m) => {
        if (m.imagePreview && m.image instanceof File) {
          URL.revokeObjectURL(m.imagePreview);
        }
      });

      alert("STEMpower Members content saved successfully!");
    } catch (err: any) {
      console.error("[v0] Error saving members:", err);
      const errorMessage = err.message || "Failed to save members data";
      setError(errorMessage);
      alert(`Error saving data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="STEMpower Members Management"
        description="Manage board members and staff members profiles"
      />

      <div className="p-6 max-w-7xl">
        <BackButton />

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-6">
          <Button
            onClick={handleSave}
            size="lg"
            className="bg-[#00BFA6] hover:bg-[#00A693]"
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <Tabs defaultValue="staff-hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="staff-hero" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Staff Hero
            </TabsTrigger>
            <TabsTrigger value="board" className="gap-2">
              <Users className="h-4 w-4" />
              Board Members
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Users className="h-4 w-4" />
              Staff Members
            </TabsTrigger>
          </TabsList>

          {/* Staff Hero Section Tab */}
          <TabsContent value="staff-hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#00BFA6]" />
                  Staff Section Hero
                </CardTitle>
                <CardDescription>
                  Customize the hero section for the staff members area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="staff-badge">Badge Text</Label>
                    <Input
                      id="staff-badge"
                      value={staffHero.badge}
                      onChange={(e) =>
                        setStaffHero({ ...staffHero, badge: e.target.value })
                      }
                      placeholder="Meet the Ethiopian Team"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff-title">Title</Label>
                    <Input
                      id="staff-title"
                      value={staffHero.title}
                      onChange={(e) =>
                        setStaffHero({ ...staffHero, title: e.target.value })
                      }
                      placeholder="The Heart Behind STEMpower Ethiopia"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="staff-subtitle">Subtitle</Label>
                  <Textarea
                    id="staff-subtitle"
                    value={staffHero.subtitle}
                    onChange={(e) =>
                      setStaffHero({ ...staffHero, subtitle: e.target.value })
                    }
                    rows={3}
                    placeholder="Our dedicated team..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.stopPropagation();
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Statistics Cards</Label>
                    <Button
                      onClick={() => {
                        setStaffHero({
                          ...staffHero,
                          statistics: [
                            ...staffHero.statistics,
                            {
                              id: `temp-${Date.now()}`,
                              label: "",
                              value: "",
                              icon: "users",
                            },
                          ],
                        });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Statistic
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {staffHero.statistics.map((stat) => (
                      <Card key={stat.id}>
                        <CardContent className="pt-6 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <Select
                                value={stat.icon || "users"}
                                onValueChange={(value) => {
                                  const newStats = staffHero.statistics.map(
                                    (s) =>
                                      s.id === stat.id
                                        ? { ...s, icon: value }
                                        : s
                                  );
                                  setStaffHero({
                                    ...staffHero,
                                    statistics: newStats,
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select icon" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="users">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      Users
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="graduation-cap">
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4" />
                                      Graduation Cap
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="award">
                                    <div className="flex items-center gap-2">
                                      <Award className="h-4 w-4" />
                                      Award
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="heart">
                                    <div className="flex items-center gap-2">
                                      <Heart className="h-4 w-4" />
                                      Heart
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={stat.label}
                                onChange={(e) => {
                                  const newStats = staffHero.statistics.map(
                                    (s) =>
                                      s.id === stat.id
                                        ? { ...s, label: e.target.value }
                                        : s
                                  );
                                  setStaffHero({
                                    ...staffHero,
                                    statistics: newStats,
                                  });
                                }}
                                placeholder="Label"
                              />
                              <Input
                                value={stat.value}
                                onChange={(e) => {
                                  const newStats = staffHero.statistics.map(
                                    (s) =>
                                      s.id === stat.id
                                        ? { ...s, value: e.target.value }
                                        : s
                                  );
                                  setStaffHero({
                                    ...staffHero,
                                    statistics: newStats,
                                  });
                                }}
                                placeholder="Value"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setStaffHero({
                                  ...staffHero,
                                  statistics: staffHero.statistics.filter(
                                    (s) => s.id !== stat.id
                                  ),
                                });
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {staffHero.statistics.length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No statistics added yet. Click "Add Statistic" to get
                        started.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Board Members Tab */}
          <TabsContent value="board" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#00BFA6]" />
                  Board of Directors
                </CardTitle>
                <CardDescription>
                  Manage board members for STEMpower Ethiopia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => {}}
                      className="bg-[#00BFA6] hover:bg-[#00A693]"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      STEMpower Ethiopia
                    </Button>
                  </div>
                  <Button onClick={addBoardMember} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Board Member
                  </Button>
                </div>

                <div className="space-y-4">
                  {boardMembers.ethiopia.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">
                        No board members have been added yet.
                      </p>
                      <p className="text-sm mt-2">
                        Click "Add Board Member" to get started.
                      </p>
                    </div>
                  ) : (
                    boardMembers.ethiopia.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className="shrink-0">
                              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 relative">
                                <Image
                                  src={
                                    member.imagePreview ||
                                    (typeof member.image === "string"
                                      ? member.image
                                      : "/placeholder.svg")
                                  }
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <input
                                ref={(el) => {
                                  boardMemberImageRefs.current[member.id] = el;
                                }}
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleBoardMemberImageUpload(member.id, e)
                                }
                                className="hidden"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-24 mt-2 bg-transparent"
                                onClick={() =>
                                  boardMemberImageRefs.current[
                                    member.id
                                  ]?.click()
                                }
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label>Name</Label>
                                  <Input
                                    value={member.name}
                                    onChange={(e) => {
                                      const newMembers =
                                        boardMembers.ethiopia.map((m) =>
                                          m.id === member.id
                                            ? { ...m, name: e.target.value }
                                            : m
                                        );
                                      setBoardMembers({
                                        ...boardMembers,
                                        ethiopia: newMembers,
                                      });
                                    }}
                                    placeholder="Full name"
                                  />
                                </div>
                                <div>
                                  <Label>Title/Position</Label>
                                  <Input
                                    value={member.title}
                                    onChange={(e) => {
                                      const newMembers =
                                        boardMembers.ethiopia.map((m) =>
                                          m.id === member.id
                                            ? { ...m, title: e.target.value }
                                            : m
                                        );
                                      setBoardMembers({
                                        ...boardMembers,
                                        ethiopia: newMembers,
                                      });
                                    }}
                                    placeholder="Board Chairperson"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Short Bio</Label>
                                <Textarea
                                  value={member.bio}
                                  onChange={(e) => {
                                    const newMembers =
                                      boardMembers.ethiopia.map((m) =>
                                        m.id === member.id
                                          ? { ...m, bio: e.target.value }
                                          : m
                                      );
                                    setBoardMembers({
                                      ...boardMembers,
                                      ethiopia: newMembers,
                                    });
                                  }}
                                  rows={2}
                                  placeholder="Brief description..."
                                />
                              </div>
                              <div>
                                <Label>Full Bio</Label>
                                <Textarea
                                  value={member.fullBio}
                                  onChange={(e) => {
                                    const newMembers =
                                      boardMembers.ethiopia.map((m) =>
                                        m.id === member.id
                                          ? { ...m, fullBio: e.target.value }
                                          : m
                                      );
                                    setBoardMembers({
                                      ...boardMembers,
                                      ethiopia: newMembers,
                                    });
                                  }}
                                  rows={3}
                                  placeholder="Complete biography..."
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") e.stopPropagation();
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBoardMember(member.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Members Tab */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#00BFA6]" />
                      Staff Members
                    </CardTitle>
                    <CardDescription>
                      Add and manage your team members
                    </CardDescription>
                  </div>
                  <Button onClick={addStaffMember} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {staffMembers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">
                      No staff members have been added yet.
                    </p>
                    <p className="text-sm mt-2">
                      Click "Add Staff Member" to get started.
                    </p>
                  </div>
                ) : (
                  staffMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 relative">
                              <Image
                                src={
                                  member.imagePreview ||
                                  (typeof member.image === "string" &&
                                  member.image
                                    ? member.image
                                    : "/placeholder.svg")
                                }
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <input
                              ref={(el) => {
                                staffMemberImageRefs.current[member.id] = el;
                              }}
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleStaffMemberImageUpload(member.id, e)
                              }
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-24 mt-2 bg-transparent"
                              onClick={() =>
                                staffMemberImageRefs.current[member.id]?.click()
                              }
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>Name</Label>
                                <Input
                                  value={member.name}
                                  onChange={(e) => {
                                    const newMembers = staffMembers.map((m) =>
                                      m.id === member.id
                                        ? { ...m, name: e.target.value }
                                        : m
                                    );
                                    setStaffMembers(newMembers);
                                  }}
                                  placeholder="Full name"
                                />
                              </div>
                              <div>
                                <Label>Position/Title</Label>
                                <Input
                                  value={member.position}
                                  onChange={(e) => {
                                    const newMembers = staffMembers.map((m) =>
                                      m.id === member.id
                                        ? { ...m, position: e.target.value }
                                        : m
                                    );
                                    setStaffMembers(newMembers);
                                  }}
                                  placeholder="Country Director"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Bio/Description</Label>
                              <Textarea
                                value={member.bio}
                                onChange={(e) => {
                                  const newMembers = staffMembers.map((m) =>
                                    m.id === member.id
                                      ? { ...m, bio: e.target.value }
                                      : m
                                  );
                                  setStaffMembers(newMembers);
                                }}
                                rows={3}
                                placeholder="Brief description of their role and background..."
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") e.stopPropagation();
                                }}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStaffMember(member.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
