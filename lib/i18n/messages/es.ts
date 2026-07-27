import type { Messages } from "../types";

export const es: Messages = {
  locale: "es",
  validation: {
    criterionOk: "Criterio cumplido.",
    expressionOk: "Expresión correcta.",
    missingSubstring: (substring, file) =>
      `Falta: « ${substring} » en ${file}.`,
    mustNotContain: (substring, file) =>
      `« ${substring} » no debe estar en ${file}.`,
    patternMismatch: (file) =>
      `El contenido de ${file} no coincide con el patrón esperado.`,
    invalidRegex: (file) => `Patrón regex inválido para ${file}.`,
  },
  exercises: {
    pageTitle: "Ejercicios de código",
    pageSubtitle:
      "Elige un ejercicio, codifica en el editor y valida tu solución.",
    searchPlaceholder: "Buscar por título o descripción…",
    localProgress: "Progreso local",
    validatedCount: (done, total) => `${done} / ${total} validados`,
    resetProgress: "Reiniciar",
    resetProgressTitle: "¿Reiniciar el progreso?",
    resetProgressDescription:
      "Las marcas « validados » de esta lista se borrarán en este dispositivo (almacenamiento local del navegador). Tus borradores de ejercicios no se eliminan.",
    cancel: "Cancelar",
    reset: "Reiniciar",
    resetSuccess: "Progreso reiniciado",
    allLevels: "Todos los niveles",
    allTemplates: "Todas las plantillas",
    sortOrder: "Orden del recorrido",
    sortTitle: "Título (A–Z)",
    sortLevel: "Nivel",
    levelDebutant: "Principiante",
    levelIntermediaire: "Intermedio",
    levelAvance: "Avanzado",
    noResults:
      "Ningún ejercicio coincide con estos criterios. Modifica la búsqueda, el orden o los filtros.",
    exerciseValidated: "Ejercicio validado",
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
    backToList: "Volver a ejercicios",
    help: "Ayuda",
    hint: "Pista",
    solution: "Solución",
    share: "Compartir",
    copy: "Copiar",
    reset: "Reset",
    offline: "Sin conexión",
    validate: "Validar",
    tabInstructions: "Enunciado",
    tabEditor: "Código",
    tabPreview: "Vista previa",
    instructionsHeading: "Enunciado",
    previewHeading: "Vista previa",
    noPreview: "Sin vista previa para esta plantilla.",
    loadingEditor: "Cargando el editor…",
    loading: "Cargando…",
    notFound: "Ejercicio no encontrado.",
    backToExercises: "Volver a ejercicios",
    correctionTitle: "Corrección",
    correctionSheetDescription:
      "Corrección animada criterio por criterio tras validar tu código.",
    correctionProgress: (current, total) => `${current} / ${total}`,
    correctionAllPassed: "¡Todos los criterios validados!",
    correctionSomeFailed: "Corrige los puntos señalados arriba.",
    validateSuccess: "¡Todos los criterios validados!",
    validateError: "Corrige los errores.",
    resetSuccess: "Código reiniciado",
    copyFileSuccess: (name) => `« ${name} » copiado`,
    copyFileError: "Copia imposible",
    shareSuccess: "Enlace copiado",
    shareError: "No se pudo copiar el enlace",
    shareTooLong: "Enlace demasiado largo (reduce el código).",
    draftNotSaved:
      "Borrador no guardado (demasiado grande para almacenamiento local)",
    resumeDraftTitle: "¿Reanudar tu borrador?",
    resumeDraftDescription: (savedAt) =>
      `Existe una copia local de este ejercicio (${savedAt}).`,
    resumeDraftFresh: "Empezar de nuevo",
    hintDialogTitle: "Pista",
    hintDialogDescription:
      "Pista para este ejercicio, sin la solución completa",
    solutionConfirmTitle: "¿Mostrar la solución?",
    solutionConfirmDescription:
      "El resumen se mostrará aquí. Para una corrección animada criterio por criterio, usa Validar (✓), no Solución.",
    solutionConfirmShow: "Mostrar",
    solutionDialogTitle: "Solución",
    solutionDialogDescription:
      "Resumen y archivos de referencia para este ejercicio",
    home: "Inicio",
    exercisesBreadcrumb: "Ejercicios",
    languageLabel: "Idioma",
  },
  remoteLab: {
    header: (image, providerLabel) =>
      `Lab en la nube — ${image} (${providerLabel})`,
    description:
      "Entorno Linux real en la nube: Docker, Kubernetes o comandos del sistema, sin instalar nada en su máquina. La sesión se inicia bajo demanda y se detiene sola.",
    billingInfo: (usdPerMinute, maxMinutes) =>
      `Estimación: ~${usdPerMinute} USD/minuto, tope ${maxMinutes} min por sesión.`,
    billingNote:
      "Facturación por minuto (parada automática al terminar). Azure B-series o AWS t4g.micro según disponibilidad.",
    startLab: "Iniciar el lab",
    stopLab: "Detener el lab",
    startError: "No se pudo iniciar el lab.",
    sessionReady: (sessionId) =>
      `Sesión lista (${sessionId}). Conexión de terminal pendiente.`,
    terminalPlaceholder:
      "El terminal WebSocket (xterm.js) aparecerá aquí al conectar el orquestador Azure/AWS.",
  },
};
