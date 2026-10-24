"use client";

import Link from "next/link";
import { ArrowUpRightIcon, CommandIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useLocale } from "@/components/locale-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { messages } = useLocale();
  const t = messages.studio;
  return (
    <header className="site-header safe-area-inset-top">
      <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <Link
          href="/"
          className="brand"
          aria-label={`lab.andromed — ${t.home}`}
        >
          <span className="brand-mark">
            <CommandIcon className="size-5" aria-hidden="true" />
          </span>
          <span>
            lab
            <span className="font-normal text-muted-foreground">.andromed</span>
            <span className="brand-dot" />
          </span>
        </Link>
        <nav
          className="order-3 flex w-full items-center justify-center gap-1 sm:order-none sm:w-auto"
          aria-label={t.browseLabel}
        >
          {[
            ["/", t.home],
            ["/exercices", t.exercises],
            ["/playground", t.playground],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`nav-link ${pathname === href ? "is-active" : ""}`}
            >
              {label}
              {href === "/playground" && (
                <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher className="h-9 min-h-9 w-[132px] rounded-full border-transparent bg-muted/70 text-xs shadow-none" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { messages } = useLocale();
  return (
    <footer className="site-container flex flex-wrap items-center justify-between gap-3 border-t py-7 text-xs text-muted-foreground safe-area-inset-bottom">
      <span className="font-medium text-foreground">
        lab.andromed{" "}
        <span className="ml-2 font-normal text-muted-foreground">/ Thor</span>
      </span>
      <span>{messages.studio.footer}</span>
    </footer>
  );
}
