/**
 * Simulateur de shell Bash minimal pour les exercices Thor.
 * Interprète dynamiquement les commandes sur un système de fichiers virtuel.
 */

export type FsNode =
  | { type: "file"; content: string }
  | { type: "dir"; children: Record<string, FsNode> };

export interface BashShellState {
  cwd: string;
  fs: FsNode;
  env: Record<string, string>;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  state?: BashShellState;
}

export type CommandHandler = (
  args: string[],
  state: BashShellState,
  shell: BashShell
) => CommandResult;

function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return "/" + stack.join("/");
}

function resolvePath(cwd: string, raw: string): string {
  if (raw.startsWith("/")) return normalizePath(raw);
  if (raw === "" || raw === ".") return normalizePath(cwd);
  return normalizePath(`${cwd.replace(/\/$/, "")}/${raw}`);
}

function getNode(fs: FsNode, absPath: string): FsNode | null {
  if (absPath === "/" || absPath === "") {
    if (fs.type !== "dir") return null;
    return fs;
  }
  const parts = absPath.split("/").filter(Boolean);
  let node: FsNode = fs;
  for (const part of parts) {
    if (node.type !== "dir") return null;
    const next = node.children[part];
    if (!next) return null;
    node = next;
  }
  return node;
}

function parentDirPath(absPath: string): string {
  const normalized = normalizePath(absPath);
  if (normalized === "/") return "/";
  const parts = normalized.split("/").filter(Boolean);
  parts.pop();
  return parts.length === 0 ? "/" : "/" + parts.join("/");
}

