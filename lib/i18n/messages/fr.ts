import type { Messages } from "../types";

export const fr: Messages = {
  locale: "fr",
  validation: {
    criterionOk: "Critère respecté.",
    expressionOk: "Expression respectée.",
    missingSubstring: (substring, file) =>
      `Il manque : « ${substring} » dans ${file}.`,
    mustNotContain: (substring, file) =>
      `« ${substring} » ne doit pas être dans ${file}.`,
    patternMismatch: (file) =>
      `Le contenu de ${file} ne correspond pas au motif attendu.`,
    invalidRegex: (file) => `Motif regex invalide pour ${file}.`,
  },
  exercises: {
    pageTitle: "Exercices de code",
    pageSubtitle:
      "Choisissez un exercice, codez dans l’éditeur et validez votre solution.",
    searchPlaceholder: "Rechercher par titre ou description…",
    localProgress: "Progression locale",
    validatedCount: (done, total) => `${done} / ${total} validés`,
    resetProgress: "Réinitialiser",
    resetProgressTitle: "Réinitialiser la progression ?",
    resetProgressDescription:
      "Les coches « validés » sur cette liste seront effacées sur cet appareil (stockage local du navigateur). Vos brouillons d’exercices ne sont pas supprimés.",
    cancel: "Annuler",
    reset: "Réinitialiser",
    resetSuccess: "Progression réinitialisée",
    allLevels: "Tous les niveaux",
    allTemplates: "Tous les templates",
    sortOrder: "Ordre du parcours",
    sortTitle: "Titre (A–Z)",
    sortLevel: "Niveau",
    levelDebutant: "Débutant",
    levelIntermediaire: "Intermédiaire",
    levelAvance: "Avancé",
    noResults:
      "Aucun exercice ne correspond à ces critères. Modifiez la recherche, le tri ou les filtres.",
    exerciseValidated: "Exercice validé",
    templateReact: "React",
    templateNext: "Next.js",
    templateVue: "Vue",
    templateHtml: "HTML",
    templateJavascript: "JavaScript",
    templateBash: "Bash",
    templateDocker: "Docker",
    templateKubernetes: "Kubernetes",
  },
  exercise: {
    backToList: "Retour aux exercices",
    help: "Aide",
    hint: "Indice",
    solution: "Solution",
    share: "Partager",
    copy: "Copier",
    reset: "Reset",
    offline: "Hors ligne",
    validate: "Valider",
    tabInstructions: "Énoncé",
    tabEditor: "Code",
    tabPreview: "Aperçu",
    instructionsHeading: "Énoncé",
    previewHeading: "Aperçu",
    noPreview: "Aucun aperçu pour ce template.",
    loadingEditor: "Chargement de l’éditeur…",
    loading: "Chargement…",
    notFound: "Exercice introuvable.",
    backToExercises: "Retour aux exercices",
    correctionTitle: "Correction",
    correctionSheetDescription:
      "Correction animée critère par critère après validation de votre code.",
    correctionProgress: (current, total) => `${current} / ${total}`,
    correctionAllPassed: "Tous les critères sont validés !",
    correctionSomeFailed: "Corrigez les points signalés ci-dessus.",
    validateSuccess: "Tous les critères sont validés !",
    validateError: "Corrigez les erreurs.",
    resetSuccess: "Code réinitialisé",
    copyFileSuccess: (name) => `« ${name} » copié`,
    copyFileError: "Copie impossible",
    shareSuccess: "Lien de partage copié",
    shareError: "Copie du lien impossible",
    shareTooLong: "Lien trop long pour le partage (réduisez le code).",
    draftNotSaved:
      "Brouillon non sauvegardé (trop volumineux pour le stockage local)",
    resumeDraftTitle: "Reprendre votre brouillon ?",
    resumeDraftDescription: (savedAt) =>
      `Une sauvegarde locale pour cet exercice existe (${savedAt}).`,
    resumeDraftFresh: "Repartir de l’énoncé",
    hintDialogTitle: "Indice",
    hintDialogDescription:
      "Indice pour cet exercice, sans la solution complète",
    solutionConfirmTitle: "Afficher la solution ?",
    solutionConfirmDescription:
      "Le récapitulatif s’affichera ici. Pour une correction animée critère par critère, utilisez le bouton Valider (✓), pas Solution.",
    solutionConfirmShow: "Afficher",
    solutionDialogTitle: "Solution",
    solutionDialogDescription:
      "Récapitulatif et fichiers de référence pour cet exercice",
    home: "Accueil",
    exercisesBreadcrumb: "Exercices",
    languageLabel: "Langue",
  },
  remoteLab: {
    header: (image, providerLabel) =>
      `Lab cloud — ${image} (${providerLabel})`,
    description:
      "Environnement Linux réel dans le cloud : Docker, Kubernetes ou commandes système, sans rien installer sur votre machine. La session démarre à la demande et s’arrête automatiquement.",
    billingInfo: (usdPerMinute, maxMinutes) =>
      `Estimation : ~${usdPerMinute} USD/minute, plafond ${maxMinutes} min par session.`,
    billingNote:
      "Facturation à la minute (arrêt automatique à la fin de l’exercice). Azure B-series ou AWS t4g.micro selon disponibilité.",
    startLab: "Démarrer le lab",
    stopLab: "Arrêter le lab",
    startError: "Impossible de démarrer le lab pour le moment.",
    sessionReady: (sessionId) =>
      `Session prête (${sessionId}). Connexion terminal à brancher.`,
    terminalPlaceholder:
      "Le terminal WebSocket (xterm.js) sera affiché ici une fois l’orchestrateur Azure/AWS connecté.",
  },
};
