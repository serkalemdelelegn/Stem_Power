"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditableHeroSection } from "@/components/editable-hero-section";
import { EditableStatisticsSection } from "@/components/editable-statistics-section";
import { EditableMachinerySection } from "@/components/editable-machinery-section";
import {
  createMachinery as createMachineryAPI,
  updateMachinery as updateMachineryAPI,
  deleteMachinery as deleteMachineryAPI,
} from "@/lib/api-programs/fablab/api-programs-fablab-services";

interface HeroData {
  badge: string;
  title: string;
  description: string;
}

interface Statistic {
  id: string;
  number: string;
  title: string;
}

interface Machinery {
  id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  commonApplications: string[];
  precision: string;
  power: string;
  area: string;
  image: string | File | null;
  imagePreview?: string; // For displaying preview of File objects
}

export default function ServicesPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [heroData, setHeroData] = useState<HeroData>({
    badge: "Services",
    title: "FabLab Services",
    description:
      "Explore our state-of-the-art machinery and equipment available for your projects",
  });

  const [statistics, setStatistics] = useState<Statistic[]>([
    // Loaded from API
  ]);

  const [machineries, setMachineries] = useState<Machinery[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [heroRes, statsRes, machRes] = await Promise.all([
          fetch("/api/programs/fablab/services/hero"),
          fetch("/api/programs/fablab/services/stats"),
          fetch("/api/programs/fablab/services/machineries"),
        ]);
        if (!statsRes.ok || !machRes.ok)
          throw new Error("Failed to load services content");
        const hero = heroRes.ok ? await heroRes.json() : null;
        const stats = await statsRes.json();
        const machs = await machRes.json();
        setHeroData({
          badge: hero?.badge || "",
          title: hero?.title || "",
          description: hero?.description || "",
        });
        // Ensure stats are properly formatted
        const transformedStats = Array.isArray(stats)
          ? stats.map((stat: any) => ({
              id: String(stat.id || Date.now()),
              number: stat.number || stat.value || "",
              title: stat.title || "",
            }))
          : [];
        setStatistics(transformedStats);

        // The API route already transforms the data from backend format to frontend format
        // So we can use it directly, just ensure all required fields are present
        const transformedMachineries = Array.isArray(machs)
          ? machs.map((mach: any) => ({
              id: String(mach.id || ""),
              title: mach.title || "",
              description: mach.description || "",
              keyFeatures: Array.isArray(mach.keyFeatures)
                ? mach.keyFeatures
                : [],
              commonApplications: Array.isArray(mach.commonApplications)
                ? mach.commonApplications
                : [],
              precision: mach.precision || "",
              power: mach.power || "",
              area: mach.area || "",
              image: mach.image || "",
              imagePreview: undefined, // No preview needed for existing URLs
            }))
          : [];
        setMachineries(transformedMachineries);
        setLoadError(null);
      } catch (e) {
        console.error("[Admin Services] load error", e);
        setLoadError(
          "Unable to load the latest services content. Showing current edits only."
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save hero - first check if hero exists
      let existingHero = null;
      try {
        const heroGetRes = await fetch("/api/programs/fablab/services/hero");
        if (heroGetRes.ok) {
          existingHero = await heroGetRes.json();
        }
      } catch (e) {
        // Ignore error, will create new hero
      }

      let heroResponse;
      if (existingHero && existingHero.id) {
        // Update existing hero
        heroResponse = await fetch("/api/programs/fablab/services/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: existingHero.id,
            badge: heroData.badge,
            title: heroData.title,
            description: heroData.description,
          }),
        });
      } else {
        // Create new hero
        heroResponse = await fetch("/api/programs/fablab/services/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            badge: heroData.badge,
            title: heroData.title,
            description: heroData.description,
          }),
        });
      }

      // Save stats
      const statsResponse = await fetch("/api/programs/fablab/services/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statistics),
      });

      // Save machineries - need to handle File objects properly
      // Get existing machineries to identify which to delete
      const existingMachRes = await fetch(
        "/api/programs/fablab/services/machineries"
      );
      const existingMachs = existingMachRes.ok
        ? await existingMachRes.json()
        : [];
      const existingIds = existingMachs.map((m: any) => String(m.id));
      const incomingIds = machineries
        .map((m) => m.id)
        .filter(
          (id) =>
            id &&
            !String(id).startsWith("temp-") &&
            !String(id).match(/^\d{13}$/)
        );

      // Delete machineries that are not in the incoming array
      const machineriesToDelete = existingMachs.filter(
        (existing: any) => !incomingIds.includes(String(existing.id))
      );
      await Promise.all(
        machineriesToDelete.map((machinery: any) =>
          deleteMachineryAPI(String(machinery.id)).catch((err) => {
            console.error(`Failed to delete machinery ${machinery.id}:`, err);
          })
        )
      );

      // Create or update machineries
      const machResults = await Promise.all(
        machineries.map(async (machinery) => {
          const isNewMachinery =
            !machinery.id ||
            String(machinery.id).startsWith("temp-") ||
            String(machinery.id).match(/^\d{13}$/);

          const machineryData = {
            title: machinery.title,
            description: machinery.description,
            icon: null, // Can be added later if needed
            capabilities: Array.isArray(machinery.keyFeatures)
              ? machinery.keyFeatures
              : [],
            applications: Array.isArray(machinery.commonApplications)
              ? machinery.commonApplications
              : [],
            specs: {
              ...(machinery.precision && { precision: machinery.precision }),
              ...(machinery.power && { power: machinery.power }),
              ...(machinery.area && { area: machinery.area }),
            },
            image: machinery.image, // Can be File, string URL, or null
          };

          let saved;
          if (isNewMachinery) {
            // Create new machinery
            saved = await createMachineryAPI(machineryData);
          } else {
            // Update existing machinery
            try {
              saved = await updateMachineryAPI(
                String(machinery.id),
                machineryData
              );
            } catch (error) {
              // If update fails, try to create
              saved = await createMachineryAPI(machineryData);
            }
          }

          // Transform the saved machinery, but preserve the original data
          // in case the backend response doesn't include all fields
          const transformed = transformBackendServiceToFrontend(saved);

          // Merge with original machinery data to ensure all fields are preserved
          return {
            ...transformed,
            // Preserve the original values if backend didn't return them
            keyFeatures:
              transformed.keyFeatures.length > 0
                ? transformed.keyFeatures
                : machinery.keyFeatures || [],
            commonApplications:
              transformed.commonApplications.length > 0
                ? transformed.commonApplications
                : machinery.commonApplications || [],
            precision: transformed.precision || machinery.precision || "",
            power: transformed.power || machinery.power || "",
            area: transformed.area || machinery.area || "",
            // Preserve image if it's a File object (not yet uploaded)
            image:
              machinery.image instanceof File
                ? machinery.image
                : transformed.image || machinery.image || "",
          };
        })
      );

      // Update local state with saved machineries
      setMachineries(machResults);

      // Check if responses are successful (status 200-299)
      const heroSuccess =
        heroResponse.status >= 200 && heroResponse.status < 300;
      const statsSuccess =
        statsResponse.status >= 200 && statsResponse.status < 300;

      // Update hero state with saved hero
      if (heroSuccess) {
        try {
          const savedHero = await heroResponse.json();
          if (savedHero && !savedHero.error) {
            setHeroData({
              badge: savedHero.badge || "",
              title: savedHero.title || "",
              description: savedHero.description || "",
            });
          } else {
            console.error(
              "[Services] Hero response contains error:",
              savedHero
            );
          }
        } catch (e) {
          console.error("[Services] Error parsing hero response:", e);
        }
      } else {
        try {
          const heroError = await heroResponse
            .json()
            .catch(() => ({ error: "Unknown error" }));
          console.error(
            "[Services] Hero save failed:",
            heroResponse.status,
            heroError
          );
        } catch (e) {
          console.error(
            "[Services] Hero save failed with status:",
            heroResponse.status
          );
        }
      }

      // Update stats state with saved stats
      if (statsSuccess) {
        try {
          const savedStats = await statsResponse.json();
          if (Array.isArray(savedStats)) {
            setStatistics(savedStats);
          } else if (savedStats && savedStats.error) {
            console.error(
              "[Services] Stats response contains error:",
              savedStats
            );
          }
        } catch (e) {
          console.error("[Services] Error parsing stats response:", e);
        }
      } else {
        try {
          const statsError = await statsResponse
            .json()
            .catch(() => ({ error: "Unknown error" }));
          console.error(
            "[Services] Stats save failed:",
            statsResponse.status,
            statsError
          );
        } catch (e) {
          console.error(
            "[Services] Stats save failed with status:",
            statsResponse.status
          );
        }
      }

      if (heroSuccess && statsSuccess) {
        alert("Services page updated successfully!");
      } else {
        alert("Error saving page. Please try again.");
      }
    } catch (error: any) {
      console.error("[Services] Error saving:", error);
      alert(error.message || "Error saving page. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to transform backend service to frontend machinery format
  function transformBackendServiceToFrontend(backendService: any) {
    if (!backendService || typeof backendService !== "object") {
      return {
        id: "",
        title: "",
        description: "",
        keyFeatures: [],
        commonApplications: [],
        precision: "",
        power: "",
        area: "",
        image: "",
      };
    }

    // Extract capabilities - check direct property first, then relationships
    let capabilities: string[] = [];
    if (Array.isArray(backendService.capabilities)) {
      capabilities = backendService.capabilities.filter(Boolean);
    } else if (typeof backendService.capabilities === "string") {
      try {
        const parsed = JSON.parse(backendService.capabilities);
        capabilities = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        capabilities = [];
      }
    } else if (
      backendService.FabLabServiceFeatures &&
      Array.isArray(backendService.FabLabServiceFeatures)
    ) {
      capabilities = backendService.FabLabServiceFeatures.map(
        (f: any) => f.feature || ""
      ).filter(Boolean);
    }

    // Extract applications - check direct property first, then relationships
    let applications: string[] = [];
    if (Array.isArray(backendService.applications)) {
      applications = backendService.applications.filter(Boolean);
    } else if (typeof backendService.applications === "string") {
      try {
        const parsed = JSON.parse(backendService.applications);
        applications = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        applications = [];
      }
    } else if (
      backendService.FabLabServiceApplications &&
      Array.isArray(backendService.FabLabServiceApplications)
    ) {
      applications = backendService.FabLabServiceApplications.map(
        (a: any) => a.application || ""
      ).filter(Boolean);
    }

    // Extract specs - handle both object and string formats
    let specs: Record<string, string> = {};
    if (
      typeof backendService.specs === "object" &&
      backendService.specs &&
      !Array.isArray(backendService.specs)
    ) {
      specs = backendService.specs;
    } else if (typeof backendService.specs === "string") {
      try {
        const parsed = JSON.parse(backendService.specs);
        if (typeof parsed === "object" && !Array.isArray(parsed)) {
          specs = parsed;
        }
      } catch {
        specs = {};
      }
    }

    return {
      id: String(backendService.id || ""),
      title: backendService.title || "",
      description: backendService.description || "",
      keyFeatures: Array.isArray(capabilities) ? capabilities : [],
      commonApplications: Array.isArray(applications) ? applications : [],
      precision: specs.precision || "",
      power: specs.power || "",
      area: specs.area || "",
      image: backendService.image || "",
    };
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-6 pt-6">
        <Link
          href="/admin/programs/fablab"
          className="flex items-center gap-2 text-[#367375] hover:text-[#24C3BC] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to FabLab</span>
        </Link>
      </div>

      <div className="px-6 py-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading services content…
          </p>
        )}
        {!isLoading && loadError && (
          <p className="text-sm text-amber-600">{loadError}</p>
        )}
      </div>

      <div className="px-6 py-6">
        <EditableHeroSection data={heroData} onSave={setHeroData} />
      </div>

      <div className="px-6 pb-6">
        <EditableStatisticsSection
          statistics={statistics}
          onSave={setStatistics}
        />
      </div>

      <div className="p-6 max-w-6xl">
        <div className="space-y-6">
          <EditableMachinerySection
            machineries={machineries}
            onSave={(updatedMachineries) => setMachineries(updatedMachineries)}
          />

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
