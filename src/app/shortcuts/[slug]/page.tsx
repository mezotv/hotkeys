import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShortcutDetail } from "@/components/directory/shortcut-detail";
import { findShortcutGroupBySlug, loadDirectoryData } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  const { shortcutGroups } = loadDirectoryData();

  return shortcutGroups.map((group) => ({ slug: group.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = findShortcutGroupBySlug(slug);

  if (!group) {
    return { title: "Shortcut not found" };
  }

  const appNames = group.entries.map((entry) => entry.company.name).join(", ");

  return {
    title: `${group.action} shortcut`,
    description: `Apps that bind a keyboard shortcut to "${group.action}" — used by ${appNames}.`,
    alternates: { canonical: `/shortcuts/${group.id}` },
  };
}

export default async function ShortcutPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const group = findShortcutGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  return <ShortcutDetail group={group} />;
}
