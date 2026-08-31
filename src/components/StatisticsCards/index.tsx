import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Earthquake } from "@/types/earthquake";
import { getMagnitudeInfo } from "@/lib/earthquake-utils";
import { Activity, Flame, Clock, ArrowDownToLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StatisticsCardsProps {
  earthquakes: Earthquake[];
  loading: boolean;
}

export default function StatisticsCards({
  earthquakes,
  loading,
}: StatisticsCardsProps) {
  const maxMagnitude =
    earthquakes.length > 0
      ? Math.max(...earthquakes.map((eq) => eq.magnitude))
      : 0;

  const maxMagInfo = earthquakes.length > 0 ? getMagnitudeInfo(maxMagnitude) : null;

  const latestEarthquake =
    earthquakes.length > 0
      ? earthquakes.reduce((latest, current) =>
          current.time > latest.time ? current : latest
        )
      : null;

  const avgDepth =
    earthquakes.length > 0
      ? (
          earthquakes.reduce((sum, eq) => sum + eq.coordinates[2], 0) /
          earthquakes.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {/* 1. Total Earthquakes */}
      <Card className="min-h-[108px] flex flex-col justify-between hover:border-border transition-colors">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Events
            </span>
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Activity className="size-3.5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-total"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-1.5 py-0.5"
              >
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-28" />
              </motion.div>
            ) : (
              <motion.div
                key="loaded-total"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="text-2xl font-bold tracking-tight text-foreground leading-none">
                  {earthquakes.length}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Seismic events in window
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* 2. Strongest Event */}
      <Card className="min-h-[108px] flex flex-col justify-between hover:border-border transition-colors">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Strongest
            </span>
            <div
              className={`size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                maxMagInfo && !loading
                  ? maxMagInfo.bgClass + " " + maxMagInfo.textClass
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Flame className="size-3.5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-strongest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-1.5 py-0.5"
              >
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-3 w-32" />
              </motion.div>
            ) : earthquakes.length > 0 ? (
              <motion.div
                key="loaded-strongest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    M {maxMagnitude.toFixed(1)}
                  </span>
                  <span className={`text-[11px] font-semibold ${maxMagInfo?.textClass}`}>
                    ({maxMagInfo?.label})
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Highest recorded magnitude
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty-strongest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="text-xl font-bold text-muted-foreground leading-none">—</div>
                <p className="text-[11px] text-muted-foreground">No events recorded</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* 3. Most Recent Event */}
      <Card className="min-h-[108px] flex flex-col justify-between hover:border-border transition-colors">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Latest Activity
            </span>
            <div className="size-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
              <Clock className="size-3.5 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-recent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-1.5 py-0.5"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-40" />
              </motion.div>
            ) : latestEarthquake ? (
              <motion.div
                key="loaded-recent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="text-sm font-semibold text-foreground truncate leading-snug">
                  {new Date(latestEarthquake.time).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(latestEarthquake.time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {latestEarthquake.place}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty-recent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="text-xl font-bold text-muted-foreground leading-none">—</div>
                <p className="text-[11px] text-muted-foreground">No recent events</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* 4. Average Depth */}
      <Card className="min-h-[108px] flex flex-col justify-between hover:border-border transition-colors">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Avg Hypocenter Depth
            </span>
            <div className="size-7 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
              <ArrowDownToLine className="size-3.5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-depth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-1.5 py-0.5"
              >
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-28" />
              </motion.div>
            ) : earthquakes.length > 0 ? (
              <motion.div
                key="loaded-depth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="text-2xl font-bold tracking-tight text-foreground leading-none">
                  {avgDepth}{" "}
                  <span className="text-xs font-normal text-muted-foreground">km</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Mean focal depth
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty-depth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                <div className="text-xl font-bold text-muted-foreground leading-none">—</div>
                <p className="text-[11px] text-muted-foreground">No depth data</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
