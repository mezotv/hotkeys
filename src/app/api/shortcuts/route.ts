import type { NextRequest } from "next/server";
import { filterShortcuts } from "@/lib/data";
import { assertShortcuts, validateDirectoryData } from "@/lib/validation";
import companiesJson from "../companies/data.json";
import shortcutsJson from "./data.json";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export function GET(request: NextRequest) {
  validateDirectoryData(companiesJson, shortcutsJson);
  assertShortcuts(shortcutsJson);

  return Response.json(
    filterShortcuts(shortcutsJson, request.nextUrl.searchParams),
    { headers: cacheHeaders },
  );
}
