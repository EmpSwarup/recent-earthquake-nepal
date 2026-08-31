import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MAGNITUDE_THRESHOLDS } from "@/config/magnitude-thresholds";
import { Info } from "lucide-react";
import { IoWarning } from "react-icons/io5";
import { RiPulseFill } from "react-icons/ri";
import { MdSensors } from "react-icons/md";
import { FaWaveSquare } from "react-icons/fa6";
import { motion, useReducedMotion } from "framer-motion";

export default function MagnitudeLegend() {
  const shouldReduceMotion = useReducedMotion();

  const getIcon = (id: string) => {
    switch (id) {
      case "severe":
        return <IoWarning className="size-3.5" />;
      case "strong":
        return <RiPulseFill className="size-3.5" />;
      case "moderate":
        return <MdSensors className="size-3.5" />;
      default:
        return <FaWaveSquare className="size-3" />;
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-md border border-border shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Info className="size-3.5 text-primary" />
          <span>Magnitude Scale Legend</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MAGNITUDE_THRESHOLDS.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: shouldReduceMotion ? 0 : i * 0.04,
                ease: [0.25, 1, 0.5, 1],
              }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-border/50 bg-muted/30 transition-shadow hover:shadow-xs"
            >
              <div
                className="size-6 rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ background: level.markerBg }}
              >
                {getIcon(level.id)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <Badge
                    variant={level.badgeVariant}
                    size="sm"
                    className="px-1.5 py-0 text-[10px] font-bold"
                  >
                    {level.rangeLabel}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">
                  {level.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
