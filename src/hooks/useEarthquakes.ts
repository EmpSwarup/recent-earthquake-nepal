import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/api/earthquakeApi";

export const useEarthquakes = () => {
  return useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
    staleTime: 1000 * 60 * 5,
  });
};
