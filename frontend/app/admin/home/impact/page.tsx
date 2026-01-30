"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/ui/admin-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { backendApi } from "@/lib/backend-api";
import { sanitizeMetricKey } from "@/lib/api-content";
import {
  Plus,
  Edit,
  Save,
  Trash2,
  Building,
  Users,
  GraduationCap,
  Award,
  Lightbulb,
  Globe,
  TrendingUp,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ImpactStat {
  id: string;
  icon: string;
  title: string;
  value: number;
  displayValue: string;
  description: string;
  progress: number;
  trend: string;
  location: string;
  metricKey: string;
  is_extra?: boolean;
  sort_order?: number;
}

interface AdditionalMetric {
  id: string;
  value: string;
  label: string;
}

interface ImpactRecord {
  id?: string;
  program_participation: number;
  stem_centers: number;
  events_held: number;
  is_active?: boolean;
  stats?: ImpactStat[];
  additionalMetrics?: AdditionalMetric[];
}

const iconOptions = [
  { value: "Building", label: "Building", icon: Building },
  { value: "Users", label: "Users", icon: Users },
  { value: "GraduationCap", label: "Graduation Cap", icon: GraduationCap },
  { value: "Award", label: "Award", icon: Award },
  { value: "Lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "Globe", label: "Globe", icon: Globe },
];

const defaultImpactRecord: ImpactRecord = {
  program_participation: 0,
  stem_centers: 0,
  events_held: 0,
  stats: [],
  additionalMetrics: [],
};

const normalizeImpactRecord = (record: any): ImpactRecord => {
  const statsFromBackend: ImpactStat[] = Array.isArray(record?.stats)
    ? record.stats.map((stat: any, idx: number) => ({
        id: stat.id?.toString() || `${record?.id || "impact"}-stat-${idx}`,
        metricKey: stat.metric_key || stat.metricKey || `metric_${idx + 1}`,
        icon: stat.icon || "Building",
        title: stat.title || "",
        value: Number(stat.value) || 0,
        displayValue: stat.display_value || stat.displayValue || "0",
        description: stat.description || "",
        progress: Number(stat.progress) || 0,
        trend: stat.trend || "",
        location: stat.location || "",
        is_extra: Boolean(stat.is_extra),
        sort_order: stat.sort_order ?? idx,
      }))
    : [];

  const metadataStats: ImpactStat[] = Array.isArray(record?.metadata?.stats)
    ? record.metadata.stats.map((stat: any, idx: number) => ({
        id: stat.id?.toString() || `${record?.id || "meta"}-stat-${idx}`,
        metricKey: stat.metricKey || stat.metric_key || `metric_${idx + 1}`,
        icon: stat.icon || "Building",
        title: stat.title || "",
        value: Number(stat.value) || 0,
        displayValue: stat.displayValue || stat.display_value || "0",
        description: stat.description || "",
        progress: Number(stat.progress) || 0,
        trend: stat.trend || "",
        location: stat.location || "",
        is_extra: Boolean(stat.is_extra),
        sort_order: stat.sort_order ?? idx,
      }))
    : [];

  const mergedStats = statsFromBackend.length
    ? statsFromBackend
    : metadataStats;
  const additionalMetrics = Array.isArray(record?.metadata?.additionalMetrics)
    ? record.metadata.additionalMetrics
    : [];
  const extraFromStats = mergedStats
    .filter((stat) => stat.is_extra)
    .map((stat) => ({
      id: `${stat.id || stat.metricKey}-extra`,
      value: stat.displayValue || stat.value?.toString() || "",
      label: stat.title || stat.metricKey || "",
    }));

  return {
    id: record?.id?.toString() || record?._id?.toString() || undefined,
    program_participation: Number(record?.program_participation) || 0,
    stem_centers: Number(record?.stem_centers) || 0,
    events_held: Number(record?.events_held) || 0,
    is_active: record?.is_active !== false,
    stats: mergedStats.filter((stat) => !stat.is_extra),
    additionalMetrics:
      additionalMetrics.length > 0 ? additionalMetrics : extraFromStats,
  };
};

const formatDisplayValue = (value: number) => {
  if (value >= 1000000) return `${Math.round(value / 1000000)}M+`;
  if (value >= 1000) return `${Math.round(value / 1000)}K+`;
  return `${value}+`;
};

const buildImpactStats = (
  record: ImpactRecord,
  previous?: ImpactStat[]
): ImpactStat[] => {
  const findPrev = (metricKey: ImpactStat["metricKey"]) =>
    previous?.find((stat) => stat.metricKey === metricKey);

  const stemCentersPrev = findPrev("stem_centers");
  const programParticipationPrev = findPrev("program_participation");
  const eventsHeldPrev = findPrev("events_held");

  return [
    {
      id: record.id ? `${record.id}-stem-centers` : "stem-centers",
      metricKey: "stem_centers",
      icon: stemCentersPrev?.icon || "Building",
      title: stemCentersPrev?.title || "STEM Centers",
      value: record.stem_centers,
      displayValue: formatDisplayValue(record.stem_centers),
      description:
        stemCentersPrev?.description ||
        "Active hands-on STEM learning centers across Ethiopia",
      progress: stemCentersPrev?.progress ?? 75,
      trend: stemCentersPrev?.trend || "+0 this year",
      location: stemCentersPrev?.location || "Nationwide Coverage",
    },
    {
      id: record.id
        ? `${record.id}-program-participation`
        : "program-participation",
      metricKey: "program_participation",
      icon: programParticipationPrev?.icon || "Users",
      title: programParticipationPrev?.title || "Students Impacted",
      value: record.program_participation,
      displayValue: formatDisplayValue(record.program_participation),
      description:
        programParticipationPrev?.description ||
        "Young minds empowered through our comprehensive programs",
      progress: programParticipationPrev?.progress ?? 88,
      trend: programParticipationPrev?.trend || "+0 this year",
      location: programParticipationPrev?.location || "All Regions",
    },
    {
      id: record.id ? `${record.id}-events-held` : "events-held",
      metricKey: "events_held",
      icon: eventsHeldPrev?.icon || "Award",
      title: eventsHeldPrev?.title || "Science Fairs Organized",
      value: record.events_held,
      displayValue: formatDisplayValue(record.events_held),
      description:
        eventsHeldPrev?.description ||
        "Local and national science fairs celebrating excellence",
      progress: eventsHeldPrev?.progress ?? 78,
      trend: eventsHeldPrev?.trend || "+0 this year",
      location: eventsHeldPrev?.location || "Multi-Regional",
    },
  ];
};

const buildPayload = (
  record: ImpactRecord,
  stats: ImpactStat[],
  extraMetrics: AdditionalMetric[]
) => {
  const syncedRecord = { ...record };

  stats.forEach((stat) => {
    if (stat.metricKey === "stem_centers") {
      syncedRecord.stem_centers = stat.value;
    } else if (stat.metricKey === "program_participation") {
      syncedRecord.program_participation = stat.value;
    } else if (stat.metricKey === "events_held") {
      syncedRecord.events_held = stat.value;
    }
  });

  const serializedStats = [
    ...stats.map((stat, idx) => ({
      metric_key: stat.metricKey,
      title: stat.title,
      description: stat.description,
      icon: stat.icon,
      progress: stat.progress,
      trend: stat.trend,
      location: stat.location,
      value: stat.value,
      display_value: stat.displayValue,
      is_extra: false,
      sort_order: idx,
    })),
    ...extraMetrics.map((metric, extraIdx) => ({
      metric_key: sanitizeMetricKey(metric.label) || `extra_${extraIdx + 1}`,
      title: metric.label,
      description: null,
      icon: null,
      progress: null,
      trend: null,
      location: null,
      value: Number.isNaN(Number(metric.value)) ? null : Number(metric.value),
      display_value: metric.value,
      is_extra: true,
      sort_order: stats.length + extraIdx,
    })),
  ];

  return {
    program_participation: syncedRecord.program_participation,
    stem_centers: syncedRecord.stem_centers,
    events_held: syncedRecord.events_held,
    is_active: syncedRecord.is_active ?? true,
    stats: serializedStats,
  };
};

export default function ImpactDashboardPage() {
  const [sectionData, setSectionData] = useState({
    badge: "Our Impact Across Ethiopia",
    title: "Transforming Lives Through STEM Education",
    description:
      "From bustling cities to remote villages, STEMpower Ethiopia is creating opportunities for young minds to explore, innovate, and lead. Our comprehensive programs reach every corner of the nation, building a brighter future through science and technology.",
  });

  const [impactRecord, setImpactRecord] = useState<ImpactRecord | null>(null);
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);

  const [additionalMetrics, setAdditionalMetrics] = useState<
    AdditionalMetric[]
  >([]);

  // Fetch impact stats from API
  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        const response = await backendApi.get("/api/impact");
        const records: ImpactRecord[] = Array.isArray(response)
          ? response.map(normalizeImpactRecord)
          : Array.isArray(response?.data)
          ? response.data.map(normalizeImpactRecord)
          : response
          ? [normalizeImpactRecord(response)]
          : [];

        const activeRecord =
          records.find((record) => record.is_active) ||
          records[0] ||
          defaultImpactRecord;

        setImpactRecord(activeRecord);
        const statsToUse =
          activeRecord.stats && activeRecord.stats.length > 0
            ? activeRecord.stats
            : buildImpactStats(activeRecord);
        setImpactStats(
          statsToUse.map((stat, idx) => ({
            ...stat,
            id:
              stat.id ||
              `${activeRecord.id || "meta"}-${stat.metricKey}-${idx}`,
          }))
        );
        setAdditionalMetrics(activeRecord.additionalMetrics || []);
      } catch (error) {
        console.error("Failed to fetch impact stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImpactStats();
  }, []);

  const [isStatDialogOpen, setIsStatDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<ImpactStat | null>(null);
  const [isMetricDialogOpen, setIsMetricDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<AdditionalMetric | null>(
    null
  );

  const addStat = () => {
    const fallbackStat: ImpactStat = {
      id: Date.now().toString(),
      icon: "Building",
      title: "",
      value: 0,
      displayValue: "0",
      description: "",
      progress: 0,
      trend: "",
      location: "",
      metricKey: `custom-${Date.now()}`,
    };
    setEditingStat(fallbackStat);
    setIsStatDialogOpen(true);
  };

  const editStat = (stat: ImpactStat) => {
    setEditingStat({ ...stat });
    setIsStatDialogOpen(true);
  };

  const saveStat = async () => {
    if (!editingStat) return;
    try {
      const metricKey = editingStat.metricKey || "stem_centers";
      const currentRecord = impactRecord || defaultImpactRecord;

      const existingIndex = impactStats.findIndex(
        (s) => s.id === editingStat.id
      );
      const updatedStats =
        existingIndex >= 0
          ? impactStats.map((s, idx) =>
              idx === existingIndex ? editingStat : s
            )
          : [
              ...impactStats,
              { ...editingStat, id: editingStat.id || Date.now().toString() },
            ];

      const payload = buildPayload(
        currentRecord,
        updatedStats,
        additionalMetrics
      );

      const response = currentRecord.id
        ? await backendApi.put(`/api/impact/${currentRecord.id}`, payload)
        : await backendApi.post("/api/impact", payload);

      const normalized = normalizeImpactRecord(response?.data || response);
      setImpactRecord(normalized);
      setImpactStats(updatedStats);
      setIsStatDialogOpen(false);
      setEditingStat(null);
    } catch (error) {
      console.error("Failed to save stat:", error);
      alert("Failed to save stat. Please try again.");
    }
  };

  const deleteStat = async () => {
    if (!impactRecord?.id) return;
    if (
      !confirm("This will remove the current impact metrics record. Continue?")
    )
      return;
    try {
      await backendApi.delete(`/api/impact/${impactRecord.id}`);
      setImpactRecord(defaultImpactRecord);
      setImpactStats(buildImpactStats(defaultImpactRecord));
    } catch (error) {
      console.error("Failed to delete impact record:", error);
      alert("Failed to delete impact record. Please try again.");
    }
  };

  const deleteSingleStat = async (statId: string) => {
    if (!impactRecord) return;
    if (!confirm("Delete this stat card?")) return;
    try {
      const updatedStats = impactStats.filter((s) => s.id !== statId);
      const payload = buildPayload(
        impactRecord,
        updatedStats,
        additionalMetrics
      );

      const response = impactRecord.id
        ? await backendApi.put(`/api/impact/${impactRecord.id}`, payload)
        : await backendApi.post("/api/impact", payload);
      const normalized = normalizeImpactRecord(response?.data || response);
      setImpactRecord(normalized);
      setImpactStats(updatedStats);
    } catch (error) {
      console.error("Failed to delete stat:", error);
      alert("Failed to delete stat. Please try again.");
    }
  };

  const addMetric = () => {
    const newMetric: AdditionalMetric = {
      id: Date.now().toString(),
      value: "",
      label: "",
    };
    setEditingMetric(newMetric);
    setIsMetricDialogOpen(true);
  };

  const editMetric = (metric: AdditionalMetric) => {
    setEditingMetric({ ...metric });
    setIsMetricDialogOpen(true);
  };

  const saveMetric = async () => {
    if (!editingMetric) return;
    try {
      const existing = additionalMetrics.find((m) => m.id === editingMetric.id);
      const updatedMetrics = existing
        ? additionalMetrics.map((m) =>
            m.id === editingMetric.id ? editingMetric : m
          )
        : [...additionalMetrics, editingMetric];

      const currentRecord = impactRecord || defaultImpactRecord;
      const payload = buildPayload(currentRecord, impactStats, updatedMetrics);

      const response = currentRecord.id
        ? await backendApi.put(`/api/impact/${currentRecord.id}`, payload)
        : await backendApi.post("/api/impact", payload);

      const normalized = normalizeImpactRecord(response?.data || response);
      setImpactRecord(normalized);
      setAdditionalMetrics(updatedMetrics);
      setIsMetricDialogOpen(false);
      setEditingMetric(null);
    } catch (error) {
      console.error("Failed to save metric:", error);
      alert("Failed to save metric. Please try again.");
    }
  };

  const deleteMetric = async (id: string) => {
    if (!impactRecord) return;
    if (!confirm("Are you sure you want to delete this metric?")) return;
    try {
      const updatedMetrics = additionalMetrics.filter((m) => m.id !== id);
      const payload = buildPayload(impactRecord, impactStats, updatedMetrics);

      const response = impactRecord.id
        ? await backendApi.put(`/api/impact/${impactRecord.id}`, payload)
        : await backendApi.post("/api/impact", payload);

      const normalized = normalizeImpactRecord(response?.data || response);
      setImpactRecord(normalized);
      setAdditionalMetrics(updatedMetrics);
    } catch (error) {
      console.error("Failed to delete metric:", error);
      alert("Failed to delete metric. Please try again.");
    }
  };

  return (
    <div>
      <AdminHeader
        title="Impact Dashboard"
        description="Manage homepage impact statistics and metrics"
      />
      <div className="p-6 max-w-6xl space-y-6">
        <Link href="/admin/home">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Section Header */}

        {/* Main Impact Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Main Impact Statistics</CardTitle>
                <CardDescription>
                  Large stat cards with progress indicators
                </CardDescription>
              </div>
              <Button
                onClick={addStat}
                className="bg-[#00BFA6] hover:bg-[#00A693]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Stat
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading impact stats...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {impactStats.map((stat) => {
                  const IconComponent =
                    iconOptions.find((opt) => opt.value === stat.icon)?.icon ||
                    Building;
                  return (
                    <Card
                      key={stat.id}
                      className="border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        {/* Top section with icon and trend */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-lg bg-[#00BFA6]">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex items-center gap-1 text-sm text-amber-600 font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>{stat.trend}</span>
                          </div>
                        </div>

                        {/* Edit/Delete buttons */}
                        <div className="flex gap-1 mb-3 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editStat(stat)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSingleStat(stat.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Large number */}
                        <div className="text-4xl font-bold mb-2 text-gray-900">
                          {stat.displayValue}
                        </div>

                        {/* Title */}
                        <div className="text-sm font-semibold text-gray-900 mb-2">
                          {stat.title}
                        </div>

                        {/* Description */}
                        <div className="text-xs text-gray-600 mb-4 line-clamp-2">
                          {stat.description}
                        </div>

                        {/* Progress section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">
                              Progress
                            </span>
                            <span className="text-xs font-semibold text-gray-900">
                              {stat.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#00BFA6] h-2 rounded-full transition-all"
                              style={{ width: `${stat.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Location indicator */}
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{stat.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Metrics */}

        {/* Stat Dialog */}
        <Dialog open={isStatDialogOpen} onOpenChange={setIsStatDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStat?.title || "New Impact Stat"}
              </DialogTitle>
              <DialogDescription>
                Configure impact statistic details
              </DialogDescription>
            </DialogHeader>
            {editingStat && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={editingStat.icon}
                    onValueChange={(value) =>
                      setEditingStat({ ...editingStat, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingStat.title}
                      onChange={(e) =>
                        setEditingStat({
                          ...editingStat,
                          title: e.target.value,
                        })
                      }
                      placeholder="STEM Centers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayValue">Display Value</Label>
                    <Input
                      id="displayValue"
                      value={editingStat.displayValue}
                      onChange={(e) => {
                        const displayValue = e.target.value;
                        const numericValue = Number.parseInt(
                          displayValue.replace(/[^0-9]/g, ""),
                          10
                        );
                        setEditingStat({
                          ...editingStat,
                          displayValue,
                          value: Number.isNaN(numericValue)
                            ? editingStat.value
                            : numericValue,
                        });
                      }}
                      placeholder="61+"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={2}
                    value={editingStat.description}
                    onChange={(e) =>
                      setEditingStat({
                        ...editingStat,
                        description: e.target.value,
                      })
                    }
                    placeholder="Active hands-on STEM learning centers..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={editingStat.progress}
                      onChange={(e) =>
                        setEditingStat({
                          ...editingStat,
                          progress: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trend">Trend</Label>
                    <Input
                      id="trend"
                      value={editingStat.trend}
                      onChange={(e) =>
                        setEditingStat({
                          ...editingStat,
                          trend: e.target.value,
                        })
                      }
                      placeholder="+8 this year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editingStat.location}
                      onChange={(e) =>
                        setEditingStat({
                          ...editingStat,
                          location: e.target.value,
                        })
                      }
                      placeholder="Nationwide Coverage"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsStatDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveStat}
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Stat
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Metric Dialog */}
        <Dialog open={isMetricDialogOpen} onOpenChange={setIsMetricDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMetric?.label || "New Metric"}</DialogTitle>
              <DialogDescription>Configure additional metric</DialogDescription>
            </DialogHeader>
            {editingMetric && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metricValue">Value</Label>
                  <Input
                    id="metricValue"
                    value={editingMetric.value}
                    onChange={(e) =>
                      setEditingMetric({
                        ...editingMetric,
                        value: e.target.value,
                      })
                    }
                    placeholder="11+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metricLabel">Label</Label>
                  <Input
                    id="metricLabel"
                    value={editingMetric.label}
                    onChange={(e) =>
                      setEditingMetric({
                        ...editingMetric,
                        label: e.target.value,
                      })
                    }
                    placeholder="Regions Covered"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsMetricDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveMetric}
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Metric
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
