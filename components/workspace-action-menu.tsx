"use client";

import type { ReactNode } from "react";
import { MoreHorizontalIcon, LanguagesIcon, PaletteIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "./locale-provider";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";

export type WorkspaceAction = {
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  testId?: string;
};

export function WorkspaceActionMenu({
  actions,
}: {
  actions: WorkspaceAction[];
}) {
  const { messages, locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-10 shrink-0"
          aria-label={messages.ux.moreActions}
        >
          <MoreHorizontalIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl p-2">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            className="min-h-11 rounded-lg"
            onSelect={action.onSelect}
            data-testid={action.testId}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="min-h-11">
            <LanguagesIcon className="size-4" />
            {messages.exercise.languageLabel}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={locale}
              onValueChange={(value) => setLocale(value as Locale)}
            >
              {LOCALES.map((id) => (
                <DropdownMenuRadioItem value={id} key={id}>
                  {LOCALE_LABELS[id]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="min-h-11">
            <PaletteIcon className="size-4" />
            {messages.ux.theme}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme ?? "system"}
              onValueChange={setTheme}
            >
              {[
                ["light", messages.ux.lightTheme],
                ["dark", messages.ux.darkTheme],
                ["system", messages.ux.systemTheme],
              ].map(([id, label]) => (
                <DropdownMenuRadioItem key={id} value={id}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
