/** Lien repliable hors écran jusqu’au focus : premier Tab accessible. */

export function SkipNav() {
  return (
    <a
      href="#site-main"
      className="fixed left-3 top-3 z-[200] inline-flex -translate-y-[220%] rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg outline-none ring-offset-background transition-transform focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      Aller au contenu principal
    </a>
  );
}
