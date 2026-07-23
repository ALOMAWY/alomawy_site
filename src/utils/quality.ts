export type QualityLevel = "low" | "medium" | "high";

const STORAGE_KEY = "quality-level";

export function detectDeviceCapability(): QualityLevel {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return "low";

  const cores = navigator.hardwareConcurrency || 2;
  // deviceMemory is not available in all browsers (Chrome only)
  const ram = (navigator as any).deviceMemory || 0;

  if (cores <= 4 || (ram > 0 && ram <= 4)) return "low";
  if (cores > 8 && ram > 8) return "high";
  return "medium";
}

export function getQualityLevel(): QualityLevel {
  const stored = localStorage.getItem(STORAGE_KEY) as QualityLevel | null;
  if (stored && ["low", "medium", "high"].includes(stored)) return stored;
  return detectDeviceCapability();
}

export function setQualityLevel(level: QualityLevel): void {
  localStorage.setItem(STORAGE_KEY, level);
  applyQualityClass(level);
}

export function applyQualityClass(level: QualityLevel): void {
  const html = document.documentElement;
  html.classList.remove("quality-low", "quality-medium", "quality-high");
  html.classList.add(`quality-${level}`);
}
