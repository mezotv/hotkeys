import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
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
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-950 selection:bg-zinc-950 selection:text-white dark:bg-black dark:text-zinc-50 dark:selection:bg-zinc-50 dark:selection:text-black">
        {children}
      </body>
    </html>
  );
}
