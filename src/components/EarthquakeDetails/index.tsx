import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Earthquake } from "@/types/earthquake";
import { getMagnitudeInfo } from "@/lib/earthquake-utils";
import {
  X,
  MapPin,
  Clock,
  Compass,
  ArrowDownToLine,
  AlertTriangle,
  Users,
  ExternalLink,
  Activity,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface EarthquakeDetailsProps {
  earthquake: Earthquake;
  onClose: () => void;
}

export default function EarthquakeDetails({
  earthquake,
  onClose,
}: EarthquakeDetailsProps) {
  const shouldReduceMotion = useReducedMotion();
  const magInfo = getMagnitudeInfo(earthquake.magnitude);
  const formattedDate = new Date(earthquake.time).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(earthquake.time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 12,
        scale: shouldReduceMotion ? 1 : 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 12,
        scale: shouldReduceMotion ? 1 : 0.97,
      }}
      transition={{
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[380px] z-20 pointer-events-auto"
    >
      <Card className="shadow-xl border-border/90 bg-card/95 backdrop-blur-md overflow-hidden">
        {/* Color accent bar matching severity */}
        <div className={`h-1.5 w-full ${magInfo.bgClass} border-b ${magInfo.borderClass}`} />

        <CardHeader className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={magInfo.severity} size="lg" className="font-bold text-sm">
                <Activity className="size-3.5" />
                M {earthquake.magnitude.toFixed(1)}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize font-medium">
                {magInfo.label}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-7 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Close details"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="mt-2.5 flex items-start gap-1.5 text-foreground">
            <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-sm font-semibold leading-snug line-clamp-2">
              {earthquake.place}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <ArrowDownToLine className="size-3" /> Focal Depth
              </span>
              <p className="font-semibold text-foreground text-sm">
                {earthquake.coordinates[2].toFixed(1)} km
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <Compass className="size-3" /> Coordinates
              </span>
              <p className="font-medium text-foreground truncate">
                {earthquake.coordinates[1].toFixed(2)}°N, {earthquake.coordinates[0].toFixed(2)}°E
              </p>
            </div>
          </div>

          {/* Time & Reports */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5" /> Date & Time
              </span>
              <span className="font-medium text-foreground text-right">
                {formattedDate} • {formattedTime}
              </span>
            </div>

            {earthquake.felt !== null && earthquake.felt !== undefined && earthquake.felt > 0 && (
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="size-3.5" /> Felt Reports
                </span>
                <span className="font-medium text-foreground">
                  {earthquake.felt} citizen reports
                </span>
              </div>
            )}
          </div>

          {/* Tsunami Alert notification if triggered */}
          {earthquake.tsunami > 0 && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-mag-severe-bg text-mag-severe-foreground border border-mag-severe-border text-xs font-medium">
              <AlertTriangle className="size-4 shrink-0 text-mag-severe" />
              <span>Tsunami advisory recorded for this event</span>
            </div>
          )}

          {/* USGS Link */}
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center text-xs h-8 font-medium gap-1.5"
              asChild
            >
              <a
                href={earthquake.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Full USGS Event Report</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
