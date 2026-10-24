# Thor — lab.andromed Playground

Environnement de **playground interactif** pour coder pendant les formations : editeur Monaco, sandboxes (Sandpack), templates (React, Next.js, Docker, Rails, Ansible, Python, etc.), reset en un clic et export en ZIP.

## Prérequis

- Node.js 20+
- pnpm (recommandé)

## Installation

```bash
pnpm install
```

## Commandes

| Commande        | Description                    |
|-----------------|--------------------------------|
| `pnpm dev`      | Serveur de développement      |
| `pnpm build`    | Build de production            |
| `pnpm start`    | Démarrer en production         |
| `pnpm lint`     | Linter le code (ESLint)        |
| `npx tsc --noEmit` | Verifier le typage TypeScript |

## Structure

- `app/` — Routes Next.js (App Router) : accueil, playground, exercices
- `components/` — Composants React et UI (shadcn)
- `lib/` — Logique métier, templates, utils, types
- `data/` — Donnees statiques : `exercises.json` (exercices de code)

## Exercices

Les exercices sont définis dans **`data/exercises.json`**. Chaque entrée peut contenir :

- `id`, `title`, `description`, `instructions` (texte ou markdown)
- `templateId` : `"react"` ou `"html"`
- `entryFile` : fichier ouvert par défaut (ex. `"/App.js"`)
- `initialFiles` (optionnel) : surcharge des fichiers du template
- `validation` : tableau de règles mock (type `contains` : le fichier doit contenir une chaîne ; type `not_contains` : il ne doit pas la contenir)
- `level`, `order` (optionnel)

La validation est **en mémoire** : au clic sur « Valider », les règles sont vérifiées sur le code actuel. Idéal pour tester le flux avant de brancher un backend.

Le parcours **SUSE / Rancher** ajoute les 51 exercices et le projet final de `JSurquin/suz-rancher`, intégrés en données locales avec leurs corrigés. Recherchez « SUSE / Rancher » dans la liste. Les manipulations utilisent un labo externe ; la validation porte sur les fichiers ou réponses rédigés. Voir [le détail de l’import et les prérequis](docs/exercices-suz-rancher.md).

## Déploiement

Le projet est prêt pour un déploiement sur [Vercel](https://vercel.com) (framework Next.js détecté automatiquement).

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui (new-york)
- Monaco Editor, Sandpack (CodeSandbox)
- Polices : Geist (next/font)
