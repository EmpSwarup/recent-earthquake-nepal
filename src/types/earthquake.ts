export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  coordinates: [number, number, number]; // [longitude, latitude, depth]
  url: string;
  felt: number | null;
  tsunami: number;
}

export interface USGSFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    felt: number | null;
    tsunami: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

export interface USGSResponse {
  type: string;
  features: USGSFeature[];
}

export interface DateFilterOption {
  id: string;
  label: string;
  days: number;
}

export const DATE_FILTERS: DateFilterOption[] = [
  { id: "day", label: "Past Day", days: 1 },
  { id: "week", label: "This Week", days: 7 },
  { id: "month", label: "This Month", days: 30 },
  { id: "year", label: "This Year", days: 365 },
];
