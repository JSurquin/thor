import { useEffect, useRef, useState } from "react";

/** Mesure la hauteur d’un conteneur pour Monaco (height="100%" échoue en flex mobile). */
export function useContainerHeight(fallback = 320) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const next = el.getBoundingClientRect().height;
      if (next > 0) setHeight(Math.round(next));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, height };
}

/** Détecte lg+ sans monter Monaco dans un panneau mobile masqué au premier rendu. */
export function useIsLargeScreen(breakpoint = 1024) {
  const query = `(min-width: ${breakpoint}px)`;
  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsLargeScreen(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return isLargeScreen;
}
