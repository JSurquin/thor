# Instructions agent — Thor / lab.andromed

## Projet et public

Thor est le playground interactif utilisé pendant les formations Andromed : éditeur Monaco, aperçus Sandpack, exercices guidés, brouillons locaux et export ZIP. Le projet utilise Next.js App Router, React, TypeScript, Tailwind et shadcn/ui.

Les participants peuvent découvrir le sujet pour la première fois. Écrire les consignes en français clair, expliquer les prérequis avant les commandes et proposer une progression praticable. Pour le parcours SUSE / Rancher, conserver les repères pédagogiques du support source ; lorsqu’une analogie est utile, rester dans l’univers de l’usine.

Ce dépôt contient une application web et des exercices, pas le support Slidev. Les règles de mise en page des slides de `suz-rancher` ne s’appliquent pas ici.

## Repères dans le dépôt

- `app/` : routes, pages et API Next.js.
- `components/` : composants du playground, des exercices et de l’interface.
- `lib/templates.ts` : templates du playground.
- `lib/types.ts` : contrats des exercices et des environnements.
- `lib/exercises.ts` : catalogue, fichiers initiaux et validation locale.
- `lib/lab-runtime.ts` : résolution des modes d’exécution ; les sessions cloud sont actuellement des stubs.
- `lib/i18n/` : messages français, allemand, espagnol et polonais.
- `data/exercises*.json` : exercices intégrés au projet.
- `docs/exercices-suz-rancher.md` : provenance et périmètre du parcours importé.
- `e2e/` : parcours navigateur Playwright.

Lire les fichiers concernés et les tests existants avant de modifier leur comportement. Préserver les modifications utilisateur et limiter le diff à la tâche demandée.

## Préparer et lancer le projet

Utiliser le checkout existant. Les tâches cloud disposent déjà d’un environnement isolé ; ne pas créer de worktree sans demande explicite.

Le README demande Node.js 20 ou plus récent. La CI utilise Node.js 22 et déclare actuellement pnpm 9 ; attention, pnpm 9 refuse le `pnpm-workspace.yaml` actuel sans champ `packages`. L’environnement cloud a été vérifié avec Node.js 24.19.0 et pnpm 10.28.2. Utiliser pnpm 10.28.2 pour ce checkout tant que cette divergence n’est pas résolue ; ne pas réécrire le lockfile pour contourner une erreur d’installation.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

L’application standard ne nécessite ni base de données ni secret. Vérifier les exigences d’une fonctionnalité avant d’en ajouter. Les processus doivent être relancés après restauration d’un environnement cloud.

Les téléchargements de polices, de Monaco et des navigateurs Playwright peuvent dépendre du réseau et de la confiance des certificats. Diagnostiquer l’URL et l’erreur réelle ; conserver les vérifications TLS et ne pas remplacer un contrôle échoué par un faux succès.

## Préserver les exercices et la progression

Comme dans `suz-rancher`, ne pas supprimer spontanément du contenu pédagogique. Conserver les consignes, variantes, prérequis et corrigés lors d’une réorganisation. Si un retrait est nécessaire à la demande, expliquer son périmètre.

- Préserver les identifiants des exercices : ils servent aux URL, brouillons, partages et à la progression locale. Vérifier leur unicité et conserver l’ordre pédagogique.
- Respecter les types de `lib/types.ts` et les chemins de fichiers attendus par les validations.
- Le mode par défaut fusionne `initialFiles` avec le template. Utiliser `initialFilesMode: "replace"` pour une arborescence autonome.
- Les fichiers initiaux d’un exercice à compléter doivent échouer à au moins un critère ; le corrigé doit réussir tous les critères. Vérifier aussi qu’une réponse vide ou incomplète échoue.
- Ne pas affaiblir les règles ni désactiver un test pour faire passer un exercice incorrect.
- Conserver des exemples complets et cohérents : noms de ressources, ports, namespaces, images et chemins doivent correspondre entre énoncé, fichiers et solution.
- Ne jamais intégrer de vrais mots de passe, tokens ou kubeconfigs dans les données, exemples, journaux ou commits.

Pour les imports SUSE / Rancher, conserver une référence à une révision précise de la source et mettre à jour la documentation de provenance. Les exercices sont stockés localement : ne pas introduire de téléchargement GitHub à l’exécution pour charger leur contenu.

