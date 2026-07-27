import type { Messages } from "../types";

export const pl: Messages = {
  locale: "pl",
  validation: {
    criterionOk: "Kryterium spełnione.",
    expressionOk: "Wyrażenie poprawne.",
    missingSubstring: (substring, file) =>
      `Brakuje: « ${substring} » w pliku ${file}.`,
    mustNotContain: (substring, file) =>
      `« ${substring} » nie powinno występować w pliku ${file}.`,
    patternMismatch: (file) =>
      `Zawartość pliku ${file} nie pasuje do oczekiwanego wzorca.`,
    invalidRegex: (file) => `Nieprawidłowy wzorzec regex dla ${file}.`,
  },
  exercises: {
    pageTitle: "Ćwiczenia programistyczne",
    pageSubtitle:
      "Wybierz ćwiczenie, koduj w edytorze i zweryfikuj swoje rozwiązanie.",
    searchPlaceholder: "Szukaj po tytule lub opisie…",
    localProgress: "Postęp lokalny",
    validatedCount: (done, total) => `${done} / ${total} ukończonych`,
    resetProgress: "Resetuj",
    resetProgressTitle: "Zresetować postęp?",
    resetProgressDescription:
      "Odznaki « ukończone » na tej liście zostaną usunięte na tym urządzeniu (pamięć lokalna przeglądarki). Szkice ćwiczeń nie zostaną usunięte.",
    cancel: "Anuluj",
    reset: "Resetuj",
    resetSuccess: "Postęp zresetowany",
    allLevels: "Wszystkie poziomy",
    allTemplates: "Wszystkie szablony",
    sortOrder: "Kolejność kursu",
    sortTitle: "Tytuł (A–Z)",
    sortLevel: "Poziom",
    levelDebutant: "Początkujący",
    levelIntermediaire: "Średniozaawansowany",
    levelAvance: "Zaawansowany",
    noResults:
      "Żadne ćwiczenie nie pasuje do tych kryteriów. Zmień wyszukiwanie, sortowanie lub filtry.",
    exerciseValidated: "Ćwiczenie ukończone",
    templateReact: "React",
    templateNext: "Next.js",
    templateVue: "Vue",
    templateHtml: "HTML",
    templateJavascript: "JavaScript",
    templateBash: "Bash",
  },
  exercise: {
    backToList: "Powrót do ćwiczeń",
    help: "Pomoc",
    hint: "Wskazówka",
    solution: "Rozwiązanie",
    share: "Udostępnij",
    copy: "Kopiuj",
    reset: "Reset",
    offline: "Offline",
    validate: "Sprawdź",
    tabInstructions: "Treść",
    tabEditor: "Kod",
    tabPreview: "Podgląd",
    instructionsHeading: "Treść zadania",
    previewHeading: "Podgląd",
    noPreview: "Brak podglądu dla tego szablonu.",
    loadingEditor: "Ładowanie edytora…",
    loading: "Ładowanie…",
    notFound: "Nie znaleziono ćwiczenia.",
    backToExercises: "Powrót do ćwiczeń",
    correctionTitle: "Korekta",
    correctionSheetDescription:
      "Animowana korekta kryterium po kryterium po walidacji kodu.",
    correctionProgress: (current, total) => `${current} / ${total}`,
    correctionAllPassed: "Wszystkie kryteria spełnione!",
    correctionSomeFailed: "Popraw wskazane punkty powyżej.",
    validateSuccess: "Wszystkie kryteria spełnione!",
    validateError: "Popraw błędy.",
    resetSuccess: "Kod zresetowany",
    copyFileSuccess: (name) => `« ${name} » skopiowano`,
    copyFileError: "Kopiowanie niemożliwe",
    shareSuccess: "Link skopiowany",
    shareError: "Nie można skopiować linku",
    shareTooLong: "Link zbyt długi (skróć kod).",
    draftNotSaved:
      "Szkic nie zapisany (za duży dla pamięci lokalnej)",
    resumeDraftTitle: "Wznowić szkic?",
    resumeDraftDescription: (savedAt) =>
      `Istnieje lokalna kopia tego ćwiczenia (${savedAt}).`,
    resumeDraftFresh: "Zacznij od nowa",
    hintDialogTitle: "Wskazówka",
    hintDialogDescription:
      "Wskazówka do tego ćwiczenia, bez pełnego rozwiązania",
    solutionConfirmTitle: "Pokazać rozwiązanie?",
    solutionConfirmDescription:
      "Podsumowanie pojawi się tutaj. Aby zobaczyć animowaną korektę kryterium po kryterium, użyj Waliduj (✓), a nie Rozwiązanie.",
    solutionConfirmShow: "Pokaż",
    solutionDialogTitle: "Rozwiązanie",
    solutionDialogDescription:
      "Podsumowanie i pliki referencyjne dla tego ćwiczenia",
    home: "Strona główna",
    exercisesBreadcrumb: "Ćwiczenia",
    languageLabel: "Język",
  },
  remoteLab: {
    header: (image, providerLabel) =>
      `Lab w chmurze — ${image} (${providerLabel})`,
    description:
      "Prawdziwe środowisko Linux w chmurze: Docker, Kubernetes lub polecenia systemowe — bez instalacji na komputerze. Sesja startuje na żądanie i kończy się automatycznie.",
    billingInfo: (usdPerMinute, maxMinutes) =>
      `Szacunek: ~${usdPerMinute} USD/min, limit ${maxMinutes} min na sesję.`,
    billingNote:
      "Rozliczenie za minutę (automatyczne zatrzymanie po ćwiczeniu). Azure B-series lub AWS t4g.micro.",
    startLab: "Uruchom lab",
    stopLab: "Zatrzymaj lab",
    startError: "Nie udało się uruchomić labu.",
    sessionReady: (sessionId) =>
      `Sesja gotowa (${sessionId}). Połączenie terminala w przygotowaniu.`,
    terminalPlaceholder:
      "Terminal WebSocket (xterm.js) pojawi się tutaj po podłączeniu orchestratora Azure/AWS.",
  },
};
