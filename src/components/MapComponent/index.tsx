import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Earthquake } from "@/types/earthquake";
import { createPopupContent } from "@/components/popup-content";

interface MapComponentProps {
  earthquakes: Earthquake[];
  onMarkerClick: (earthquake: Earthquake) => void;
}

export default function MapComponent({
  earthquakes,
  onMarkerClick,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [84.124, 28.3949],
      zoom: 6,
      attributionControl: {
        compact: false,
        customAttribution: "© Earthquake Data from USGS",
      },
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(new maplibregl.ScaleControl(), "bottom-left");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when earthquakes data changes
  useEffect(() => {
    if (!map.current || !earthquakes.length) return;

    if (!map.current.loaded()) {
      map.current.on("load", () => updateMarkers());
    } else {
      updateMarkers();
    }

    function updateMarkers() {
      if (!map.current) return;

      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};

      earthquakes.forEach((earthquake) => {
        if (!earthquake.coordinates || earthquake.coordinates.length < 2)
          return;

        const el = document.createElement("div");
        el.className = "earthquake-marker";

        const size = Math.max(20, Math.min(40, earthquake.magnitude * 4));

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
        el.style.cursor = "pointer";

        const popupContent = createPopupContent(earthquake, () =>
          onMarkerClick(earthquake)
        );

        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: true,
          maxWidth: "280px",
          offset: 15,
          className: "earthquake-popup-container",
        }).setDOMContent(popupContent);

        const marker = new maplibregl.Marker(el)
          .setLngLat([earthquake.coordinates[0], earthquake.coordinates[1]])
          .setPopup(popup)
          .addTo(map.current!);

        el.addEventListener("click", () => {
          marker.togglePopup();
          onMarkerClick(earthquake);
        });

        markersRef.current[earthquake.id] = marker;
      });

      if (
        earthquakes.length > 0 &&
        Object.keys(markersRef.current).length > 0
      ) {
        const bounds = new maplibregl.LngLatBounds();

        earthquakes.forEach((earthquake) => {
          bounds.extend([earthquake.coordinates[0], earthquake.coordinates[1]]);
        });

        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 9,
        });
      }
    }
  }, [earthquakes, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-md overflow-hidden"
    />
  );
}
