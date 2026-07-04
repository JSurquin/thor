"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RegisterServiceWorker } from "@/components/register-service-worker";
import { LocaleProvider } from "@/components/locale-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleProvider>
        <TooltipProvider>
          <RegisterServiceWorker />
          {children}
        </TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
