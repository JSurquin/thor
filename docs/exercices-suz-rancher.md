# Exercices SUSE / Rancher

Le catalogue local `data/exercises-suz-rancher.json` reprend les **51 exercices** des 11 modules d’exercices inclus par `slides.md`, ainsi que le **projet final du Jour 5** de [JSurquin/suz-rancher](https://github.com/JSurquin/suz-rancher/tree/bd17eda410b1a48a4f2bc97b93222bd3242d0ad2). Révision source : `bd17eda410b1a48a4f2bc97b93222bd3242d0ad2`.

Les anciennes pages Linux présentes dans le dépôt mais absentes du parcours Slidev actif ne font pas partie de cet import. Les exercices optionnels et d’approfondissement du parcours actif sont inclus.

| Module source | Exercices |
| --- | ---: |
| Écosystème SUSE | 6 |
| Conteneurs Linux / Docker | 4 |
| Dockerfile et stockage | 3 |
| Docker Compose et Podman | 2 |
| Fondamentaux Kubernetes (bonus inclus) | 6 |
| RKE2 | 6 |
| Installation et administration Rancher | 4 |
| Workloads Rancher | 4 |
| Gestion avancée Kubernetes / Rancher | 5 |
| Supervision et maintenance | 6 |
| SUSE Rancher Prime | 5 |
| Projet final (les cinq étapes ensemble) | 1 |

Les identifiants sont préfixés par `suz-rancher-`, et les entrées suivent les exercices existants dans le catalogue. La recherche « SUSE » ou « Rancher » permet de les retrouver ; les filtres Bash, Docker et Kubernetes restent disponibles.

## Utilisation

Chaque entrée contient les consignes du support, un lien vers sa source figée, un fichier README et un compte rendu à compléter. Les diapositives de continuation restent groupées avec leur exercice. Les corrigés sont disponibles via l’action de solution existante. Le Dockerfile et le Compose proposent aussi un fichier de départ à compléter, validé directement dans l’éditeur.

Le projet final embarque les quatre applications (Next.js, Java, Node et Python), leurs Dockerfile, `lab/docker-compose.yml` et tous les manifests `lab/k8s/`. L’export ZIP existant permet de les récupérer. Les scripts d’installation du sandbox Ubuntu/k3s ne sont pas importés : le parcours de formation utilise SUSE/RKE2. Le support intégral du Jour 5 reste dans les consignes et le README.

Aucune lecture du dépôt GitHub n’est nécessaire à l’exécution de Thor. Les outils ou images nécessaires aux manipulations de labo peuvent naturellement demander une connexion réseau.

## Portée des contrôles

Ces exercices utilisent le mode `external` : ils ne lancent ni le terminal Bash simulé, ni une session cloud facturée. Le labo réel (VM SUSE, Docker, cluster RKE2 et interface Rancher selon le module) doit être fourni séparément. Les prérequis et variantes du support sont conservés.

Les validations locales vérifient uniquement des éléments attendus dans les fichiers ou les réponses rédigées ; elles ne prouvent pas qu’une installation, un déploiement, un contrôle RBAC ou une restauration fonctionne réellement. Les comptes rendus ne doivent contenir aucun vrai secret. Les valeurs d’exemple présentes dans les corrigés viennent du support de formation.

Le mode `initialFilesMode: "replace"` conserve l’arborescence propre à chaque exercice, sans ajouter les fichiers génériques du template. Les autres exercices continuent à fusionner leurs fichiers avec ceux du template.
