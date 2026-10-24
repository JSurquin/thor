import {
  BoxesIcon,
  Code2Icon,
  ContainerIcon,
  DatabaseIcon,
  GitBranchIcon,
  LayersIcon,
  MonitorDotIcon,
  NetworkIcon,
  RocketIcon,
  ServerIcon,
  ShieldCheckIcon,
  TerminalIcon,
} from "lucide-react";
import type { ExerciseTopic } from "@/lib/exercise-topics";

const icons = {
  web: Code2Icon,
  linux: TerminalIcon,
  docker: ContainerIcon,
  compose: LayersIcon,
  kubernetes: NetworkIcon,
  rke2: ServerIcon,
  rancher: BoxesIcon,
  storage: DatabaseIcon,
  security: ShieldCheckIcon,
  monitoring: MonitorDotIcon,
  gitops: GitBranchIcon,
  projects: RocketIcon,
};

export function TopicIcon({
  topic,
  className = "size-5",
}: {
  topic: ExerciseTopic;
  className?: string;
}) {
  const Icon = icons[topic];
  return <Icon className={className} aria-hidden="true" />;
}
