import { mkdir, rm, symlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const links = [
  {
    source: "../../../../shortcuts.json",
    target: resolve(root, "src/app/api/shortcuts/data.json"),
  },
  {
    source: "../../../../companies.json",
    target: resolve(root, "src/app/api/companies/data.json"),
  },
];

for (const link of links) {
  await mkdir(dirname(link.target), { recursive: true });
  await rm(link.target, { force: true });
  await symlink(link.source, link.target);
}
