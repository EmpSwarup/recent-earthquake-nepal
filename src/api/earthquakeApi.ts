export interface Earthquake {
  id: string;
  geometry: {
    coordinates: [number, number, number];
  };
  properties: {
    mag: number;
    place: string;
    time: number;
  };
}

export const fetchEarthquakes = async (): Promise<Earthquake[]> => {
  const response = await fetch(
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-01-01&endtime=2025-03-23&minmagnitude=4.5&latitude=28.3949&longitude=84.1240&maxradiuskm=500"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch earthquake data");
  }
  const data = await response.json();
  return data.features;
};
