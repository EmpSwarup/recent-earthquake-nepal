import { Earthquake } from "@/types/earthquake";
import { getMagnitudeInfo } from "@/lib/earthquake-utils";

export function createPopupContent(
  earthquake: Earthquake,
  onViewDetails: () => void
): HTMLElement {
  const popupContent = document.createElement("div");
  popupContent.className = "earthquake-popup p-3.5 space-y-2 text-foreground min-w-[220px]";

  const magInfo = getMagnitudeInfo(earthquake.magnitude);
  const formattedDate = new Date(earthquake.time).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  popupContent.innerHTML = `
    <div class="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${magInfo.badgeClass}">
        M ${earthquake.magnitude.toFixed(1)} • ${magInfo.label}
      </span>
      <span class="text-[11px] text-muted-foreground">${formattedDate}</span>
    </div>
    
    <div class="space-y-1">
      <div class="text-xs font-semibold text-foreground leading-snug line-clamp-2">${earthquake.place}</div>
      <div class="text-[11px] text-muted-foreground flex justify-between">
        <span>Focal Depth:</span>
        <span class="font-medium text-foreground">${earthquake.coordinates[2].toFixed(1)} km</span>
      </div>
    </div>
    
    ${
      earthquake.tsunami
        ? '<div class="text-[11px] px-2 py-1 bg-mag-severe-bg text-mag-severe-foreground rounded border border-mag-severe-border font-medium">⚠️ Tsunami Advisory Issued</div>'
        : ""
    }
    
    <button type="button" class="view-details w-full mt-1.5 py-1 px-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors text-center cursor-pointer shadow-xs">
      View Full Details
    </button>
  `;

  popupContent
    .querySelector(".view-details")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
      onViewDetails();
    });

  return popupContent;
}