function baseName(absPath: string): string {
  const parts = normalizePath(absPath).split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function listDirNames(node: FsNode, showHidden: boolean): string[] {
  if (node.type !== "dir") return [];
  return Object.keys(node.children)
    .filter((name) => showHidden || !name.startsWith("."))
    .sort();
}

function cloneState(state: BashShellState): BashShellState {
  return {
    cwd: state.cwd,
    fs: structuredClone(state.fs),
    env: { ...state.env },
  };
}

export function createDefaultFilesystem(): FsNode {
  return {
    type: "dir",
    children: {
      home: {
        type: "dir",
        children: {
          etudiant: {
            type: "dir",
            children: {
              Documents: {
                type: "dir",
                children: {
                  "notes.txt": {
                    type: "file",
                    content: "Bienvenue dans le terminal simulé Thor.\n",
                  },
                },
              },
              Downloads: { type: "dir", children: {} },
              ".bashrc": {
                type: "file",
                content: "# Configuration bash simulée\n",
              },
            },
          },
        },
      },
      tmp: { type: "dir", children: {} },
    },
  };
}

export function createBashShell(
  options: {
    fs?: FsNode;
    cwd?: string;
    env?: Record<string, string>;
  } = {}
): BashShell {
  const state: BashShellState = {
    cwd: options.cwd ?? "/home/etudiant",
    fs: options.fs ?? createDefaultFilesystem(),
    env: options.env ?? { USER: "etudiant", HOME: "/home/etudiant", SHELL: "/bin/bash" },
  };
  return new BashShell(state);
}

export class BashShell {
  private commands = new Map<string, CommandHandler>();
  private state: BashShellState;

  constructor(initialState: BashShellState) {
    this.state = cloneState(initialState);
    this.registerBuiltinCommands();
  }

  getState(): BashShellState {
    return cloneState(this.state);
  }

  registerCommand(name: string, handler: CommandHandler): void {
    this.commands.set(name, handler);
  }

  hasCommand(name: string): boolean {
    return this.commands.has(name);
  }

  getCommandNames(): string[] {
    return [...this.commands.keys()].sort();
  }

  parseLine(line: string): { command: string; args: string[] } | null {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return null;

    const tokens: string[] = [];
    let current = "";
    let quote: "'" | '"' | null = null;

    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i]!;
      if (quote) {
        if (ch === quote) {
          quote = null;
        } else {
          current += ch;
        }
        continue;
      }
      if (ch === "'" || ch === '"') {
        quote = ch;
        continue;
      }
      if (/\s/.test(ch)) {
        if (current) {
          tokens.push(current);
          current = "";
        }
        continue;
      }
      current += ch;
    }
    if (current) tokens.push(current);
    if (tokens.length === 0) return null;

    const [command, ...args] = tokens;
    return { command: command!, args };
  }

  execute(line: string): CommandResult {
    const parsed = this.parseLine(line);
    if (!parsed) {
      return { stdout: "", stderr: "", exitCode: 0 };
    }

    const handler = this.commands.get(parsed.command);
    if (!handler) {
      return {
        stdout: "",
        stderr: `${parsed.command}: commande introuvable`,
        exitCode: 127,
      };
    }

    const result = handler(parsed.args, this.state, this);
    if (result.state) {
      this.state = cloneState(result.state);
    }
    return result;
  }

  private registerBuiltinCommands(): void {
    this.registerCommand("pwd", (_args, state) => ({
      stdout: state.cwd,
      stderr: "",
      exitCode: 0,
    }));

    this.registerCommand("echo", (args) => ({
      stdout: args.join(" "),
      stderr: "",
      exitCode: 0,
    }));

    this.registerCommand("cd", (args, state) => {
      const target = args[0] ?? state.env.HOME ?? "/";
      const resolved = resolvePath(state.cwd, target);
      const node = getNode(state.fs, resolved);
      if (!node) {
        return {
          stdout: "",
          stderr: `cd: ${target}: Aucun fichier ou dossier de ce nom`,
          exitCode: 1,
        };
      }
      if (node.type !== "dir") {
        return {
          stdout: "",
          stderr: `cd: ${target}: N'est pas un dossier`,
          exitCode: 1,
        };
      }
      return {
        stdout: "",
        stderr: "",
        exitCode: 0,
        state: { ...state, cwd: resolved },
      };
    });

    this.registerCommand("ls", (args, state) => {
      let showHidden = false;
      let showLong = false;
      const paths: string[] = [];

      for (const arg of args) {
        if (arg.startsWith("-") && arg.length > 1) {
          if (arg.includes("a")) showHidden = true;
          if (arg.includes("l")) showLong = true;
        } else {
          paths.push(arg);
        }
      }

      const targets = paths.length > 0 ? paths : ["."];
      const lines: string[] = [];

      for (const raw of targets) {
        const resolved = resolvePath(state.cwd, raw);
        const node = getNode(state.fs, resolved);
        if (!node) {
          return {
            stdout: "",
            stderr: `ls: impossible d'accéder à '${raw}': Aucun fichier ou dossier de ce nom`,
            exitCode: 1,
          };
        }
        if (node.type === "file") {
          lines.push(showLong ? `-rw-r--r-- 1 etudiant etudiant ${node.content.length} ${baseName(resolved)}` : baseName(resolved));
          continue;
        }
        const names = listDirNames(node, showHidden);
        if (showLong) {
          for (const name of names) {
            const child = node.children[name]!;
            const kind = child.type === "dir" ? "d" : "-";
            const size = child.type === "file" ? child.content.length : 4096;
            lines.push(`${kind}rw-r--r-- 1 etudiant etudiant ${size} ${name}`);
          }
        } else {
          lines.push(names.join("  "));
        }
      }

      return { stdout: lines.join("\n"), stderr: "", exitCode: 0 };
    });

    this.registerCommand("cat", (args, state) => {
      if (args.length === 0) {
        return { stdout: "", stderr: "cat: operande manquant", exitCode: 1 };
      }
      const outputs: string[] = [];
      for (const raw of args) {
        const resolved = resolvePath(state.cwd, raw);
        const node = getNode(state.fs, resolved);
        if (!node) {
          return {
            stdout: "",
            stderr: `cat: ${raw}: Aucun fichier ou dossier de ce nom`,
            exitCode: 1,
          };
        }
        if (node.type !== "file") {
          return {
            stdout: "",
            stderr: `cat: ${raw}: Est un dossier`,
            exitCode: 1,
          };
        }
        outputs.push(node.content.replace(/\n$/, ""));
      }
      return { stdout: outputs.join("\n"), stderr: "", exitCode: 0 };
    });

    this.registerCommand("mkdir", (args, state) => {
      if (args.length === 0) {
        return { stdout: "", stderr: "mkdir: operande manquant", exitCode: 1 };
      }
      const next = cloneState(state);
      for (const raw of args) {
        const resolved = resolvePath(state.cwd, raw);
        const parentPath = parentDirPath(resolved);
        const parent = getNode(next.fs, parentPath);
        if (!parent || parent.type !== "dir") {
          return {
            stdout: "",
            stderr: `mkdir: impossible de créer le répertoire « ${raw} »`,
            exitCode: 1,
          };
        }
        const name = baseName(resolved);
        if (parent.children[name]) {
          return {
            stdout: "",
            stderr: `mkdir: impossible de créer le répertoire « ${raw} »: Fichier existant`,
            exitCode: 1,
          };
        }
        parent.children[name] = { type: "dir", children: {} };
      }
      return { stdout: "", stderr: "", exitCode: 0, state: next };
    });

    this.registerCommand("touch", (args, state) => {
      if (args.length === 0) {
        return { stdout: "", stderr: "touch: operande manquant", exitCode: 1 };
      }
      const next = cloneState(state);
      for (const raw of args) {
        const resolved = resolvePath(state.cwd, raw);
        const parentPath = parentDirPath(resolved);
        const parent = getNode(next.fs, parentPath);
        if (!parent || parent.type !== "dir") {
          return {
            stdout: "",
            stderr: `touch: impossible de toucher '${raw}'`,
            exitCode: 1,
          };
        }
        const name = baseName(resolved);
        if (!parent.children[name]) {
          parent.children[name] = { type: "file", content: "" };
        }
      }
      return { stdout: "", stderr: "", exitCode: 0, state: next };
    });

    this.registerCommand("rm", (args, state) => {
      if (args.length === 0) {
        return { stdout: "", stderr: "rm: operande manquant", exitCode: 1 };
      }
      const next = cloneState(state);
      for (const raw of args) {
        const resolved = resolvePath(state.cwd, raw);
        const parentPath = parentDirPath(resolved);
        const parent = getNode(next.fs, parentPath);
        const name = baseName(resolved);
        if (!parent || parent.type !== "dir" || !parent.children[name]) {
          return {
            stdout: "",
            stderr: `rm: impossible de supprimer '${raw}': Aucun fichier ou dossier de ce nom`,
            exitCode: 1,
          };
        }
        delete parent.children[name];
      }
      return { stdout: "", stderr: "", exitCode: 0, state: next };
    });

    this.registerCommand("help", (_args, _state, shell) => {
      const names = shell.getCommandNames().join(", ");
      return {
        stdout: `Commandes disponibles : ${names}`,
        stderr: "",
        exitCode: 0,
      };
    });
  }
}
