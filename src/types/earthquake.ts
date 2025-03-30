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
