import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Earthquake } from "@/types/earthquake";
import { X } from "lucide-react"; // Import X icon from lucide-react

interface EarthquakeDetailsProps {
  earthquake: Earthquake;
  onClose: () => void;
}

export default function EarthquakeDetails({
  earthquake,
  onClose,
}: EarthquakeDetailsProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-10">
      <Card className="shadow-lg">
        <CardHeader className="pb-2 relative">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base md:text-lg truncate">
                Magnitude {earthquake.magnitude.toFixed(1)}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm truncate">
                {earthquake.place}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 flex-shrink-0 ml-2"
              aria-label="Close details"
            >
              <X className="h-4 w-4" /> {/* Using X icon instead of ✕ */}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Rest of your content remains the same */}
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="font-medium">
                {new Date(earthquake.time).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coordinates:</span>
              <span className="font-medium">
                {earthquake.coordinates[1].toFixed(4)},{" "}
                {earthquake.coordinates[0].toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Depth:</span>
              <span className="font-medium">
                {earthquake.coordinates[2].toFixed(2)} km
              </span>
            </div>
            {earthquake.felt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Felt Reports:</span>
                <span className="font-medium">{earthquake.felt}</span>
              </div>
            )}
            {earthquake.tsunami > 0 && (
              <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-xs md:text-sm text-center">
                Tsunami alert was issued
              </div>
            )}
            <div className="mt-2 pt-2 border-t">
              <a
                href={earthquake.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs md:text-sm"
              >
                View full details on USGS
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
