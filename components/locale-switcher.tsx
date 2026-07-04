"use client";

import { LanguagesIcon } from "lucide-react";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/locale-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, setLocale, messages } = useLocale();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger
        className={className ?? "w-[140px] min-h-[44px] gap-1.5"}
        aria-label={messages.exercise.languageLabel}
        data-testid="locale-switcher"
      >
        <LanguagesIcon className="size-4 shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((code) => (
          <SelectItem key={code} value={code}>
            {LOCALE_LABELS[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
