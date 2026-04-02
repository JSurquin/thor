import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://lab.andromed.fr";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Éditeur Monaco, templates React / Next / Vue / HTML, aperçu live et export ZIP.",
  alternates: { canonical: `${baseUrl}/playground` },
  openGraph: {
    title: "Playground interactif — lab.andromed",
    description:
      "Environnement live pour coder pendant la formation : sandboxes, reset, partage d’état.",
    url: `${baseUrl}/playground`,
    siteName: "lab.andromed",
    locale: "fr_FR",
    type: "website",
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
