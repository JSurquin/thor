"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { normalizePlaygroundPath } from "@/lib/playground-paths";
import { cn } from "@/lib/utils";

type TreeNode =
  | { kind: "file"; name: string; path: string }
  | {
      kind: "dir";
      name: string;
      fullPath: string;
      children: TreeNode[];
    };

function insertIntoTree(
  nodes: TreeNode[],
  segments: string[],
  fileFullPath: string,
  depthPrefix: string
): void {
  const [head, ...rest] = segments;
  if (!head) return;
  if (rest.length === 0) {
    nodes.push({ kind: "file", name: head, path: fileFullPath });
    return;
  }
  const dirFull = depthPrefix ? `${depthPrefix}/${head}` : `/${head}`;
  let dir = nodes.find(
    (n): n is Extract<TreeNode, { kind: "dir" }> =>
      n.kind === "dir" && n.fullPath === dirFull
  );
  if (!dir) {
    dir = { kind: "dir", name: head, fullPath: dirFull, children: [] };
    nodes.push(dir);
  }
  insertIntoTree(dir.children, rest, fileFullPath, dirFull);
}

function sortTreeNodes(nodes: TreeNode[]): void {
  nodes.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  });
  for (const n of nodes) {
    if (n.kind === "dir") sortTreeNodes(n.children);
  }
}

function buildFileTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = [];
  for (const fullPath of [...paths].sort()) {
    const segments = fullPath.replace(/^\//, "").split("/").filter(Boolean);
    if (segments.length === 0) continue;
    insertIntoTree(root, segments, fullPath, "");
  }
  sortTreeNodes(root);
  return root;
}

type PlaygroundFileTreeProps = {
  filePaths: string[];
  activeFile: string;
  onSelectFile: (path: string) => void;
  onAddFile: (rawPath: string) => boolean;
  onRemoveFile: (path: string) => void;
  className?: string;
};

export function PlaygroundFileTree({
  filePaths,
  activeFile,
  onSelectFile,
  onAddFile,
  onRemoveFile,
  className,
}: PlaygroundFileTreeProps) {
  const tree = useMemo(() => buildFileTree(filePaths), [filePaths]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [newPath, setNewPath] = useState("");

  const toggleDir = useCallback((fullPath: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(fullPath)) next.delete(fullPath);
      else next.add(fullPath);
      return next;
    });
  }, []);

  const ensureExpanded = useCallback((path: string) => {
    const parts = path.replace(/^\//, "").split("/").filter(Boolean);
    if (parts.length <= 1) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      let acc = "";
      for (let i = 0; i < parts.length - 1; i++) {
        acc = acc ? `${acc}/${parts[i]}` : `/${parts[i]}`;
        next.add(acc);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    ensureExpanded(activeFile);
  }, [activeFile, ensureExpanded]);

  const handleCreate = useCallback(() => {
    const ok = onAddFile(newPath);
    if (ok) {
      const path = normalizePlaygroundPath(newPath);
      if (path) ensureExpanded(path);
      setCreateOpen(false);
      setNewPath("");
    }
  }, [newPath, onAddFile, ensureExpanded]);

  return (
    <div className={cn("flex flex-col min-h-0", className)}>
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-b border-border/40 shrink-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Fichiers
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="shrink-0"
          onClick={() => setCreateOpen(true)}
          aria-label="Nouveau fichier"
          title="Nouveau fichier"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-[120px] max-h-[min(50vh,320px)] lg:max-h-none lg:flex-1">
        <div className="p-1 pr-3">
          {tree.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-3">Aucun fichier</p>
          ) : (
            <ul className="space-y-0.5">
              {tree.map((node) => (
                <TreeBranch
                  key={node.kind === "dir" ? node.fullPath : node.path}
                  node={node}
                  depth={0}
                  activeFile={activeFile}
                  expanded={expanded}
                  onToggleDir={toggleDir}
                  onSelectFile={onSelectFile}
                  onRemoveFile={onRemoveFile}
                />
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau fichier</DialogTitle>
            <DialogDescription>
              Chemin relatif à la racine du projet, par ex.{" "}
              <code className="text-foreground">src/utils.js</code> ou{" "}
              <code className="text-foreground">/components/Button.tsx</code>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="new-file-path">Chemin</Label>
            <Input
              id="new-file-path"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="ex. lib/helpers.ts"
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleCreate}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TreeBranch({
  node,
  depth,
  activeFile,
  expanded,
  onToggleDir,
  onSelectFile,
  onRemoveFile,
}: {
  node: TreeNode;
  depth: number;
  activeFile: string;
  expanded: Set<string>;
  onToggleDir: (fullPath: string) => void;
  onSelectFile: (path: string) => void;
  onRemoveFile: (path: string) => void;
}) {
  const pad = 8 + depth * 12;

  if (node.kind === "file") {
    const isActive = activeFile === node.path;
    return (
      <li>
        <div
          className={cn(
            "group flex items-center gap-0.5 rounded-md min-h-[32px]",
            isActive && "bg-primary/15"
          )}
          style={{ paddingLeft: pad }}
        >
          <button
            type="button"
            onClick={() => onSelectFile(node.path)}
            className={cn(
              "flex flex-1 min-w-0 items-center gap-1.5 py-1.5 pr-1 rounded-md text-left text-sm",
              isActive ? "text-primary font-medium" : "text-foreground hover:bg-muted/60"
            )}
          >
            <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{node.name}</span>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 shrink-0"
            aria-label={`Supprimer ${node.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(node.path);
            }}
          >
            <Trash2Icon className="size-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </li>
    );
  }

  const isOpen = expanded.has(node.fullPath);

  return (
    <li className="space-y-0.5">
      <div
        className="flex items-center gap-0.5 rounded-md min-h-[32px] hover:bg-muted/40"
        style={{ paddingLeft: pad }}
      >
        <button
          type="button"
          onClick={() => onToggleDir(node.fullPath)}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Réduire le dossier" : "Développer le dossier"}
        >
          <ChevronRightIcon
            className={cn("size-4 transition-transform", isOpen && "rotate-90")}
          />
        </button>
        <button
          type="button"
          onClick={() => onToggleDir(node.fullPath)}
          className="flex flex-1 min-w-0 items-center gap-1.5 py-1.5 text-left text-sm font-medium text-foreground"
        >
          {isOpen ? (
            <FolderOpenIcon className="size-3.5 shrink-0 text-amber-500/90" />
          ) : (
            <FolderIcon className="size-3.5 shrink-0 text-amber-600/80" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
      </div>
      {isOpen && node.children.length > 0 ? (
        <ul className="space-y-0.5 border-l border-border/40 ml-2 pl-1.5">
          {node.children.map((child) => (
            <TreeBranch
              key={child.kind === "dir" ? child.fullPath : child.path}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              expanded={expanded}
              onToggleDir={onToggleDir}
              onSelectFile={onSelectFile}
              onRemoveFile={onRemoveFile}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
