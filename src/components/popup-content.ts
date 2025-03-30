import { Earthquake } from "@/types/earthquake";

export function createPopupContent(
  earthquake: Earthquake,
  onViewDetails: () => void
): HTMLElement {
  const popupContent = document.createElement("div");
  popupContent.className = "earthquake-popup";

  popupContent.innerHTML = `
    <div class="font-medium text-sm md:text-base mb-1">Magnitude ${earthquake.magnitude.toFixed(
      1
    )}</div>
    <div class="text-xs md:text-sm mb-1">${earthquake.place}</div>
    <div class="text-xs text-gray-500">${new Date(
      earthquake.time
    ).toLocaleString()}</div>
    <div class="text-xs mt-2">
      <span class="text-gray-500">Depth:</span> ${earthquake.coordinates[2].toFixed(
        1
      )} km
    </div>
    ${
      earthquake.tsunami
        ? '<div class="text-xs text-red-600 font-medium mt-1">Tsunami alert issued</div>'
        : ""
    }
    <div class="text-xs text-primary mt-2 cursor-pointer underline view-details">View full details</div>
  `;

  popupContent
    .querySelector(".view-details")
    ?.addEventListener("click", onViewDetails);

  return popupContent;
}
