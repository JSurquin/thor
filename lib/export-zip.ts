import JSZip from "jszip";

/** Segments interdits dans les chemins ZIP (prévention zip slip / noms vides). */
export function isSafeZipRelativePath(cleanPath: string): boolean {
  if (!cleanPath || cleanPath === "." || cleanPath === "..") return false;
  const parts = cleanPath.split("/");
  return !parts.some((p) => p === ".." || p === "");
}

function sanitizeExportSegment(id: string): string {
  return id.replace(/[^a-z0-9_-]/gi, "_");
}

export function playgroundZipFilename(
  templateId: string,
  timestamp = Date.now()
): string {
  return `thor-playground-${sanitizeExportSegment(templateId)}-${timestamp}.zip`;
}

export function exerciseZipFilename(
  exerciseId: string,
  timestamp = Date.now()
): string {
  return `thor-exercise-${sanitizeExportSegment(exerciseId)}-${timestamp}.zip`;
}

/**
 * Construit un Blob ZIP à partir d’un dossier virtuel (playground ou exercice).
 * Les chemins avec `..` ou segments vides sont ignorés.
 */
export async function buildZipBlob(files: Record<string, string>): Promise<Blob> {
  const zip = new JSZip();
  for (const [path, raw] of Object.entries(files)) {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    if (!isSafeZipRelativePath(cleanPath)) continue;
    zip.file(cleanPath, raw ?? "");
  }
  return zip.generateAsync({ type: "blob" });
}

/** @deprecated Alias historique — préférer `buildZipBlob`. */
export const buildPlaygroundZipBlob = buildZipBlob;

export function canShareFiles(files: File[]): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files });
  } catch {
    return false;
  }
}
