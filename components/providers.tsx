"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RegisterServiceWorker } from "@/components/register-service-worker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <RegisterServiceWorker />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
