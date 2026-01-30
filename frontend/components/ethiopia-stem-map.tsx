"use client";

import { useEffect, useRef, useState } from "react";
import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

const mapStaticText = {
  en: {
    badge: "STEM Centers Across Ethiopia",
    heading: (count: number) => `Discover Our ${count} STEM Centers`,
    description: (count: number) =>
      `${count} hands-on STEM Centers across Ethiopia, part of STEMpower's mission to empower 150+ centers across Sub-Saharan Africa with practical science and technology education.`,
    refresh: "Refresh",
    loadingMap: "Loading map...",
    clickHint: (count: number) =>
      `Click on any dot to view center details (${count} centers)`,
    emptyState: "No STEM centers found. Add centers from the admin panel.",
    infoTitle: "STEM Center Info",
    name: "Name:",
    host: "Host:",
    city: "City:",
    country: "Country:",
    close: "Close",
  },
  am: {
    badge: "በኢትዮጵያ ያሉ የስቴም ማእከላት",
    heading: (count: number) => `የእኛን ${count} የስቴም ማእከላት ያውቁ`,
    description: (count: number) =>
      `${count} በተግባር የስቴም ማእከላት በኢትዮጵያ፣ በንቃት ሳይንስ እና ቴክኖሎጂ ትምህርትን ለማበረታት በአፍሪካ ዝቅተኛ ምዕራብ በ150+ ማእከላት ላይ የስቴምፓወር ተልዕኮ አካል።`,
    refresh: "ዳግም አስጀምር",
    loadingMap: "ካርታን በመጫን ላይ...",
    clickHint: (count: number) => `ዝርዝር ለማየት በማንኛውም ነጥብ ይጫኑ (${count} ማእከላት)`,
    emptyState: "ምንም የስቴም ማእከል አልተገኘም። ከአስተዳዳሪ ፓነል ያክሉ።",
    infoTitle: "የስቴም ማእከል መረጃ",
    name: "ስም:",
    host: "አስተናጋጅ:",
    city: "ከተማ:",
    country: "አገር:",
    close: "ዝጋ",
  },
};
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface StemCenter {
  id: string;
  name: string;
  host: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  mapLink?: string;
}

// Helper function to generate or normalize Google Maps URL
const getGoogleMapsUrl = (center: StemCenter): string => {
  // If mapLink exists and is valid, use it
  if (center.mapLink && center.mapLink.trim()) {
    const link = center.mapLink.trim();
    // Ensure it's a valid Google Maps URL
    if (link.includes("google.com/maps") || link.includes("maps.google.com")) {
      return link;
    }
    // If it's not a Google Maps URL, generate one from coordinates
  }
  
  // Generate Google Maps URL from coordinates
  return `https://www.google.com/maps?q=${center.latitude},${center.longitude}`;
};

