import { build } from "vite";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(here, "..");
const backendPlugins = path.resolve(frontend, "../backend/builtin-plugins");
for (const id of ["index", "journal", "travel"]) {
  const out = path.join(frontend, "plugin-dist");
  await rm(out, { recursive: true, force: true });
  await build({ configFile: path.join(frontend, "vite.plugins.config.js"), mode: "production", define: { "process.env.PLUGIN_ID": JSON.stringify(id) }, build: { outDir: out, emptyOutDir: true, rollupOptions: { input: path.join(frontend, "plugins", id, "index.html") } } });
  const target = path.join(backendPlugins, id);
  const manifest = await readFile(path.join(target, "manifest.json"));
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "manifest.json"), manifest);
  const builtEntry = path.join(out, "plugins", id);
  for (const name of await readdir(builtEntry)) {
    const source = path.join(builtEntry, name);
    let destination = path.join(target, name);
    if (name.endsWith(".html")) {
      const html = (await readFile(source, "utf8")).replaceAll("../../assets/", "assets/");
      await writeFile(destination, html);
    } else await cp(source, destination, { recursive: true, force: true });
  }
  await cp(path.join(out, "assets"), path.join(target, "assets"), { recursive: true, force: true });
  for (const name of await readdir(out)) {
    if (name !== "assets" && name !== "plugins") await cp(path.join(out, name), path.join(target, name), { recursive: true, force: true });
  }
}
