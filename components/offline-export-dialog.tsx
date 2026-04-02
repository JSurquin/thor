"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  buildZipBlob,
  playgroundZipFilename,
  exerciseZipFilename,
  canShareFiles,
} from "@/lib/export-zip";
import { DownloadIcon, Share2Icon, Loader2Icon } from "lucide-react";
import type { TemplateId } from "@/lib/templates";

export type OfflineExportDialogProps =
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      files: Record<string, string>;
      variant: "playground";
      templateId: TemplateId;
    }
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      files: Record<string, string>;
      variant: "exercise";
      exerciseId: string;
    };

export function OfflineExportDialog(props: OfflineExportDialogProps) {
  const { open, onOpenChange, files, variant } = props;
  const exportId =
    variant === "playground" ? props.templateId : props.exerciseId;
  const [blob, setBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);

  const filename = useMemo(() => {
    if (!open) return "";
    return variant === "playground"
      ? playgroundZipFilename(exportId)
      : exerciseZipFilename(exportId);
  }, [open, variant, exportId]);

  const zipFile = useMemo(() => {
    if (!blob || !filename) return null;
    return new File([blob], filename, { type: "application/zip" });
  }, [blob, filename]);

  const exportLabel = variant === "playground" ? "playground" : "exercice";

  /* Dialog contrôlé : génère le ZIP quand `open` passe à true. */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    /* eslint-disable react-hooks/set-state-in-effect -- suivi async createObjectURL / partage */
    setBusy(true);
    setBlob(null);
    buildZipBlob(files)
      .then((b) => {
        if (!cancelled) setBlob(b);
      })
      .catch(() => {
        if (!cancelled) toast.error("Impossible de créer le ZIP");
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => {
      cancelled = true;
    };
  }, [open, files, variant, exportId]);

  const shareSupported = zipFile ? canShareFiles([zipFile]) : false;
  const shareAvailable =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const download = useCallback(() => {
    if (!blob || !filename) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("ZIP téléchargé");
    onOpenChange(false);
  }, [blob, filename, onOpenChange]);

  const share = useCallback(async () => {
    if (!shareAvailable) return;
    try {
      if (zipFile && shareSupported) {
        await navigator.share({
          files: [zipFile],
          title: `Export ${exportLabel} — lab.andromed`,
          text: `Archive ZIP ${exportLabel} lab.andromed`,
        });
        toast.success("Partage ouvert");
      } else {
        await navigator.share({
          title: "lab.andromed",
          text: `Ouvrez cette page pour télécharger votre ZIP (${exportLabel}).`,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        });
        toast.message("Utilisez « Télécharger » pour récupérer le fichier ZIP");
      }
      onOpenChange(false);
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      toast.error("Partage impossible — utilisez Télécharger");
    }
  }, [zipFile, shareAvailable, shareSupported, onOpenChange, exportLabel]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sauvegarde hors ligne</DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <span className="block">
              Un fichier ZIP de votre dossier est prêt. Sur téléphone ou tablette,
              « Partager » ouvre la feuille système : vous pouvez envoyer le fichier
              via AirDrop, Bluetooth, Wi‑Fi direct, Nearby Share ou toute appli
              installée (fichiers, Drive, messagerie, etc.).
            </span>
            <span className="block text-xs text-muted-foreground">
              Sur ordinateur, le partage de fichiers dépend du navigateur ; le
              téléchargement direct reste le plus fiable.
            </span>
          </DialogDescription>
        </DialogHeader>
        {busy ? (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <Loader2Icon className="size-5 animate-spin" aria-hidden />
            <span>Création du ZIP…</span>
          </div>
        ) : null}
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Fermer
          </Button>
          <Button
            type="button"
            variant="secondary"
            data-testid="offline-export-download"
            onClick={download}
            disabled={busy || !blob}
            className="gap-2"
          >
            <DownloadIcon className="size-4 shrink-0" aria-hidden />
            Télécharger
          </Button>
          {shareAvailable ? (
            <Button
              type="button"
              onClick={share}
              disabled={busy || !blob}
              className="gap-2"
              data-testid="offline-export-share"
            >
              <Share2Icon className="size-4 shrink-0" aria-hidden />
              Partager
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
