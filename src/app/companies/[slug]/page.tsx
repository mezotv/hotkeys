import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyDetail } from "@/components/directory/company-detail";
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

  return {
    title: `${company.name} keyboard shortcuts`,
    description: `Every keyboard shortcut for ${company.name}, with context, page, and keys.`,
    alternates: { canonical: `/companies/${company.slug}` },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
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
