import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Earthquake } from "@/types/earthquake";

interface StatisticsCardsProps {
  earthquakes: Earthquake[];
  loading: boolean;
}

export default function StatisticsCards({
  earthquakes,
  loading,
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      <Card>
        <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-sm md:text-lg">
            Total Earthquakes
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            In selected period
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <p className="text-xl md:text-3xl font-bold">{earthquakes.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-sm md:text-lg">Strongest</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Highest magnitude
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          {loading ? (
            <Skeleton className="h-6 md:h-8 w-16 md:w-20" />
          ) : (
            <p className="text-xl md:text-3xl font-bold">
              {earthquakes.length > 0
                ? Math.max(...earthquakes.map((eq) => eq.magnitude)).toFixed(1)
                : "N/A"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-sm md:text-lg">Most Recent</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Latest earthquake
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          {loading ? (
            <Skeleton className="h-6 md:h-8 w-full" />
          ) : (
            <p className="text-xs md:text-sm font-medium truncate">
              {earthquakes.length > 0
                ? new Date(
                    Math.max(...earthquakes.map((eq) => eq.time))
                  ).toLocaleString()
                : "No data available"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-sm md:text-lg">Average Depth</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            In kilometers
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          {loading ? (
            <Skeleton className="h-6 md:h-8 w-16 md:w-20" />
          ) : (
            <p className="text-xl md:text-3xl font-bold">
              {earthquakes.length > 0
                ? (
                    earthquakes.reduce(
                      (sum, eq) => sum + eq.coordinates[2],
                      0
                    ) / earthquakes.length
                  ).toFixed(1)
                : "N/A"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
