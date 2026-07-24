import { rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  join(root, "node_modules"),
  join(root, "apps", "treino-do-dia", "node_modules"),
  join(root, "apps", "restaurante-delivery-mockup", "node_modules"),
];

for (const dir of targets) {
  rmSync(dir, { recursive: true, force: true });
  console.log("removed:", dir);
}
