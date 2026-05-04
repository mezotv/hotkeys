import { DUCKDUCKGO_ICON_BASE } from "@/lib/constants";
import type { Company } from "@/lib/types";

export function getCompanyIconUrl(company: Pick<Company, "website">) {
  const hostname = new URL(company.website).hostname.replace(/^www\./, "");
  return `${DUCKDUCKGO_ICON_BASE}/${hostname}.ico`;
}
