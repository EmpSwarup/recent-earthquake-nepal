export type MagnitudeSeverity = "minor" | "moderate" | "strong" | "severe";

export interface MagnitudeThresholdLevel {
  id: MagnitudeSeverity;
  label: string;
  rangeLabel: string;
  min: number;
  max: number; // exclusive or Infinity
  color: string;
  glowColor: string;
  badgeVariant: "minor" | "moderate" | "strong" | "severe";
  bgClass: string;
  borderClass: string;
  textClass: string;
  markerBg: string;
  markerBorder: string;
  iconName: string;
  baseSize: number; // pixels
  pulse: boolean;
}

/**
 * Single source of truth for earthquake magnitude thresholds, color tokens, and marker styling.
 * Easily adjust threshold values or colors here.
 */
export const MAGNITUDE_THRESHOLDS: MagnitudeThresholdLevel[] = [
  {
    id: "severe",
    label: "Severe / Major",
    rangeLabel: "≥ 6.0",
    min: 6.0,
    max: Infinity,
    color: "#dc2626", // Red / Crimson
    glowColor: "rgba(220, 38, 38, 0.5)",
    badgeVariant: "severe",
    bgClass: "bg-mag-severe-bg",
    borderClass: "border-mag-severe-border",
    textClass: "text-mag-severe-foreground",
    markerBg: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    markerBorder: "#fee2e2",
    iconName: "severe",
    baseSize: 42,
    pulse: true,
  },
  {
    id: "strong",
    label: "Strong / High",
    rangeLabel: "5.0 – 5.9",
    min: 5.0,
    max: 6.0,
    color: "#ea580c", // Orange
    glowColor: "rgba(234, 88, 12, 0.45)",
    badgeVariant: "strong",
    bgClass: "bg-mag-strong-bg",
    borderClass: "border-mag-strong-border",
    textClass: "text-mag-strong-foreground",
    markerBg: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    markerBorder: "#ffedd5",
    iconName: "strong",
    baseSize: 36,
    pulse: true,
  },
  {
    id: "moderate",
    label: "Moderate",
    rangeLabel: "3.0 – 4.9",
    min: 3.0,
    max: 5.0,
    color: "#d97706", // Amber / Yellow
    glowColor: "rgba(217, 119, 6, 0.35)",
    badgeVariant: "moderate",
    bgClass: "bg-mag-moderate-bg",
    borderClass: "border-mag-moderate-border",
    textClass: "text-mag-moderate-foreground",
    markerBg: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    markerBorder: "#fef3c7",
    iconName: "moderate",
    baseSize: 30,
    pulse: false,
  },
  {
    id: "minor",
    label: "Low / Minor",
    rangeLabel: "< 3.0",
    min: 0,
    max: 3.0,
    color: "#059669", // Emerald / Green
    glowColor: "rgba(5, 150, 105, 0.3)",
    badgeVariant: "minor",
    bgClass: "bg-mag-minor-bg",
    borderClass: "border-mag-minor-border",
    textClass: "text-mag-minor-foreground",
    markerBg: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    markerBorder: "#d1fae5",
    iconName: "minor",
    baseSize: 26,
    pulse: false,
  },
];

/**
 * Finds the corresponding threshold level for a given magnitude.
 */
export function getMagnitudeThreshold(magnitude: number): MagnitudeThresholdLevel {
  const found = MAGNITUDE_THRESHOLDS.find((t) => magnitude >= t.min);
  return found || MAGNITUDE_THRESHOLDS[MAGNITUDE_THRESHOLDS.length - 1];
}
