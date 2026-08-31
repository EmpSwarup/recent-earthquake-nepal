import { Earthquake } from "@/types/earthquake";
import { getMagnitudeThreshold } from "@/config/magnitude-thresholds";

/**
 * Returns a styled HTML element for the custom MapLibre earthquake marker
 */
export function createEarthquakeMarkerElement(earthquake: Earthquake): HTMLElement {
  const threshold = getMagnitudeThreshold(earthquake.magnitude);
  const isSevere = threshold.id === "severe";
  const isStrong = threshold.id === "strong";
  const isModerate = threshold.id === "moderate";

  const container = document.createElement("div");
  container.className = "custom-quake-marker-wrapper group cursor-pointer";
  container.setAttribute("data-id", earthquake.id);
  container.setAttribute("data-magnitude", earthquake.magnitude.toFixed(1));

  // Determine size based on magnitude and baseSize
  const size = Math.max(28, Math.min(48, Math.round(threshold.baseSize + (earthquake.magnitude - threshold.min) * 2.5)));

  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  container.style.position = "relative";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";

  // Pulse ring for severe and strong earthquakes
  const pulseRing = document.createElement("div");
  pulseRing.className = `absolute inset-0 rounded-full transition-all duration-300 ${
    threshold.pulse ? "animate-ping opacity-60" : "opacity-0"
  }`;
  pulseRing.style.backgroundColor = threshold.glowColor;
  pulseRing.style.pointerEvents = "none";
  container.appendChild(pulseRing);

  // Main marker body (pin/badge)
  const markerBody = document.createElement("div");
  markerBody.className = "relative rounded-full flex flex-col items-center justify-center transition-all duration-200 ease-out group-hover:scale-115";
  markerBody.style.width = "100%";
  markerBody.style.height = "100%";
  markerBody.style.background = threshold.markerBg;
  markerBody.style.border = `2px solid ${threshold.markerBorder}`;
  markerBody.style.boxShadow = `0 4px 12px ${threshold.glowColor}, 0 2px 4px rgba(15, 23, 42, 0.25)`;
  markerBody.style.color = "#ffffff";

  // Icon SVG selection based on severity (Seismic Waveforms & Alerts from React-Icons SVG specs)
  let iconSvg = "";
  if (isSevere) {
    // Alert / Severe Shockwave Icon (FaRadiation / IoWarning style)
    iconSvg = `
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="size-3.5 mb-0.5 drop-shadow-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M449.07 399.08L278.64 82.58c-12.08-22.44-44.26-22.44-56.35 0L51.87 399.08A32 32 0 0 0 80 446h340.89a32 32 0 0 0 28.18-46.92zm-218.6-47.15a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm20-72a16 16 0 0 1-32 0v-64a16 16 0 0 1 32 0z"></path>
      </svg>
    `;
  } else if (isStrong) {
    // High Energy Waveform Pulse (RiPulseFill style)
    iconSvg = `
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="size-3.5 mb-0.5 drop-shadow-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 7.539L15 21.539L18.659 13H23V11H17.341L15 16.461L9 2.461L5.341 11H1V13H6.659L9 7.539Z"></path>
      </svg>
    `;
  } else if (isModerate) {
    // Concentric Seismic Waves (MdSensors style)
    iconSvg = `
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="size-3 mb-0.5 drop-shadow-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM4.93 4.93L3.51 3.51A11.944 11.944 0 0 0 0 12c0 3.31 1.34 6.31 3.51 8.49l1.41-1.41C3.1 17.26 2 14.76 2 12s1.1-5.26 2.93-7.07zm14.14 0C20.9 6.74 22 9.24 22 12s-1.1 5.26-2.93 7.07l1.41 1.41C22.66 18.31 24 15.31 24 12c0-3.31-1.34-6.31-3.51-8.49l-1.42 1.42zM7.76 7.76L6.34 6.34A7.952 7.952 0 0 0 4 12c0 2.21.9 4.21 2.34 5.66l1.41-1.41C6.67 15.17 6 13.67 6 12s.67-3.17 1.76-4.24zm8.49 0C17.33 8.83 18 10.33 18 12s-.67 3.17-1.76 4.24l1.41 1.41C19.1 16.21 20 14.21 20 12c0-2.21-.9-4.21-2.34-5.66l-1.41 1.42z"></path>
      </svg>
    `;
  } else {
    // Minor Waveform Pulse (FaWaveSquare style)
    iconSvg = `
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="size-2.5 mb-0.5 drop-shadow-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M504 256c0 13.3-10.7 24-24 24h-74.8c-10.7 0-20.2-7.1-23.2-17.4L337.8 85.8 247.2 431.4c-2.7 10.5-12.1 17.8-23 17.8s-20.3-7.3-23-17.8L129.8 178.6 97.4 280.2c-3.4 10.7-13.3 18-24.5 18H24c-13.3 0-24-10.7-24-24s10.7-24 24-24h37.7l47.5-149.3c3.4-10.7 13.3-18 24.5-18s21.1 7.3 24.5 18l71.4 224.4L316.6 63.8c2.7-10.5 12.1-17.8 23-17.8s20.3 7.3 23 17.8l55.8 192.2H480c13.3 0 24 10.7 24 24z"></path>
      </svg>
    `;
  }

  markerBody.innerHTML = `
    ${size >= 32 ? iconSvg : ""}
    <span class="text-center font-bold tracking-tighter leading-none" style="font-size: ${size >= 36 ? "11px" : "10px"};">
      ${earthquake.magnitude.toFixed(1)}
    </span>
  `;

  container.appendChild(markerBody);
  return container;
}