## Distinguer les environnements d’exécution

- `simulated` : simulation dans le navigateur ; annoncer ses limites.
- `remote` : parcours de session cloud, dont l’orchestration réelle n’est pas encore implémentée. Un objet de session ne prouve pas qu’une machine ou un terminal existe.
- `external` : labo fourni séparément par l’élève. Afficher les prérequis sans lancer de terminal simulé ou proposer une session cloud pour cet exercice.

Les validations locales vérifient le contenu des fichiers ou réponses rédigés. Elles ne prouvent pas l’état d’une VM, d’un cluster, d’une restauration ou des droits RBAC. Pour les TP du parcours SUSE, respecter SUSE/RKE2 ; ne pas remplacer ce parcours par le sandbox Ubuntu/k3s du dépôt source.

## Interface et traductions

Préserver la navigation clavier, les libellés accessibles, les vues mobiles, les thèmes et les fonctions de sauvegarde, reprise, partage, réinitialisation et export.

Ajouter les nouveaux messages d’interface dans les quatre langues de `lib/i18n/` et mettre à jour leur contrat TypeScript. Le contenu d’un exercice peut rester en français lorsque ses traductions ne sont pas fournies.

## Relecture pédagogique

Reprendre l’ordre de relecture du support `suz-rancher` pour toute création ou modification de consignes, indices, corrigés ou fichiers de labo :

1. **Voix humaine, avant rédaction** : formuler l’objectif, les prérequis et les gestes attendus dans une langue naturelle. Après rédaction, relire le diff avec le même regard.
2. **Actualité technique** : vérifier les commandes, versions, compatibilités et libellés d’interface concernés auprès des documentations officielles. Garder une version épinglée cohérente lorsqu’elle reste adaptée au parcours ; ne pas remplacer systématiquement par « latest ». Signaler les éléments qui n’ont pas pu être vérifiés.
3. **Élève débutant** : suivre le parcours depuis son état initial. Repérer les étapes implicites, vérifier les résultats attendus et distinguer ce que Thor contrôle de ce qui doit être testé dans le labo.

Corriger les points bloquants avant de livrer. Si une correction change à nouveau le contenu pédagogique, reprendre ces relectures sur le nouveau diff.

Les définitions de sous-agents du support source ne sont pas installées dans Thor. Effectuer ces relectures directement ; ne pas dépendre de fichiers `.cursor/agents/` absents ni prétendre avoir exécuté un sous-agent ou une recherche. Les changements purement techniques ou documentaires hors contenu pédagogique ne nécessitent pas ce cycle.

## Vérifications avant livraison

Pour un changement de code ou d’exercices, exécuter les contrôles pertinents parmi :

```bash
pnpm test:run
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e --workers=1
```

Pour un changement d’interface ou de parcours, vérifier le comportement dans le navigateur, pas seulement la réponse HTTP. Playwright démarre son serveur de développement sur le port 3333 ; arrêter uniquement les serveurs démarrés par l’agent si un autre `next dev` du même checkout empêche son lancement.

Adapter les tests à la portée du changement. Une modification documentaire seule ne demande pas de relancer toute la suite ; relire les instructions et exécuter `git diff --check`.

Distinguer les tests passés, échoués et non exécutés. Les erreurs de lint préexistantes et les problèmes réseau doivent être signalés sans être masqués. Ne pas annoncer l’éditeur fonctionnel si Monaco n’a pas chargé, même lorsque la page et les boutons répondent.

## Git et livraison

Comme dans `suz-rancher`, une tâche terminée se conclut par un commit conventional avec un message en anglais, puis un push sur `main`, sauf instruction contraire de l’utilisateur. Ne pas créer de branche distante ou de PR sans demande explicite.

Avant le commit, inspecter le statut et le diff ; inclure seulement les changements de la tâche. Avant le push, récupérer l’état distant et traiter toute divergence sans écraser le travail existant. Ne jamais forcer un push sur `main`. Si l’environnement utilise une branche locale de travail, un push normal `git push origin HEAD:main` convient après vérification de l’ascendance.

Le compte rendu final précise les changements livrés, les vérifications effectuées et les limites restantes. Ne pas annoncer un push réussi sans confirmation Git.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
