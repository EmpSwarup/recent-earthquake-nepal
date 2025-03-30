import { Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dateFilters } from "@/components/EarthquakeMap";

interface FilterTabsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  loading: boolean;
}

export default function FilterTabs({
  activeFilter,
  setActiveFilter,
}: FilterTabsProps) {
  return (
    <Tabs
      defaultValue={activeFilter}
      className="w-full"
      onValueChange={setActiveFilter}
    >
      <div className="flex items-center justify-between mb-4">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex">
          {dateFilters.map((filter) => (
            <TabsTrigger
              key={filter.id}
              value={filter.id}
              className="flex items-center gap-1 text-xs md:text-sm"
            >
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span>{filter.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {dateFilters.map((filter) => (
        <TabsContent
          key={filter.id}
          value={filter.id}
          className="mt-0"
        ></TabsContent>
      ))}
    </Tabs>
  );
}
