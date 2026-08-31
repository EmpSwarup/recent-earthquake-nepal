import { useEffect, useState, useCallback } from "react";
import { AlertCircle, Calendar, RefreshCw, List, Map as MapIcon } from "lucide-react";
import MapComponent from "../MapComponent";
import FilterTabs from "../FilterTabs";
import StatisticsCards from "../StatisticsCards";
import EarthquakeList from "../EarthquakeList";
import MagnitudeLegend from "../MagnitudeLegend";
import Footer from "../Footer";
import Navbar from "../Navbar";
import EarthquakeDetails from "../EarthquakeDetails";
import { Button } from "@/components/ui/button";
import { Earthquake, DATE_FILTERS } from "@/types/earthquake";
import {
  fetchEarthquakesForRange,
  getCachedEarthquakesForRange,
  resolveDefaultTimeRange,
  clearEarthquakeCache,
} from "@/services/earthquake-api";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function EarthquakeMap() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("day");
  const [selectedEarthquake, setSelectedEarthquake] =
    useState<Earthquake | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const shouldReduceMotion = useReducedMotion();

  // 1. Initial Smart Resolution on Mount
  useEffect(() => {
    let isCancelled = false;

    async function initialize() {
      setLoading(true);
      setError(null);

      try {
        const { resolvedFilter, data } = await resolveDefaultTimeRange();

        if (!isCancelled) {
          setActiveFilter(resolvedFilter);
          setEarthquakes(data);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error("Initial range resolution failed:", err);
          setError("Unable to connect to USGS telemetry feed. Please verify your connection.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Direct manual tab filter selection
  const handleFilterSelect = useCallback(async (newFilterId: string, bypassCache = false) => {
    setActiveFilter(newFilterId);
    setError(null);

    // Fast synchronous path if already in session cache
    const cached = getCachedEarthquakesForRange(newFilterId);
    if (cached && !bypassCache) {
      setEarthquakes(cached);
      setLoading(false);
      setSelectedEarthquake((prev) =>
        prev && cached.some((eq) => eq.id === prev.id) ? prev : null
      );
      return;
    }

    setLoading(true);
    try {
      const data = await fetchEarthquakesForRange(newFilterId, { bypassCache });
      setEarthquakes(data);

      setSelectedEarthquake((prev) =>
        prev && data.some((eq) => eq.id === prev.id) ? prev : null
      );
    } catch (err: unknown) {
      console.error(`Failed to fetch earthquakes for ${newFilterId}:`, err);
      setError(`Failed to retrieve data for the selected period. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkerClick = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake);
  };

  const closeDetails = () => {
    setSelectedEarthquake(null);
  };

  const handleRetry = () => {
    clearEarthquakeCache();
    handleFilterSelect(activeFilter, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col min-h-screen">
      {/* 1. Header / Navbar */}
      <Navbar totalCount={earthquakes.length} loading={loading} />

      <main className="flex flex-col gap-4 flex-grow">
        {/* 2. Controls / Filter Bar & View Mode Toggle */}
        <div className="space-y-2">
          <FilterTabs
            activeFilter={activeFilter}
            setActiveFilter={handleFilterSelect}
            loading={loading}
            totalCount={earthquakes.length}
          />

          <div className="flex items-center justify-between px-1">
            <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              <span>
                Active Range:{" "}
                <strong className="text-foreground">
                  {DATE_FILTERS.find((f) => f.id === activeFilter)?.label}
                </strong>
              </span>
              {!loading && !error && (
                <>
                  <span className="text-border">•</span>
                  <span>{earthquakes.length} detected</span>
                </>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "map"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapIcon className="size-3" />
                <span>Map</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Content: Map Container or List View with fixed height to prevent layout shift */}
        <div className="h-[460px] md:h-[540px] lg:h-[580px] relative w-full rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === "map" ? (
              <motion.div
                key="view-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full relative"
              >
                {/* MapComponent stays mounted */}
                <MapComponent
                  earthquakes={earthquakes}
                  onMarkerClick={handleMarkerClick}
                  isDataLoading={loading}
                />

                {/* In-Map Error State Overlay */}
                <AnimatePresence>
                  {error && !loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-4 z-20 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-card/95 backdrop-blur-md border border-destructive/30 p-5 rounded-xl shadow-lg max-w-md text-center pointer-events-auto space-y-3">
                        <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                          <AlertCircle className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            Data Fetch Failed
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetry}
                          className="text-xs gap-1.5"
                        >
                          <RefreshCw className="size-3.5" />
                          <span>Retry Request</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* In-Map Empty State Overlay */}
                <AnimatePresence>
                  {!error && !loading && earthquakes.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-4 z-20 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-card/95 backdrop-blur-md border border-border p-5 rounded-xl shadow-lg max-w-sm text-center pointer-events-auto space-y-3">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                          <Calendar className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            No Recent Earthquakes
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            No earthquakes recorded in the Nepal region for{" "}
                            {DATE_FILTERS.find((f) => f.id === activeFilter)?.label.toLowerCase()}.
                          </p>
                        </div>
                        <div className="flex justify-center gap-2 pt-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleFilterSelect("month")}
                            className="text-xs"
                          >
                            This Month
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleFilterSelect("year")}
                            className="text-xs"
                          >
                            This Year
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Earthquake Details Drawer with AnimatePresence */}
                <AnimatePresence>
                  {selectedEarthquake && (
                    <EarthquakeDetails
                      earthquake={selectedEarthquake}
                      onClose={closeDetails}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="view-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full bg-card rounded-xl border border-border p-4 overflow-y-auto"
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Recorded Earthquakes List
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Click any event to inspect its parameters on the map
                  </p>
                </div>

                {error && !loading ? (
                  <div className="p-6 text-center space-y-3">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                    <Button variant="outline" size="sm" onClick={handleRetry} className="text-xs">
                      <RefreshCw className="size-3.5 mr-1" /> Retry
                    </Button>
                  </div>
                ) : (
                  <EarthquakeList
                    earthquakes={earthquakes}
                    loading={loading}
                    selectedEarthquakeId={selectedEarthquake?.id}
                    onSelectEarthquake={(eq) => {
                      setSelectedEarthquake(eq);
                      setViewMode("map");
                    }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Magnitude Scale Legend Card */}
        <MagnitudeLegend />

        {/* 5. Statistics & Telemetry Cards */}
        <div className="mt-1">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Regional Seismic Metrics
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {loading ? "Calculating..." : `${earthquakes.length} events analyzed`}
            </span>
          </div>
          <StatisticsCards earthquakes={earthquakes} loading={loading} />
        </div>
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
