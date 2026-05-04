import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/directory/site-footer";
import { SiteHeader } from "@/components/directory/site-header";
import { SITE_ICON_URL, SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "hotkeys by dominik",
  description:
    "A community-maintained keyboard shortcut directory for modern apps.",
  icons: {
    icon: SITE_ICON_URL,
    shortcut: SITE_ICON_URL,
    apple: SITE_ICON_URL,
  },
  openGraph: {
    title: "hotkeys by dominik",
    description:
      "Find keyboard shortcuts by app, context, page, and operating system.",
    url: SITE_URL,
    siteName: "hotkeys",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          crossOrigin="anonymous"
          data-client-id="35eb5a41-4158-4be0-85a8-ca907146f05e"
          data-track-errors="true"
          data-track-hash-changes="true"
          data-track-interactions="true"
          src="https://cdn.databuddy.cc/databuddy.js"
        />
      </head>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-950 selection:bg-zinc-950 selection:text-white dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-50 dark:selection:text-black">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-8 sm:px-8">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
