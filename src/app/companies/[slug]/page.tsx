import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyDetail } from "@/components/directory/company-detail";
import { SITE_URL } from "@/lib/constants";
import { findCompanyBySlug, loadDirectoryData } from "@/lib/data";
import { getCompanyIconUrl } from "@/utils/icons";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  const { companies } = loadDirectoryData();

  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);

  if (!company) {
    return { title: "Company not found" };
  }

  const iconUrl = getCompanyIconUrl(company);
  const shortcutCount = company.shortcuts.length;
  const shortcutLabel = shortcutCount === 1 ? "shortcut" : "shortcuts";
  const title = `${company.name} keyboard shortcuts`;
  const description = `${company.name} has ${shortcutCount} keyboard ${shortcutLabel}. Explore every shortcut and compare how ${company.name} maps actions, contexts, and key bindings.`;
  const url = `${SITE_URL}/companies/${company.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/companies/${company.slug}` },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "hotkeys",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  return <CompanyDetail company={company} />;
}
