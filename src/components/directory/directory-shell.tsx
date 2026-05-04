"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { STORAGE_KEYS } from "@/lib/constants";
import type { CompanyWithShortcuts, ViewMode } from "@/lib/types";
import { groupHotkeys } from "@/utils/grouping";
import { companyMatchesQuery, shortcutMatchesQuery } from "@/utils/search";
import { CompanyCard } from "./company-card";
import { Footer } from "./footer";
import { GroupedShortcutRow } from "./grouped-shortcut-row";
import { Header } from "./header";
import { SearchBar } from "./search-bar";

export function DirectoryShell({
  companies,
  shortcutCount,
}: {
  companies: CompanyWithShortcuts[];
  shortcutCount: number;
}) {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("shortcuts");

  useEffect(() => {
    const storedView = window.localStorage.getItem(STORAGE_KEYS.viewMode);

    if (storedView === "shortcuts" || storedView === "companies") {
      setViewMode(storedView);
    }
  }, []);

  function handleViewModeChange(nextMode: ViewMode) {
    setViewMode(nextMode);
    window.localStorage.setItem(STORAGE_KEYS.viewMode, nextMode);
  }

  const hotkeys = useMemo(
    () =>
      companies.flatMap((company) =>
        company.shortcuts.map((shortcut) => ({ company, shortcut })),
      ),
    [companies],
  );

  const filteredHotkeys = useMemo(
    () =>
      hotkeys.filter(({ company, shortcut }) =>
        shortcutMatchesQuery(shortcut, company, query.trim()),
      ),
    [hotkeys, query],
  );

  const shortcutGroups = useMemo(
    () => groupHotkeys(filteredHotkeys),
    [filteredHotkeys],
  );

  const filteredCompanies = useMemo(
    () =>
      companies
        .map((company) => companyMatchesQuery(company, query))
        .filter((company): company is CompanyWithShortcuts => company !== null),
    [companies, query],
  );

  const visibleCount =
    viewMode === "shortcuts" ? shortcutGroups.length : filteredCompanies.length;
  const visibleLabel =
    viewMode === "shortcuts" ? "shortcut groups" : "companies";

  return (
    <div className="flex min-h-screen flex-col">
      <Header onViewModeChange={handleViewModeChange} viewMode={viewMode} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-8 sm:px-8">
        <section className="py-16 sm:py-24">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl">
            Hotkeys, by action.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg sm:leading-8">
            Search the action first, then see which apps use it and which keys
            they bind.
          </p>

          <div className="mt-8">
            <SearchBar onQueryChange={setQuery} query={query} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{shortcutCount} shortcuts</span>
            <span aria-hidden="true">/</span>
            <span>{companies.length} companies</span>
            <span aria-hidden="true">/</span>
            <span>
              {visibleCount} {visibleLabel} visible
            </span>
          </div>
        </section>

        <div className="space-y-4">
          {viewMode === "shortcuts" ? (
            shortcutGroups.length > 0 ? (
              shortcutGroups.map((group) => (
                <GroupedShortcutRow group={group} key={group.id} />
              ))
            ) : (
              <EmptyState
                hint="Try another app, key, action, or context."
                title="No shortcuts found"
              />
            )
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <CompanyCard company={company} key={company.id} />
            ))
          ) : (
            <EmptyState
              hint="Try a different name or category."
              title="No companies found"
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>
      </CardContent>
    </Card>
  );
}
