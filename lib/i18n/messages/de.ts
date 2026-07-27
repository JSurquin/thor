import type { Messages } from "../types";

export const de: Messages = {
  locale: "de",
  validation: {
    criterionOk: "Kriterium erfüllt.",
    expressionOk: "Ausdruck korrekt.",
    missingSubstring: (substring, file) =>
      `Es fehlt: « ${substring} » in ${file}.`,
    mustNotContain: (substring, file) =>
      `« ${substring} » darf nicht in ${file} vorkommen.`,
    patternMismatch: (file) =>
      `Der Inhalt von ${file} entspricht nicht dem erwarteten Muster.`,
    invalidRegex: (file) => `Ungültiges Regex-Muster für ${file}.`,
  },
  exercises: {
    pageTitle: "Programmierübungen",
    pageSubtitle:
      "Wählen Sie eine Übung, codieren Sie im Editor und validieren Sie Ihre Lösung.",
    searchPlaceholder: "Nach Titel oder Beschreibung suchen…",
    localProgress: "Lokaler Fortschritt",
    validatedCount: (done, total) => `${done} / ${total} abgeschlossen`,
    resetProgress: "Zurücksetzen",
    resetProgressTitle: "Fortschritt zurücksetzen?",
    resetProgressDescription:
      "Die « abgeschlossen »-Häkchen auf dieser Liste werden auf diesem Gerät gelöscht (Browser-Speicher). Ihre Übungsentwürfe werden nicht gelöscht.",
    cancel: "Abbrechen",
    reset: "Zurücksetzen",
    resetSuccess: "Fortschritt zurückgesetzt",
    allLevels: "Alle Niveaus",
    allTemplates: "Alle Vorlagen",
    sortOrder: "Reihenfolge des Kurses",
    sortTitle: "Titel (A–Z)",
    sortLevel: "Niveau",
    levelDebutant: "Anfänger",
    levelIntermediaire: "Mittelstufe",
    levelAvance: "Fortgeschritten",
    noResults:
      "Keine Übung entspricht diesen Kriterien. Ändern Sie Suche, Sortierung oder Filter.",
    exerciseValidated: "Übung abgeschlossen",
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
    backToList: "Zurück zu den Übungen",
    help: "Hilfe",
    hint: "Hinweis",
    solution: "Lösung",
    share: "Teilen",
    copy: "Kopieren",
    reset: "Reset",
    offline: "Offline",
    validate: "Prüfen",
    tabInstructions: "Aufgabe",
    tabEditor: "Code",
    tabPreview: "Vorschau",
    instructionsHeading: "Aufgabenstellung",
    previewHeading: "Vorschau",
    noPreview: "Keine Vorschau für diese Vorlage.",
    loadingEditor: "Editor wird geladen…",
    loading: "Laden…",
    notFound: "Übung nicht gefunden.",
    backToExercises: "Zurück zu den Übungen",
    correctionTitle: "Korrektur",
    correctionSheetDescription:
      "Animierte Korrektur Kriterium für Kriterium nach der Code-Validierung.",
    correctionProgress: (current, total) => `${current} / ${total}`,
    correctionAllPassed: "Alle Kriterien erfüllt!",
    correctionSomeFailed: "Korrigieren Sie die oben markierten Punkte.",
    validateSuccess: "Alle Kriterien erfüllt!",
    validateError: "Fehler korrigieren.",
    resetSuccess: "Code zurückgesetzt",
    copyFileSuccess: (name) => `« ${name} » kopiert`,
    copyFileError: "Kopieren nicht möglich",
    shareSuccess: "Freigabelink kopiert",
    shareError: "Link konnte nicht kopiert werden",
    shareTooLong: "Link zu lang (Code kürzen).",
    draftNotSaved:
      "Entwurf nicht gespeichert (zu groß für lokalen Speicher)",
    resumeDraftTitle: "Entwurf fortsetzen?",
    resumeDraftDescription: (savedAt) =>
      `Eine lokale Sicherung für diese Übung existiert (${savedAt}).`,
    resumeDraftFresh: "Neu beginnen",
    hintDialogTitle: "Hinweis",
    hintDialogDescription:
      "Hinweis für diese Übung, ohne die vollständige Lösung",
    solutionConfirmTitle: "Lösung anzeigen?",
    solutionConfirmDescription:
      "Die Zusammenfassung wird hier angezeigt. Für eine animierte Korrektur Kriterium für Kriterium nutzen Sie Validieren (✓), nicht Lösung.",
    solutionConfirmShow: "Anzeigen",
    solutionDialogTitle: "Lösung",
    solutionDialogDescription:
      "Zusammenfassung und Referenzdateien für diese Übung",
    home: "Startseite",
    exercisesBreadcrumb: "Übungen",
    languageLabel: "Sprache",
  },
  remoteLab: {
    header: (image, providerLabel) =>
      `Cloud-Lab — ${image} (${providerLabel})`,
    description:
      "Echte Linux-Umgebung in der Cloud: Docker, Kubernetes oder Systembefehle — ohne lokale Installation. Die Sitzung startet auf Abruf und endet automatisch.",
    billingInfo: (usdPerMinute, maxMinutes) =>
      `Schätzung: ~${usdPerMinute} USD/Minute, max. ${maxMinutes} Min. pro Sitzung.`,
    billingNote:
      "Abrechnung pro Minute (automatischer Stopp nach der Übung). Azure B-series oder AWS t4g.micro.",
    startLab: "Lab starten",
    stopLab: "Lab stoppen",
    startError: "Lab konnte nicht gestartet werden.",
    sessionReady: (sessionId) =>
      `Sitzung bereit (${sessionId}). Terminalverbindung folgt.`,
    terminalPlaceholder:
      "Das WebSocket-Terminal (xterm.js) erscheint hier nach Anbindung an Azure/AWS.",
  },
};
