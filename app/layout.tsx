import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { SkipNav } from "@/components/skip-nav";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://lab.andromed.fr";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "lab.andromed — Playground interactif",
    template: "%s · lab.andromed",
  },
  description:
    "Environnement live pour coder pendant la formation. Éditeur Monaco, sandboxes et exercices guidés.",
  manifest: "/manifest.webmanifest",
  keywords: [
    "formation",
    "playground",
    "React",
    "Next.js",
    "Vue",
    "exercices code",
    "Monaco",
    "lab.andromed",
  ],
  authors: [{ name: "lab.andromed" }],
  appleWebApp: {
    capable: true,
    title: "lab.andromed Playground",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "lab.andromed",
    title: "lab.andromed — Playground interactif",
    description:
      "Environnement live pour coder pendant la formation : playground et exercices.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "lab.andromed — Playground interactif",
    description:
      "Environnement live pour coder pendant la formation : playground et exercices.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SkipNav />
          <div id="site-main" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
