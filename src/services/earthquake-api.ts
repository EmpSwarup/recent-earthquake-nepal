import { Earthquake, USGSResponse, USGSFeature, DATE_FILTERS } from "@/types/earthquake";

// In-session cache for all date ranges
const sessionCache: Record<string, { data: Earthquake[]; timestamp: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh cache

// Prevent duplicate concurrent full fetches
let pendingFetchPromise: Promise<Record<string, Earthquake[]>> | null = null;

/**
 * Transforms USGS GeoJSON feature to Earthquake domain model
 */
function transformFeature(feature: USGSFeature): Earthquake {
  return {
    id: feature.id,
    magnitude: feature.properties?.mag ?? 0,
    place: feature.properties?.place ?? "Unknown location",
    time: feature.properties?.time ?? Date.now(),
    coordinates: feature.geometry?.coordinates ?? [0, 0, 0],
    url: feature.properties?.url ?? "",
    felt: feature.properties?.felt ?? null,
    tsunami: feature.properties?.tsunami ?? 0,
  };
}

/**
 * Fetches 1 year of seismic data from USGS across Nepal coordinates and populates all 4 time filters
 */
export async function refreshAllRangesData(options?: { bypassCache?: boolean }): Promise<Record<string, Earthquake[]>> {
  const now = Date.now();
  const isCacheValid =
    !options?.bypassCache &&
    DATE_FILTERS.every((f) => sessionCache[f.id] && now - sessionCache[f.id].timestamp < CACHE_TTL_MS);

  if (isCacheValid) {
    return {
      day: sessionCache["day"].data,
      week: sessionCache["week"].data,
      month: sessionCache["month"].data,
      year: sessionCache["year"].data,
    };
  }

  if (pendingFetchPromise && !options?.bypassCache) {
    return pendingFetchPromise;
  }

  const startTime = new Date(now - 365 * 24 * 60 * 60 * 1000);
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime.toISOString()}&minlatitude=26&maxlatitude=30&minlongitude=80&maxlongitude=89`;

  pendingFetchPromise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
      }

      const data: USGSResponse = await response.json();
      const allEvents: Earthquake[] = (data.features || []).map(transformFeature);

      // Pre-compute and populate cache for each time filter
      const dayCutoff = now - 1 * 24 * 60 * 60 * 1000;
      const weekCutoff = now - 7 * 24 * 60 * 60 * 1000;
      const monthCutoff = now - 30 * 24 * 60 * 60 * 1000;
      const yearCutoff = now - 365 * 24 * 60 * 60 * 1000;

      const dayEvents = allEvents.filter((eq) => eq.time >= dayCutoff);
      const weekEvents = allEvents.filter((eq) => eq.time >= weekCutoff);
      const monthEvents = allEvents.filter((eq) => eq.time >= monthCutoff);
      const yearEvents = allEvents.filter((eq) => eq.time >= yearCutoff);

      sessionCache["day"] = { data: dayEvents, timestamp: now };
      sessionCache["week"] = { data: weekEvents, timestamp: now };
      sessionCache["month"] = { data: monthEvents, timestamp: now };
      sessionCache["year"] = { data: yearEvents, timestamp: now };

      return {
        day: dayEvents,
        week: weekEvents,
        month: monthEvents,
        year: yearEvents,
      };
    } finally {
      pendingFetchPromise = null;
    }
  })();

  return pendingFetchPromise;
}

/**
 * Returns cached earthquakes synchronously if present, otherwise returns null
 */
export function getCachedEarthquakesForRange(filterId: string): Earthquake[] | null {
  const entry = sessionCache[filterId];
  return entry ? entry.data : null;
}

/**
 * Fetches earthquake data for a specific date filter option
 */
export async function fetchEarthquakesForRange(
  filterId: string,
  options?: { bypassCache?: boolean }
): Promise<Earthquake[]> {
  const cached = getCachedEarthquakesForRange(filterId);
  if (cached && !options?.bypassCache) {
    return cached;
  }

  const allData = await refreshAllRangesData(options);
  return allData[filterId] || [];
}

export interface DefaultRangeResolution {
  resolvedFilter: string;
  data: Earthquake[];
}

/**
 * Resolves the default time range on initial load:
 * 1. "Past Day" (day)
 * 2. "This Week" (week)
 * 3. "This Month" (month)
 * 4. "This Year" (year)
 */
export async function resolveDefaultTimeRange(options?: { bypassCache?: boolean }): Promise<DefaultRangeResolution> {
  const allData = await refreshAllRangesData(options);

  if (allData.day && allData.day.length > 0) {
    return { resolvedFilter: "day", data: allData.day };
  }
  if (allData.week && allData.week.length > 0) {
    return { resolvedFilter: "week", data: allData.week };
  }
  if (allData.month && allData.month.length > 0) {
    return { resolvedFilter: "month", data: allData.month };
  }
  if (allData.year && allData.year.length > 0) {
    return { resolvedFilter: "year", data: allData.year };
  }

  return { resolvedFilter: "day", data: [] };
}

/**
 * Clears the session cache
 */
export function clearEarthquakeCache() {
  Object.keys(sessionCache).forEach((key) => delete sessionCache[key]);
}
