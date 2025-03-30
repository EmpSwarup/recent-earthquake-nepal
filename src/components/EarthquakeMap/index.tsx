import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import MapComponent from "../MapComponent";
import FilterTabs from "../FilterTabs";
import StatisticsCards from "../StatisticsCards";
import Footer from "../Footer";
import EarthquakeDetails from "../EarthquakeDetails";
import { Earthquake } from "@/types/earthquake";

// Date filter options
export const dateFilters = [
  { id: "day", label: "Past Day", days: 1 },
  { id: "week", label: "This Week", days: 7 },
  { id: "month", label: "This Month", days: 30 },
  { id: "year", label: "This Year", days: 365 },
];

export default function EarthquakeMap() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("week");
  const [selectedEarthquake, setSelectedEarthquake] =
    useState<Earthquake | null>(null);

  // Fetch earthquake data based on the selected filter
  useEffect(() => {
    const fetchEarthquakeData = async () => {
      setLoading(true);
      try {
        const filter = dateFilters.find((f) => f.id === activeFilter);
        if (!filter) return;

        const startTime = new Date();
        startTime.setDate(startTime.getDate() - filter.days);

        const response = await fetch(
          `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime.toISOString()}&minlatitude=26&maxlatitude=30&minlongitude=80&maxlongitude=89`
        );

        const data = await response.json();

        const transformedData = data.features.map((feature: any) => ({
          id: feature.id,
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          coordinates: feature.geometry.coordinates,
          url: feature.properties.url,
          felt: feature.properties.felt,
          tsunami: feature.properties.tsunami,
        }));

        setEarthquakes(transformedData);
      } catch (error) {
        console.error("Error fetching earthquake data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakeData();
  }, [activeFilter]);

  const handleMarkerClick = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake);
  };

  const closeDetails = () => {
    setSelectedEarthquake(null);
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-2 md:py-4 flex flex-col min-h-screen">
      <div className="mb-3 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Recent Earthquake in Nepal Tracker
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Visualize recent earthquake activity in Nepal and surrounding regions
        </p>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          loading={loading}
        />

        <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-280px)] relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/30">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          ) : (
            <>
              <MapComponent
                earthquakes={earthquakes}
                onMarkerClick={handleMarkerClick}
              />
              {selectedEarthquake && (
                <EarthquakeDetails
                  earthquake={selectedEarthquake}
                  onClose={closeDetails}
                />
              )}
            </>
          )}
        </div>

        <StatisticsCards earthquakes={earthquakes} loading={loading} />
      </div>

      <Footer />
    </div>
  );
}
