import { HomeStudio } from "@/components/home-studio";
import { getExercises } from "@/lib/exercises";
import { EXERCISE_TOPICS, getExerciseTopic } from "@/lib/exercise-topics";
import { TEMPLATE_IDS } from "@/lib/templates";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://lab.andromed.fr";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "lab.andromed",
  description: "Playground interactif et exercices de code pour la formation.",
  url: siteUrl,
  inLanguage: "fr-FR",
};

export default function Home() {
  const exercises = getExercises();
  const topics = EXERCISE_TOPICS.map((id) => ({
    id,
    count: exercises.filter((exercise) => getExerciseTopic(exercise) === id)
      .length,
  })).filter((topic) => topic.count > 0);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeStudio
        count={exercises.length}
        templateCount={TEMPLATE_IDS.length}
        topics={topics}
      />
    </>
  );
}
