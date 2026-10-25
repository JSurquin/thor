import type { ExerciseTopic } from "../exercise-topics";

export const LOCALES = ["fr", "pl", "de", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  pl: "Polski",
  de: "Deutsch",
  es: "Español",
};

export interface ValidationMessages {
  criterionOk: string;
  expressionOk: string;
  missingSubstring: (substring: string, file: string) => string;
  mustNotContain: (substring: string, file: string) => string;
  patternMismatch: (file: string) => string;
  invalidRegex: (file: string) => string;
}

export interface Messages {
  locale: Locale;
  validation: ValidationMessages;
  ux: {
    importZip: string;
    moreActions: string;
    labContext: string;
    maximize: string;
    restore: string;
    resize: string;
    resumeExercise: string;
    inProgress: string;
    continueExercise: string;
    previewLoading: string;
    previewSlow: string;
    previewError: string;
    retry: string;
    previewReady: string;
    errorDetails: string;
    lightTheme: string;
    darkTheme: string;
    systemTheme: string;
    theme: string;
    layoutHint: string;
  };
  studio: {
    home: string;
    exercises: string;
    playground: string;
    eyebrow: string;
    homeTitle: string;
    homeAccent: string;
    homeDescription: string;
    explore: string;
    openPlayground: string;
    topicsTitle: string;
    topicsDescription: string;
    allTopics: string;
    themes: string;
    topicsLabel: string;
    searchLabel: string;
    searchHint: string;
    clearSearch: string;
    clearFilters: string;
    allStatuses: string;
    statusLabel: string;
    completed: string;
    toDo: string;
    openExercise: string;
    browseLabel: string;
    progressDescription: string;
    footer: string;
    editorFeature: string;
    previewFeature: string;
    exportFeature: string;
    codeLabel: string;
    previewLabel: string;
    readyLabel: string;
    topicNames: Record<ExerciseTopic, string>;
    exerciseCount: (count: number) => string;
    templateCount: (count: number) => string;
    results: (count: number) => string;
    viewTopic: (count: number) => string;
  };
  exercises: {
    pageTitle: string;
    pageSubtitle: string;
    searchPlaceholder: string;
    localProgress: string;
    validatedCount: (done: number, total: number) => string;
    resetProgress: string;
    resetProgressTitle: string;
    resetProgressDescription: string;
    cancel: string;
    reset: string;
    resetSuccess: string;
    allLevels: string;
    allTemplates: string;
    sortOrder: string;
    sortTitle: string;
    sortLevel: string;
    levelDebutant: string;
    levelIntermediaire: string;
    levelAvance: string;
    noResults: string;
    exerciseValidated: string;
    templateReact: string;
    templateNext: string;
    templateVue: string;
    templateHtml: string;
    templateJavascript: string;
    templateBash: string;
    templateDocker: string;
    templateKubernetes: string;
  };
  exercise: {
    backToList: string;
    help: string;
    hint: string;
    solution: string;
    share: string;
    copy: string;
    reset: string;
    offline: string;
    validate: string;
    tabInstructions: string;
    tabEditor: string;
    tabPreview: string;
    instructionsHeading: string;
    previewHeading: string;
    noPreview: string;
    loadingEditor: string;
    loading: string;
    notFound: string;
    backToExercises: string;
    correctionTitle: string;
    correctionSheetDescription: string;
    correctionProgress: (current: number, total: number) => string;
    correctionAllPassed: string;
    correctionSomeFailed: string;
    validateSuccess: string;
    validateError: string;
    resetSuccess: string;
    copyFileSuccess: (name: string) => string;
    copyFileError: string;
    shareSuccess: string;
    shareError: string;
    shareTooLong: string;
    draftNotSaved: string;
    resumeDraftTitle: string;
    resumeDraftDescription: (savedAt: string) => string;
    resumeDraftFresh: string;
    hintDialogTitle: string;
    hintDialogDescription: string;
    solutionConfirmTitle: string;
    solutionConfirmDescription: string;
    solutionConfirmShow: string;
    solutionDialogTitle: string;
    solutionDialogDescription: string;
    home: string;
    exercisesBreadcrumb: string;
    languageLabel: string;
  };
  externalLab: {
    title: string;
    description: string;
    validationNote: string;
  };
  remoteLab: {
    header: (image: string, providerLabel: string) => string;
    description: string;
    billingInfo: (usdPerMinute: string, maxMinutes: string) => string;
    billingNote: string;
    startLab: string;
    stopLab: string;
    startError: string;
    sessionReady: (sessionId: string) => string;
    terminalPlaceholder: string;
  };
}
