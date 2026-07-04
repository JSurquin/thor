/** Fichiers initiaux pour l'exercice bash-terminal-decouverte (source embarquée, éditable côté client). */
export const BASH_TERMINAL_SHELL_JS = `/**
 * Simulateur Bash Thor — code de référence (JavaScript)
 *
 * Le terminal interactif (panneau Aperçu) exécute le moteur TypeScript
 * lib/bash-shell.ts, testé par des tests unitaires Vitest.
 *
 * Architecture dynamique (pas de réponses en dur) :
 * 1. Un système de fichiers virtuel (arborescence d'objets)
 * 2. Un registre de commandes via registerCommand(nom, handler)
 * 3. execute(ligne) parse la ligne, trouve le handler, met à jour l'état
 */

export const shellArchitecture = {
  parseLine: "Découpe une ligne en commande + arguments (guillemets supportés)",
  registerCommand: "Enregistre un handler dynamique pour une commande",
  execute: "Interprète la ligne et retourne { stdout, stderr, exitCode, state? }",
  builtinCommands: ["ls", "cd", "pwd", "echo", "cat", "mkdir", "touch", "rm", "help"],
};

/**
 * Exercice : implémentez registerWhoami pour afficher l'utilisateur courant.
 */
export function registerWhoami(shell) {
  shell.registerCommand("whoami", (_args, state) => ({
    stdout: state.env.USER ?? "inconnu",
    stderr: "",
    exitCode: 0,
  }));
}
`;
