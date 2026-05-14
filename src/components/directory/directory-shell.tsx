"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { STORAGE_KEYS } from "@/lib/constants";
import type {
  CompanyWithShortcuts,
  ShortcutGroup,
  ViewMode,
} from "@/lib/types";
import { groupHotkeys } from "@/utils/grouping";
import { companyMatchesQuery, shortcutMatchesQuery } from "@/utils/search";
import { CompanyCard } from "./company-card";
import { GroupedShortcutRow } from "./grouped-shortcut-row";
import { SearchBar } from "./search-bar";
import { ViewModeToggle } from "./view-mode-toggle";

export function DirectoryShell({
  companies,
  shortcutCount,
  initialShortcutGroups,
  initialViewMode = "shortcuts",
}: {
  companies: CompanyWithShortcuts[];
  shortcutCount: number;
  initialShortcutGroups: ShortcutGroup[];
  initialViewMode?: ViewMode;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  function handleViewModeChange(nextMode: ViewMode) {
    const nextPath = nextMode === "companies" ? "/companies" : "/";

    setViewMode(nextMode);
    window.localStorage.setItem(STORAGE_KEYS.viewMode, nextMode);
    router.push(nextPath);
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
    () =>
      query.trim()
        ? groupHotkeys(filteredHotkeys, { query })
        : initialShortcutGroups,
    [filteredHotkeys, initialShortcutGroups, query],
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
    <>
      <section className="pt-8 pb-16 sm:pt-12 sm:pb-24">
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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-wrap gap-2">
            <span>{shortcutCount} shortcuts</span>
            <span aria-hidden="true">/</span>
            <span>{companies.length} companies</span>
            <span aria-hidden="true">/</span>
            <span>
              {visibleCount} {visibleLabel} visible
            </span>
          </div>
          <ViewModeToggle
            onViewModeChange={handleViewModeChange}
            viewMode={viewMode}
          />
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
    </>
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
