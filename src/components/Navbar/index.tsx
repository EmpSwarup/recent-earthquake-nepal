import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  totalCount?: number;
  loading?: boolean;
}

export default function Navbar({ totalCount, loading }: NavbarProps) {
  return (
    <header className="w-full pb-4 pt-1 border-b border-border/60 mb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Nepal Seismic Monitor
              </h1>
              <Badge variant="outline" className="text-[11px] font-medium border-primary/20 bg-primary/5 text-primary">
                Himalayan Belt
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Real-time USGS earthquake telemetry across Nepal and surrounding regions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Feed</span>
            {typeof totalCount === "number" && !loading && (
              <>
                <span className="text-border">•</span>
                <span className="font-semibold text-foreground">{totalCount} recorded</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
