"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ShortcutRow = { keys: string; label: string };

type ShortcutsHelpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  shortcuts: ShortcutRow[];
};

export function ShortcutsHelpDialog({
  open,
  onOpenChange,
  title = "Raccourcis clavier",
  shortcuts,
}: ShortcutsHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Liste des raccourcis disponibles sur cette page
          </DialogDescription>
        </DialogHeader>
        <ul className="text-sm space-y-2 pr-1">
          {shortcuts.map((s) => (
            <li
              key={s.keys + s.label}
              className="flex justify-between gap-4 border-b border-border/40 pb-2 last:border-0"
            >
              <span className="text-muted-foreground">{s.label}</span>
              <kbd className="shrink-0 font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
