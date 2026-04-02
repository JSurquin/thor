import type { Metadata } from "next";
import { getExerciseById } from "@/lib/exercises";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://lab.andromed.fr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ex = getExerciseById(id);

  if (!ex) {
    return {
      title: "Exercice introuvable — lab.andromed",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${ex.title} — Exercices`,
    description: ex.description,
    alternates: { canonical: `${baseUrl}/exercices/${encodeURIComponent(id)}` },
    openGraph: {
      title: `${ex.title} — lab.andromed`,
      description: ex.description,
      url: `${baseUrl}/exercices/${encodeURIComponent(id)}`,
      siteName: "lab.andromed",
      locale: "fr_FR",
      type: "article",
    },
  };
}

export default function ExerciseIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