// Helper function to convert Google Maps URL to embeddable format with marker
const getGoogleMapsEmbedUrl = (center: StemCenter): string => {
  const lat = center.latitude;
  const lng = center.longitude;
  
  // Build place name for better Google Maps display
  const placeName = `${center.name}, ${center.city}, ${center.country}`;
  
  // If mapLink exists, try to extract coordinates or place name
  if (center.mapLink && center.mapLink.trim()) {
    const link = center.mapLink.trim();
    
    // If it's already an embed URL, return it
    if (link.includes("/embed")) {
      return link;
    }
    
    // Try to extract coordinates from various Google Maps URL formats
    // Format 1: https://maps.google.com/maps?q=lat,lng
    const qMatch = link.match(/[?&]q=([^&]+)/);
    if (qMatch) {
      const query = decodeURIComponent(qMatch[1]);
      // Check if it's coordinates
      const coordMatch = query.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
      if (coordMatch) {
        // Use coordinates with place name for marker
        return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=en&z=15&output=embed`;
      }
      // If it's a place name, use it
      return `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=15&output=embed`;
    }
    
    // Format 2: https://www.google.com/maps/@lat,lng,zoom
    const atMatch = link.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)(?:,(\d+))?/);
    if (atMatch) {
      const embedLat = atMatch[1];
      const embedLng = atMatch[2];
      const zoom = atMatch[3] || "15";
      // Use coordinates with place name for better marker display
      return `https://www.google.com/maps?q=${embedLat},${embedLng}&hl=en&z=${zoom}&output=embed`;
    }
  }
  
  // Generate embed URL from coordinates with place name
  // This format shows a marker at the exact location
  // Using place name helps Google Maps show the location better
  return `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&ll=${lat},${lng}&z=15&hl=en&output=embed`;
};

export function EthiopiaStemMap() {
  const { selectedLanguage } = useApp();
  const lang = selectedLanguage === "am" ? "am" : "en";
  const t = <K extends keyof typeof mapStaticText.en>(
    key: K,
    ...args: any[]
  ) => {
    const entry = mapStaticText[lang][key] ?? mapStaticText.en[key];
    return typeof entry === "function" ? entry(...args) : entry;
  };

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<StemCenter | null>(null);
  const [centers, setCenters] = useState<StemCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tileError, setTileError] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    fetchCenters();
    // Refresh centers every 5 seconds to catch new additions
    const interval = setInterval(() => {
      fetchCenters();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchCenters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/location", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const validCenters = Array.isArray(data) ? data : [];
        // Only update if centers actually changed to avoid unnecessary re-renders
        setCenters((prevCenters) => {
          if (prevCenters.length !== validCenters.length) {
            return validCenters;
          }
          // Check if any center changed
          const hasChanged = prevCenters.some((prev, index) => {
            const current = validCenters[index];
            return (
              !current ||
              prev.id !== current.id ||
              prev.latitude !== current.latitude ||
              prev.longitude !== current.longitude ||
              prev.name !== current.name
            );
          });
          return hasChanged ? validCenters : prevCenters;
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch centers:", errorData);
        setCenters([]);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
      setCenters([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize map once when container is ready
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Small delay to ensure container is fully rendered
    const initTimeout = setTimeout(() => {
      if (!mapContainer.current || map.current) return;

      try {
        // Initialize map with Ethiopia center, but will be adjusted when markers are added
        map.current = L.map(mapContainer.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([9.145, 38.7469], 6);

        // Try multiple tile providers in sequence until one works
        const tileProviders = [
          {
            name: "CartoDB Positron",
            url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
          },
          {
            name: "OpenStreetMap",
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: "abc",
          },
          {
            name: "Esri World Street Map",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
            subdomains: undefined,
          },
          {
            name: "Stamen Terrain",
            url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: "abcd",
          },
        ];

        let currentProviderIndex = 0;
        let currentTileLayer: L.TileLayer | null = null;
        let errorCount = 0;
        let tilesLoaded = false;
        const maxErrors = 3;
        const loadTimeout = 10000; // 10 seconds timeout

        const tryNextProvider = () => {
          if (currentProviderIndex >= tileProviders.length) {
            // All providers failed - show error but keep map functional
            console.error("All tile providers failed. Map will work but without background tiles.");
            setTileError(true);
            return;
          }

          const provider = tileProviders[currentProviderIndex];
          console.log(`Trying tile provider: ${provider.name}`);

          // Remove previous layer if exists
          if (currentTileLayer) {
            map.current?.removeLayer(currentTileLayer);
          }

          // Create new tile layer
          const tileLayerOptions: L.TileLayerOptions = {
            attribution: provider.attribution,
            maxZoom: 19,
            crossOrigin: true,
            errorTileUrl: "", // Don't show broken image
          };

          if (provider.subdomains) {
            tileLayerOptions.subdomains = provider.subdomains;
          }

          currentTileLayer = L.tileLayer(provider.url, tileLayerOptions);
          errorCount = 0;
          tilesLoaded = false;

          // Add to map
          currentTileLayer.addTo(map.current!);

          // Set timeout to detect if tiles aren't loading at all
          const timeoutId = setTimeout(() => {
            if (!tilesLoaded && errorCount >= maxErrors) {
              console.warn(`Provider ${provider.name} timed out, trying next...`);
              currentProviderIndex++;
              tryNextProvider();
            } else if (!tilesLoaded) {
              // If no tiles loaded and we have errors, try next provider
              console.warn(`Provider ${provider.name} appears to be blocked, trying next...`);
              currentProviderIndex++;
              tryNextProvider();
            }
          }, loadTimeout);

          // Listen for tile load success
          currentTileLayer.on("tileload", () => {
            tilesLoaded = true;
            clearTimeout(timeoutId);
            console.log(`✅ Successfully loaded tiles from ${provider.name}`);
            setTileError(false); // Clear any previous error
          });

          // Listen for tile errors
          currentTileLayer.on("tileerror", () => {
            errorCount++;
            console.warn(`Tile error from ${provider.name} (${errorCount}/${maxErrors})`);
            
            if (errorCount >= maxErrors) {
              clearTimeout(timeoutId);
              console.warn(`Provider ${provider.name} failed, trying next...`);
              currentProviderIndex++;
              tryNextProvider();
            }
          });
        };

        // Start with first provider
        tryNextProvider();

        // Wait for tiles to load before adding markers
        map.current.whenReady(() => {
          // console.log("Map initialized and ready for markers");
        });

        // console.log("Map initialized successfully");
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 100);

    // Add grow effect on hover and tooltip styles (only once)
    if (!document.getElementById("dot-marker-style")) {
      const style = document.createElement("style");
      style.id = "dot-marker-style";
      style.innerHTML = `
        .dot-marker {
          transition: transform 0.2s ease-in-out;
        }
        .dot-marker:hover {
          transform: scale(1.5);
          z-index: 1000;
        }
        .custom-marker {
          z-index: 100;
        }
        .leaflet-marker-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-tooltip {
          background: white !important;
          border: 2px solid #24C3BC !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          font-family: inherit !important;
          max-width: 250px !important;
        }
        .custom-tooltip::before {
          border-top-color: #24C3BC !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      clearTimeout(initTimeout);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when centers change
  useEffect(() => {
    if (!map.current) return;

    // Wait a bit for map to be fully ready
    const timeoutId = setTimeout(() => {
      if (!map.current) return;

      // Clear existing markers and tooltips
      markersRef.current.forEach((marker) => {
        try {
          marker.closeTooltip();
          marker.unbindTooltip();
          marker.off("click");
          marker.off("mouseover");
          marker.off("mouseout");
          marker.remove();
        } catch (error) {
          // Marker might already be removed
        }
      });
      markersRef.current = [];

      // Custom gradient dot using divIcon for animation - making it more visible
      const gradientDot = (center: StemCenter) => {
        const marker = L.marker([center.latitude, center.longitude], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `
              <div 
                style="
                  width: 24px; 
                  height: 24px; 
                  border-radius: 50%; 
                  background: radial-gradient(circle at 30% 30%, #24C3BC, #367375);
                  border: 3px solid white;
                  box-shadow: 0 3px 12px rgba(0,0,0,0.5);
                  cursor: pointer;
                  transition: transform 0.2s ease-in-out;
                  position: relative;
                " 
                class="dot-marker"
                title="${center.name}"
              >
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 8px;
                  height: 8px;
                  background: white;
                  border-radius: 50%;
                "></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        });

        // Helper function to escape HTML
        const escapeHtml = (text: string) => {
          const div = document.createElement("div");
          div.textContent = text;
          return div.innerHTML;
        };

        // Add hover tooltip with center information
        const tooltipContent = `
          <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px; color: #1e293b;">${escapeHtml(center.name)}</div>
          <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
            <div style="margin-bottom: 2px;"><strong style="color: #475569;">Host:</strong> ${escapeHtml(center.host)}</div>
            <div style="margin-bottom: 2px;"><strong style="color: #475569;">City:</strong> ${escapeHtml(center.city)}</div>
            <div><strong style="color: #475569;">Country:</strong> ${escapeHtml(center.country)}</div>
          </div>
        `;
        
        marker.bindTooltip(tooltipContent, {
          permanent: false,
          direction: "top",
          offset: [0, -10],
          className: "custom-tooltip",
          opacity: 0.95,
          interactive: true,
        });

        marker.on("click", () => {
          setSelectedCenter(center);
          map.current?.setView([center.latitude, center.longitude], 12);
        });

        // Show tooltip on hover
        marker.on("mouseover", () => {
          marker.openTooltip();
        });

        // Hide tooltip when mouse leaves
        marker.on("mouseout", () => {
          marker.closeTooltip();
        });

        return marker;
      };

      // Add markers to map
      let addedCount = 0;
      let skippedCount = 0;

      // console.log(`Attempting to add ${centers.length} markers to map`);

      centers.forEach((center, index) => {
        const lat = Number(center.latitude);
        const lng = Number(center.longitude);

        if (
          center.latitude != null &&
          center.longitude != null &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        ) {
          try {
            const marker = gradientDot(center);
            marker.addTo(map.current!);
            markersRef.current.push(marker);
            addedCount++;
          } catch (error) {
            skippedCount++;
          }
        } else {
          skippedCount++;
        }
      });

      // console.log(
      //   `✅ Map markers summary: Added ${addedCount}, Skipped ${skippedCount}, Total ${centers.length}`
      // );

      if (addedCount === 0 && centers.length > 0) {
      }

      // Fit map to show all markers if there are any
      if (addedCount > 0 && markersRef.current.length > 0) {
        try {
          const bounds = L.latLngBounds(
            markersRef.current.map((marker) => marker.getLatLng())
          );
          // Add some padding around the bounds
          // Only fit bounds if there's more than one marker, or if it's the first load
          if (markersRef.current.length > 1) {
            map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
          } else if (markersRef.current.length === 1) {
            const singleMarker = markersRef.current[0];
            map.current?.setView(singleMarker.getLatLng(), 12);
          }
        } catch (error) {
          console.error("Error fitting map bounds:", error);
          // Fallback: if only one marker, zoom to it
          if (markersRef.current.length === 1) {
            const singleMarker = markersRef.current[0];
            map.current?.setView(singleMarker.getLatLng(), 12);
          }
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [centers, isLoading]);

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {t("badge")}
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-4xl md:text-4xl font-bold bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text">
                {t("heading", centers.length)}
              </h2>
              <Button
                onClick={fetchCenters}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="bg-white hover:bg-gray-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                {t("refresh")}
              </Button>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("description", centers.length)}
            </p>
            <div className="w-24 h-1.5 mx-auto rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mt-6" />
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative">
            <div className="relative w-full h-96 md:h-[600px] bg-gradient-to-br from-slate-50 to-slate-100">
              {/* Always render map container, show loading overlay if needed */}
              <div ref={mapContainer} className="w-full h-full" />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm z-30">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#367375] mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">
                      {t("loadingMap")}
                    </p>
                  </div>
                </div>
              )}

              {!selectedCenter && !isLoading && centers.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-muted-foreground border border-slate-200 z-40">
                  {t("clickHint", centers.length)}
                </div>
              )}

              {!isLoading && centers.length === 0 && (
                <div className="absolute bottom-4 left-4 bg-yellow-50/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-yellow-800 border border-yellow-200 z-40">
                  {t("emptyState")}
                </div>
              )}

              {tileError && (
                <div className="absolute top-4 left-4 bg-amber-50/95 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-amber-800 border border-amber-300 z-40 max-w-xs shadow-lg">
                  <p className="font-semibold mb-1 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Map Background Unavailable</span>
                  </p>
                  <p className="text-xs mt-1">
                    Map tiles cannot be loaded due to network restrictions. The markers and locations are still fully functional - you can zoom, pan, and click on markers to see details.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Popup for selected center */}
          {selectedCenter && (
            <div className="fixed top-0 left-0 right-0 flex items-start justify-center pt-8 pb-8 pointer-events-none z-[9999] overflow-y-auto max-h-screen">
              <div className="pointer-events-auto bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 border-2 border-[#24C3BC] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                      <span className="text-white text-lg font-bold">📍</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {t("infoTitle")}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCenter(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-1">{t("name")}</p>
                    <p className="text-foreground font-semibold">
                      {selectedCenter.name}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-1">{t("host")}</p>
                    <p className="text-foreground font-semibold">
                      {selectedCenter.host}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">{t("city")}</p>
                      <p className="text-foreground font-semibold">
                        {selectedCenter.city}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">{t("country")}</p>
                      <p className="text-foreground font-semibold">
                        {selectedCenter.country}
                      </p>
                    </div>
                  </div>
                  {/* Embedded Google Maps with exact location marker */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-sm text-muted-foreground mb-2 font-medium flex items-center gap-2">
                      <span>📍</span>
                      <span>Exact Location on Google Maps</span>
                    </p>
                    <div className="w-full h-80 rounded-lg overflow-hidden border-2 border-slate-300 shadow-inner">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={getGoogleMapsEmbedUrl(selectedCenter)}
                        title={`Google Maps location for ${selectedCenter.name}`}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        📍 Marker shows exact location: {selectedCenter.latitude.toFixed(6)}, {selectedCenter.longitude.toFixed(6)}
                      </p>
                      <a
                        href={getGoogleMapsUrl(selectedCenter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1 transition-colors hover:underline"
                      >
                        <span>🗺️</span>
                        <span>Open Full Map</span>
                        <span className="text-xs opacity-70">↗</span>
                      </a>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Coordinates:</span> {selectedCenter.latitude.toFixed(6)},{" "}
                      {selectedCenter.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCenter(null)}
                  className="w-full px-4 py-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
