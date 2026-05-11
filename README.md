# hotkeys

A keyboard shortcut directory by [Dominik](https://dominikkoch.dev).

The live site is at [hotkeys.sh](https://hotkeys.sh). It reads shortcuts from root-level JSON files so adding or fixing a shortcut is a small GitHub PR.

## Contributing Shortcuts

Most PRs only need to edit [`shortcuts.json`](shortcuts.json). If the app or company does not exist yet, add it to [`companies.json`](companies.json) first.

Each shortcut is an action. Actions can have multiple bindings when a key changes by page, mode, or focused surface inside an app.

```json
{
  "id": "linear-quick-find",
  "companyId": "linear",
  "action": "Quick find",
  "description": "Jump to any issue, project, view, team, or document.",
  "tags": ["navigation"],
  "bindings": [
    {
      "context": "global",
      "contextLabel": "Anywhere in Linear",
      "keys": {
        "mac": ["Cmd", "K"],
        "windows": ["Ctrl", "K"],
        "linux": ["Ctrl", "K"]
      }
    },
    {
      "context": "issueView",
      "contextLabel": "Issue detail page",
      "keys": {
        "mac": ["Cmd", "Shift", "K"],
        "windows": ["Ctrl", "Shift", "K"],
        "linux": ["Ctrl", "Shift", "K"]
      },
      "note": "Use this when the regular command menu is bound to issue actions."
    }
  ]
}
```

Company entries look like this:

```json
{
  "id": "linear",
  "name": "Linear",
  "slug": "linear",
  "website": "https://linear.app",
  "category": "Project management"
}
```

Rules:

- `id`, `companyId`, and `context` should be stable slugs.
- `companyId` must match an existing company in `companies.json`.
- `bindings` must contain at least one item.
- Each binding needs a `context`, `contextLabel`, and at least one OS inside `keys`.
- If an OS is missing, the UI falls back from the selected OS to `mac`, then `windows`, then `linux`.

## API

- `/api/companies`
- `/api/companies?q=git`
- `/api/companies?category=editor`
- `/api/shortcuts`
- `/api/shortcuts?company=linear`
- `/api/shortcuts?context=issueView`
- `/api/shortcuts?tag=navigation`
- `/api/shortcuts?q=command`

The route data files in `src/app/api/**/data.json` are symlinks to the root JSON files.

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
pnpm lint
pnpm build
pnpm format
```

If the API symlinks are missing, run:

```bash
node scripts/ensure-symlinks.mjs
```

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Biome
