import { Earthquake } from "@/types/earthquake";
import { getMagnitudeInfo } from "@/lib/earthquake-utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, ArrowDownToLine, MapPin, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  loading: boolean;
  selectedEarthquakeId?: string | null;
  onSelectEarthquake: (earthquake: Earthquake) => void;
}

export default function EarthquakeList({
  earthquakes,
  loading,
  selectedEarthquakeId,
  onSelectEarthquake,
}: EarthquakeListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading-skeletons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-2"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-border bg-card shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="size-10 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-12 shrink-0" />
            </div>
          ))}
        </motion.div>
      ) : earthquakes.length === 0 ? (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl border border-dashed border-border bg-card/50 text-center space-y-2"
        >
          <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Radio className="size-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No seismic events recorded
          </p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            No earthquakes were detected in Nepal and surrounding regions for this date filter.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="earthquake-items"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-2 max-h-[320px] overflow-y-auto pr-1"
        >
          {earthquakes.map((eq, index) => {
            const magInfo = getMagnitudeInfo(eq.magnitude);
            const isSelected = selectedEarthquakeId === eq.id;

            return (
              <motion.button
                key={eq.id}
                type="button"
                onClick={() => onSelectEarthquake(eq)}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.22,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.25),
                  ease: [0.25, 1, 0.5, 1],
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors duration-150 flex items-center justify-between gap-3 cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                    : "border-border bg-card hover:bg-accent/40 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      "size-10 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 border",
                      magInfo.bgClass,
                      magInfo.borderClass,
                      magInfo.textClass
                    )}
                  >
                    <span className="text-[10px] uppercase font-normal tracking-tight">Mag</span>
                    <span className="text-xs leading-none">{eq.magnitude.toFixed(1)}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground truncate">
                      <MapPin className="size-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{eq.place}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(eq.time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowDownToLine className="size-3" />
                        {eq.coordinates[2].toFixed(1)} km
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant={magInfo.severity} size="sm" className="shrink-0 font-medium">
                  {magInfo.label}
                </Badge>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
