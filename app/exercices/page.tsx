import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ExercisesListClient } from "@/components/exercises-list-client";
import { ExercisesPageIntro } from "@/components/exercises-page-intro";
import { getExercises } from "@/lib/exercises";

export const metadata = {
  title: "Exercices — lab.andromed",
  description:
    "Des exercices classés par thème : développement web, Linux, Docker, Kubernetes, RKE2 et Rancher. Recherchez votre prochain défi et suivez votre progression.",
};

export default function ExercicesListPage() {
  return (
    <div className="studio-page">
      <SiteHeader />
      <main className="site-container flex-1 py-9 sm:py-12">
        <ExercisesPageIntro />
        <Suspense
          fallback={
            <div className="catalog-skeleton animate-pulse" aria-busy="true">
              <div />
              <div />
            </div>
          }
        >
          <ExercisesListClient exercises={getExercises()} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
