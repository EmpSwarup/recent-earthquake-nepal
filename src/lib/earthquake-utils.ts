import {
  MAGNITUDE_THRESHOLDS,
  getMagnitudeThreshold,
  MagnitudeSeverity,
  MagnitudeThresholdLevel,
} from "@/config/magnitude-thresholds";

export type { MagnitudeSeverity, MagnitudeThresholdLevel };
export { MAGNITUDE_THRESHOLDS, getMagnitudeThreshold };

export interface MagnitudeInfo {
  severity: MagnitudeSeverity;
  label: string;
  badgeClass: string;
  borderClass: string;
  textClass: string;
  bgClass: string;
  markerColor: string;
  markerBorderColor: string;
}

/**
 * Returns severity categorization and semantic token classes based on Richter magnitude scale
 */
export function getMagnitudeInfo(magnitude: number): MagnitudeInfo {
  const threshold = getMagnitudeThreshold(magnitude);
  return {
    severity: threshold.id,
    label: threshold.label,
    badgeClass: `${threshold.bgClass} ${threshold.textClass} ${threshold.borderClass}`,
    borderClass: threshold.borderClass,
    textClass: threshold.textClass,
    bgClass: threshold.bgClass,
    markerColor: threshold.color,
    markerBorderColor: threshold.markerBorder,
  };
}
