import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Earthquake } from "@/types/earthquake";
import { createPopupContent } from "@/components/popup-content";
import { createEarthquakeMarkerElement } from "@/components/EarthquakeMarker";
import { Loader2, Map as MapIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MapComponentProps {
  earthquakes: Earthquake[];
  onMarkerClick: (earthquake: Earthquake) => void;
  isDataLoading?: boolean;
}

export default function MapComponent({
  earthquakes,
  onMarkerClick,
  isDataLoading = false,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const [isMapReady, setIsMapReady] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

  // Render markers cleanly and synchronously
  const renderMarkers = useCallback(() => {
    if (!map.current) return;

    // Clear any pending staggered entrance timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // Remove all existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (!earthquakes || earthquakes.length === 0) return;

    // Sort earthquakes descending by magnitude so severe quakes render on top and animate first
    const sortedQuakes = [...earthquakes].sort((a, b) => b.magnitude - a.magnitude);

    sortedQuakes.forEach((earthquake, index) => {
      if (!earthquake.coordinates || earthquake.coordinates.length < 2) return;

      // Create custom icon marker element
      const el = createEarthquakeMarkerElement(earthquake);
      el.style.opacity = "0";
      el.style.transform = "scale(0.5)";
      el.style.transition =
        "opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1), transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)";

      const popupContent = createPopupContent(earthquake, () =>
        onMarkerClick(earthquake)
      );

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: "320px",
        offset: 18,
        className: "earthquake-popup-container",
      }).setDOMContent(popupContent);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([earthquake.coordinates[0], earthquake.coordinates[1]])
        .setPopup(popup)
        .addTo(map.current!);

      // Hover shows tooltip, leave closes tooltip
      el.addEventListener("mouseenter", () => {
        if (!popup.isOpen()) {
          marker.togglePopup();
        }
      });

      el.addEventListener("mouseleave", () => {
        if (popup.isOpen()) {
          marker.togglePopup();
        }
      });

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClick(earthquake);
      });

      markersRef.current[earthquake.id] = marker;

      // Staggered soft scale/fade-in entrance (150-300ms window)
      const delay = Math.min(index * 25, 300);
      const timeout = setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
      }, delay);

      timeoutsRef.current.push(timeout);
    });

    // Fit map bounds to encompass all events
    if (earthquakes.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      earthquakes.forEach((earthquake) => {
        bounds.extend([earthquake.coordinates[0], earthquake.coordinates[1]]);
      });

      map.current.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 8.5,
        duration: 700,
      });
    }
  }, [earthquakes, onMarkerClick]);

  // Initialize MapLibre map instance once
  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [84.124, 28.3949],
      zoom: 6,
      attributionControl: {
        compact: true,
        customAttribution: "© Earthquake Data from USGS",
      },
    });

    mapInstance.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "top-right"
    );
    mapInstance.addControl(
      new maplibregl.ScaleControl({ unit: "metric" }),
      "bottom-left"
    );

    mapInstance.on("load", () => {
      setIsMapReady(true);
    });

    map.current = mapInstance;

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey]);

  // Re-render markers synchronously whenever earthquakes change
  useEffect(() => {
    renderMarkers();
  }, [renderMarkers]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border shadow-xs bg-muted/20">
      {/* 1. Underlying MapLibre Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* 2. Pre-initialization Map Skeleton Placeholder */}
      {!isMapReady && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-card">
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapIcon className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">
                Initializing Map Engine...
              </p>
              <Skeleton className="h-3 w-48 mx-auto" />
            </div>
          </div>
        </div>
      )}

      {/* 3. In-Map Live Data Updating Pill Overlay */}
      {isMapReady && isDataLoading && (
        <div className="absolute top-3 left-3 z-20 pointer-events-none animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-sm text-xs font-medium text-foreground">
            <Loader2 className="size-3.5 animate-spin text-primary shrink-0" />
            <span>Updating seismic telemetry...</span>
          </div>
        </div>
      )}
    </div>
  );
}
