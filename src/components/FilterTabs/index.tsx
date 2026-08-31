import { Calendar, Layers, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DATE_FILTERS } from "@/types/earthquake";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FilterTabsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  loading: boolean;
  totalCount?: number;
}

export default function FilterTabs({
  activeFilter,
  setActiveFilter,
  loading,
}: FilterTabsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-2 rounded-xl border border-border shadow-xs">
      <div className="w-full sm:w-auto">
        <Tabs
          value={activeFilter}
          onValueChange={setActiveFilter}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            {DATE_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <TabsTrigger
                  key={filter.id}
                  value={filter.id}
                  className="text-xs font-medium px-2.5 py-1.5 transition-all"
                >
                  {loading && isActive ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin text-primary shrink-0" />
                  ) : (
                    <Calendar className="h-3.5 w-3.5 mr-1 shrink-0" />
                  )}
                  <span>{filter.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Magnitude Severity Legend & Fetching Status with AnimatePresence */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-medium text-muted-foreground overflow-x-auto w-full sm:w-auto px-1 py-0.5 justify-start sm:justify-end min-h-[28px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="status-fetching"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -4 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground text-xs font-medium"
            >
              <Loader2 className="size-3 animate-spin text-primary" />
              <span>Fetching telemetry...</span>
            </motion.div>
          ) : (
            <motion.div
              key="status-scale"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto"
            >
              <span className="hidden md:inline text-xs text-muted-foreground mr-1 flex items-center gap-1">
                <Layers className="inline h-3 w-3 mr-0.5 text-muted-foreground" /> Scale:
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-mag-minor-bg text-mag-minor-foreground border border-mag-minor-border whitespace-nowrap">
                <span className="size-1.5 rounded-full bg-mag-minor" /> &lt;3.0 Minor
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-mag-moderate-bg text-mag-moderate-foreground border border-mag-moderate-border whitespace-nowrap">
                <span className="size-1.5 rounded-full bg-mag-moderate" /> 3.0–4.9
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-mag-strong-bg text-mag-strong-foreground border border-mag-strong-border whitespace-nowrap">
                <span className="size-1.5 rounded-full bg-mag-strong" /> 5.0–5.9
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-mag-severe-bg text-mag-severe-foreground border border-mag-severe-border whitespace-nowrap">
                <span className="size-1.5 rounded-full bg-mag-severe" /> ≥6.0 Major
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
