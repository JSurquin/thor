import type { ResourcesData } from "./types";
import data from "@/data/resources.json";

export function getResources(): ResourcesData {
  return data as ResourcesData;
}

export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

export function getPlaylistEmbedUrl(youtubePlaylistId: string): string {
  return `https://www.youtube.com/embed/videoseries?list=${youtubePlaylistId}&autoplay=1`;
}

export function getPlaylistExternalUrl(youtubePlaylistId: string): string {
  return `https://www.youtube.com/playlist?list=${youtubePlaylistId}`;
}
