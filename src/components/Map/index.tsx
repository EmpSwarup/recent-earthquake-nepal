import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { Earthquake } from "@/api/earthquakeApi";

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { data: earthquakes, isLoading, isError } = useEarthquakes();

  useEffect(() => {
    if (!mapContainer.current) return;

    console.log("Initializing map...");
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [85.324, 27.7172],
      zoom: 6,
    });

    console.log("Map initialized:", map.current);

    map.current.addControl(new maplibregl.NavigationControl());
    // Add markers after the map is loaded
    map.current.on("load", () => {
      console.log("Map loaded, adding markers...");
      if (!earthquakes) return;

      (earthquakes as Earthquake[]).forEach((earthquake) => {
        const coordinates = earthquake.geometry.coordinates;
        if (!Array.isArray(coordinates)) {
          console.error("Invalid coordinates:", coordinates);
          return;
        }

        const [longitude, latitude] = coordinates;
        if (typeof longitude !== "number" || typeof latitude !== "number") {
          console.error("Invalid longitude or latitude:", longitude, latitude);
          return;
        }

        console.log("Adding marker at:", longitude, latitude);
        new maplibregl.Marker({ color: "#FF0000" })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) {
        console.log("Removing map...");
        map.current.remove();
      }
    };
  }, [earthquakes]);

  if (isLoading)
    return <div className="text-center p-4">Loading earthquake data...</div>;
  if (isError)
    return (
      <div className="text-center p-4 text-red-500">
        Error fetching earthquake data
      </div>
    );

  return <div ref={mapContainer} className="w-full h-[calc(100vh-8rem)]" />;
};

export default Map;
