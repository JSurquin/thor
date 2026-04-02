"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /* next-themes : éviter décalage hydratation / thème inconnu au SSR */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-hidden>
        <SunIcon className="size-5 opacity-0" />
      </Button>
    );
  }

  const cycle = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const isDark = resolvedTheme === "dark";
  const Icon =
    theme === "system" ? MonitorIcon : isDark ? SunIcon : MoonIcon;
  const label =
    theme === "system"
      ? `Thème système (${isDark ? "rendu sombre" : "rendu clair"}) — cliquer pour mode clair forcé`
      : theme === "light"
        ? "Mode clair — cliquer pour mode sombre"
        : "Mode sombre — cliquer pour suivre le système";

  return (
    <Button variant="ghost" size="icon" onClick={cycle} aria-label={label}>
      <Icon className="size-5" />
    </Button>
  );
}
