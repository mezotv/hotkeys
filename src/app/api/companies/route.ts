import type { NextRequest } from "next/server";
import { assertCompanies } from "@/lib/validation";
import companiesJson from "./data.json";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export function GET(request: NextRequest) {
  assertCompanies(companiesJson);

  const category = request.nextUrl.searchParams.get("category")?.toLowerCase();
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  const companies = companiesJson.filter((company) => {
    if (category && company.category.toLowerCase() !== category) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [company.name, company.slug, company.category]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return Response.json(companies, { headers: cacheHeaders });
}
