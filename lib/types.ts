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
