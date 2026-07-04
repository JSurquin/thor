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
}
