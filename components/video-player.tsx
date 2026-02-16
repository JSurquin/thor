"use client";

import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";

interface VideoPlayerProps {
  embedUrl: string;
  externalUrl: string;
  title: string;
}

export function VideoPlayer({ embedUrl, externalUrl, title }: VideoPlayerProps) {
  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-border/50">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" asChild>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <ExternalLinkIcon className="size-4" />
            Ouvrir sur YouTube
          </a>
        </Button>
      </div>
    </div>
  );
}
