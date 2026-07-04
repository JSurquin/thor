export interface VideoResource {
  id: string;
  title: string;
  duration: string;
}

/** Playlist soit avec liste de vidéos (videos), soit avec ID playlist YouTube (youtubePlaylistId). */
export interface PlaylistResource {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  /** Liste locale de vidéos (optionnel). */
  videos?: VideoResource[];
  /** ID de la playlist YouTube (ex. PLJaM5P-THN_xxx). Si présent, le lecteur embarque toute la playlist. */
  youtubePlaylistId?: string;
}

export interface CategoryResource {
  id: string;
  title: string;
  description: string;
  playlists: PlaylistResource[];
}

export interface ResourcesData {
  categories: CategoryResource[];
}

// ——— Exercices (samples JSON, validation mock in-memory) ———

export type ExerciseTemplateId =
  | "react"
  | "next"
  | "vue"
  | "html"
  | "javascript"
  | "bash";

/** Critère de validation mock : le code doit contenir cette chaîne (ex: "useState") */
export interface ExerciseValidationContains {
  type: "contains";
  /** Fichier cible (ex: "/App.js") */
  file: string;
  /** Chaîne qui doit être présente dans le fichier */
  substring: string;
  /** Message si validé */
  successMessage?: string;
}

/** Critère : le code ne doit pas contenir cette chaîne */
export interface ExerciseValidationNotContains {
  type: "not_contains";
  file: string;
  substring: string;
  failMessage?: string;
}

/** Critère : le fichier doit matcher une expression régulière */
export interface ExerciseValidationMatches {
  type: "matches";
  file: string;
  pattern: string;
  flags?: string;
  successMessage?: string;
  failMessage?: string;
}

export type ExerciseValidation =
  | ExerciseValidationContains
  | ExerciseValidationNotContains
  | ExerciseValidationMatches;

export interface Exercise {
  id: string;
  title: string;
  description: string;
  /** Instructions markdown ou texte affichées au-dessus de l’éditeur */
  instructions: string;
  /** Template de base (react, next, vue, html, javascript) */
  templateId: ExerciseTemplateId;
  /** Fichiers initiaux (clés avec ou sans /). Si absent, on utilise le template par défaut. */
  initialFiles?: Record<string, string>;
  /** Fichier à ouvrir en premier */
  entryFile?: string;
  /** Règles de validation mock (vérifiées au clic "Valider") */
  validation: ExerciseValidation[];
  /** Niveau affiché (débutant, intermédiaire, avancé) */
  level?: "debutant" | "intermediaire" | "avance";
  /** Ordre d’affichage dans la liste */
  order?: number;
  /** Indice court (affiché sur demande, sans spoiler la solution complète) */
  hint?: string;
  /** Paragraphe récapitulatif de la solution */
  solutionSummary?: string;
  /** Fichiers « solution » (affichés après confirmation) */
  solutionFiles?: Record<string, string>;
}
