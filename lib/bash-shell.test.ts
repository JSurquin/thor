import { describe, it, expect } from "vitest";
import { createBashShell, createDefaultFilesystem, BashShell } from "./bash-shell";

describe("BashShell — parsing", () => {
  it("ignore les lignes vides et les commentaires", () => {
    const shell = createBashShell();
    expect(shell.execute("").exitCode).toBe(0);
    expect(shell.execute("   ").exitCode).toBe(0);
    expect(shell.execute("# commentaire").exitCode).toBe(0);
  });

  it("parse les arguments entre guillemets", () => {
    const shell = createBashShell();
    const parsed = shell.parseLine('echo "bonjour monde"');
    expect(parsed).toEqual({ command: "echo", args: ["bonjour monde"] });
  });
});

describe("BashShell — pwd et cd", () => {
  it("affiche le répertoire courant", () => {
    const shell = createBashShell({ cwd: "/home/etudiant" });
    expect(shell.execute("pwd").stdout).toBe("/home/etudiant");
  });

  it("change de répertoire dynamiquement", () => {
    const shell = createBashShell();
    expect(shell.execute("cd Documents").exitCode).toBe(0);
    expect(shell.execute("pwd").stdout).toBe("/home/etudiant/Documents");
    expect(shell.execute("cd ..").exitCode).toBe(0);
    expect(shell.execute("pwd").stdout).toBe("/home/etudiant");
  });

  it("refuse cd vers un chemin inexistant", () => {
    const shell = createBashShell();
    const result = shell.execute("cd /nope");
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Aucun fichier");
  });
});

describe("BashShell — ls dynamique", () => {
  it("liste le contenu réel du dossier courant", () => {
    const shell = createBashShell();
    const result = shell.execute("ls");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Documents");
    expect(result.stdout).toContain("Downloads");
    expect(result.stdout).not.toContain(".bashrc");
  });

  it("liste les fichiers cachés avec -a", () => {
    const shell = createBashShell();
    const result = shell.execute("ls -a");
    expect(result.stdout).toContain(".bashrc");
  });

  it("reflete les changements après mkdir", () => {
    const shell = createBashShell();
    shell.execute("mkdir projets");
    const result = shell.execute("ls");
    expect(result.stdout).toContain("projets");
  });

  it("liste un sous-dossier ciblé", () => {
    const shell = createBashShell();
    const result = shell.execute("ls Documents");
    expect(result.stdout).toBe("notes.txt");
  });
});

describe("BashShell — cat, touch, rm", () => {
  it("lit le contenu d'un fichier", () => {
    const shell = createBashShell();
    shell.execute("cd Documents");
    const result = shell.execute("cat notes.txt");
    expect(result.stdout).toContain("terminal simulé");
  });

  it("crée un fichier vide avec touch puis le supprime", () => {
    const shell = createBashShell();
    expect(shell.execute("touch todo.txt").exitCode).toBe(0);
    expect(shell.execute("ls").stdout).toContain("todo.txt");
    expect(shell.execute("rm todo.txt").exitCode).toBe(0);
    expect(shell.execute("ls").stdout).not.toContain("todo.txt");
  });
});

describe("BashShell — commandes personnalisées", () => {
  it("accepte registerCommand pour étendre le shell", () => {
    const shell = createBashShell();
    shell.registerCommand("whoami", (_args, state) => ({
      stdout: state.env.USER ?? "inconnu",
      stderr: "",
      exitCode: 0,
    }));
    expect(shell.execute("whoami").stdout).toBe("etudiant");
    expect(shell.hasCommand("whoami")).toBe(true);
  });
});

describe("BashShell — echo et help", () => {
  it("echo concatène les arguments", () => {
    const shell = createBashShell();
    expect(shell.execute("echo bonjour bash").stdout).toBe("bonjour bash");
  });

  it("help liste les commandes enregistrées", () => {
    const shell = createBashShell();
    const result = shell.execute("help");
    expect(result.stdout).toContain("ls");
    expect(result.stdout).toContain("cd");
  });
});

describe("createDefaultFilesystem", () => {
  it("fournit une arborescence utilisable", () => {
    const fs = createDefaultFilesystem();
    expect(fs.type).toBe("dir");
    const shell = new BashShell({
      cwd: "/home/etudiant",
      fs,
      env: { USER: "etudiant", HOME: "/home/etudiant" },
    });
    expect(shell.execute("ls Documents").stdout).toBe("notes.txt");
  });
});
