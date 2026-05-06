# hotkeys workspace

## SNAPSHOT

type: single  
langs: TypeScript, TSX, CSS  
runtimes: Node.js  
pkgManager: pnpm  
deliverables: web app  
rootConfigs: next.config.ts, tsconfig.json, biome.json, postcss.config.mjs

## PACKAGES

| name | path | type | role |
|------|------|------|------|
| hotkeys | . | app | Keyboard shortcut directory with search, filtering, and dual-view UI |

## ARCHITECTURE

### hotkeys (root)

entry: `src/app/layout.tsx` → root layout | `src/app/page.tsx` → home page  
routing: Next.js App Router | dynamic: `[slug]/` for companies, shortcuts  
state: useState for query, viewMode | localStorage for view preference  
api: `/api/companies` (filter by category|q), `/api/shortcuts` (filter by company|context|tag|q) | ~1h cache TTL  
db: JSON files (`companies.json`, `shortcuts.json`) + runtime validation  
auth: none  
build: Next.js 16 with Turbopack, React Compiler enabled, Tailwind CSS 4  
dirs: `src/app/` → pages+layout+API routes, `src/components/directory/` → directory UI, `src/components/ui/` → base components, `src/lib/` → types+validation+data loading, `src/utils/` → grouping+search+slug, `scripts/` → symlink setup

## DEPENDENCY GRAPH

(single app only)

## STACK

next: 16.2.4 | framework: React 19.2.4 | routing: Next.js App Router | css: Tailwind 4 | ui: @base-ui/react, clsx, class-variance-authority, tailwind-merge | build: babel-plugin-react-compiler | lint: Biome 2.2.0 | runtime: Node.js

## STYLE

- naming: camelCase for functions/vars, PascalCase for components, slug format for IDs (regex: `^[a-z][a-zA-Z0-9]*$`)
- imports: `@/*` alias for `src/*`, grouped by external, aliases, relative
- typing: strict mode | type aliases for domain objects (Company, Shortcut, ShortcutBinding, etc.) in `src/lib/types.ts`
- errors: assertion functions in `src/lib/validation.ts` for runtime validation
- patterns: composition over inheritance | memoization (useMemo) for expensive filters | Map-based grouping with lazy initialization
- formatting: Biome with 2-space indent, sort imports
- testing: no test files present

## STRUCTURE

`src/app/` → Next.js routes and layout  
`src/app/api/` → REST endpoints with symlinked data files  
`src/components/directory/` → main UI shell, search, cards, detail views  
`src/components/ui/` → unstyled base components (input, button, badge, kbd, avatar, toggle-group, card)  
`src/lib/` → validation, types, data loading, filtering  
`src/utils/` → search matching, grouping by action, slug gen, class merging  
`public/` → assets  
`.next/` → build artifacts (Turbopack)

## BUILD

workspaceScripts: dev, build, start, postinstall, lint, format

envFiles: none in repo (next defaults to .env.local, .env.production)  
envPrefixes: none  
ci: none configured  
docker: none

## LOOKUP

add page route → `src/app/[name]/page.tsx`, `src/app/layout.tsx` for wrapping  
add API endpoint → `src/app/api/[resource]/route.ts`, use `Response.json()`  
add UI component → `src/components/ui/*.tsx`, unstyled  
add feature component → `src/components/directory/*.tsx`, manages own state  
add data type → `src/lib/types.ts`  
add validation rule → `src/lib/validation.ts` with assert functions  
add search logic → `src/utils/search.ts`  
search/filter existing → `src/lib/data.ts` filterShortcuts(), companyMatchesQuery()  
group shortcuts → `src/utils/grouping.ts` groupHotkeys()  
edit shortcuts/companies → root `shortcuts.json`, `companies.json`  

## KEY FILES

hotkeys::`src/app/layout.tsx` → root metadata, fonts, analytics, structure | readFor: metadata setup, global styles | affects: all pages  
hotkeys::`src/app/page.tsx` → home loads data, renders DirectoryShell | readFor: entry point, data flow | affects: initial load  
hotkeys::`src/lib/types.ts` → Company, Shortcut, ShortcutBinding, ShortcutGroup, CompanyWithShortcuts, ViewMode | readFor: domain shapes | affects: all components+API  
hotkeys::`src/lib/data.ts` → loadDirectoryData(), filterShortcuts(), findCompanyBySlug(), findShortcutGroupBySlug() | readFor: data pipeline | affects: search, routing, API  
hotkeys::`src/lib/validation.ts` → assertCompanies(), assertShortcuts(), validateDirectoryData() | readFor: runtime validation rules | affects: API+startup  
hotkeys::`src/components/directory/directory-shell.tsx` → main stateful shell (query, viewMode, filtering, grouping) | readFor: UX flow, state logic | affects: search, view toggle  
hotkeys::`src/utils/search.ts` → shortcutMatchesQuery(), companyMatchesQuery() | readFor: search matching rules | affects: filter, API  
hotkeys::`src/utils/grouping.ts` → groupHotkeys() groups ShortcutEntry[] by action slug | readFor: grouping logic | affects: initial state, re-render  
hotkeys::`src/app/api/companies/route.ts` → GET /api/companies with category, q filters | readFor: company API spec | affects: external consumers  
hotkeys::`src/app/api/shortcuts/route.ts` → GET /api/shortcuts delegates to filterShortcuts() | readFor: shortcut API spec | affects: external consumers  
hotkeys::`next.config.ts` → React Compiler, Turbopack, remotePatterns for DuckDuckGo icons | readFor: build tuning | affects: performance, image fetching  
hotkeys::`companies.json` → array of Company (id, name, slug, website, category) | readFor: data source | affects: all pages, API  
hotkeys::`shortcuts.json` → array of Shortcut (id, companyId, action, description, tags, bindings[]) | readFor: data source | affects: all pages, API  
hotkeys::`biome.json` → Biome 2.2.0 config (recommended rules, React+Next domains) | readFor: lint rules | affects: CI, IDE  
hotkeys::`postcss.config.mjs` → Tailwind CSS 4 plugin | readFor: CSS building | affects: styling  
hotkeys::`package.json` → deps: React 19, Next 16, Tailwind 4, @base-ui/react | readFor: versions | affects: build, types
