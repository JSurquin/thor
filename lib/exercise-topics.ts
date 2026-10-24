import type { Exercise } from "./types";

export const EXERCISE_TOPICS = [
  "web",
  "linux",
  "docker",
  "compose",
  "kubernetes",
  "rke2",
  "rancher",
  "storage",
  "security",
  "monitoring",
  "gitops",
  "projects",
] as const;

export type ExerciseTopic = (typeof EXERCISE_TOPICS)[number];

/** Classification par identifiants stables, indépendante de la langue affichée. */
export function getExerciseTopic(
  exercise: Pick<Exercise, "id" | "templateId">,
): ExerciseTopic {
  const { id, templateId } = exercise;
  if (id === "suz-rancher-projet-final") return "projects";
  if (id === "suz-rancher-rancher-prime-fleet") return "gitops";
  if (
    [
      "k8s-pvc",
      "suz-rancher-kubernetes-avance-pvc",
      "suz-rancher-rancher-prime-longhorn",
    ].includes(id)
  )
    return "storage";
  if (
    [
      "k8s-secret-env",
      "k8s-service-account",
      "suz-rancher-kubernetes-avance-secret",
      "suz-rancher-kubernetes-avance-network-policy",
      "suz-rancher-rancher-prime-cis",
      "suz-rancher-rke2-securite",
      "suz-rancher-rancher-rbac",
    ].includes(id)
  )
    return "security";
  if (
    id.startsWith("suz-rancher-supervision-") ||
    id === "suz-rancher-rancher-prime-monitoring"
  )
    return "monitoring";
  if (
    id.startsWith("suz-rancher-rancher-") ||
    id.startsWith("suz-rancher-workloads-rancher-") ||
    id === "suz-rancher-kubernetes-avance-marketplace"
  )
    return "rancher";
  if (
    id.startsWith("suz-rancher-rke2-") ||
    id === "suz-rancher-kubernetes-prerequis-rke2"
  )
    return "rke2";
  if (
    id.startsWith("docker-compose-") ||
    id.startsWith("suz-rancher-compose-et-podman-")
  )
    return "compose";
  if (id.startsWith("suz-rancher-suse-") || templateId === "bash")
    return "linux";
  if (templateId === "docker") return "docker";
  if (templateId === "kubernetes") return "kubernetes";
  return "web";
}

export function normalizeExerciseSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/[’']/g, " ");
}

/** Chaque mot est recherché dans les consignes et les métadonnées, sans les corrigés. */
export function matchesExerciseSearch(
  exercise: Exercise,
  query: string,
  topicLabel = "",
): boolean {
  const words = normalizeExerciseSearch(query)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const content = normalizeExerciseSearch(
    `${exercise.title} ${exercise.description} ${exercise.instructions} ${exercise.templateId} ${topicLabel}`,
  );
  return words.every((word) => content.includes(word));
}
