import { build } from "vite";
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { zipSync } from "fflate";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(here, "..");
const ids = ["index", "journal", "travel"];
const requested = process.argv.slice(2);
if (requested.some(id => !ids.includes(id))) throw new Error("Expected index, journal or travel");
async function files(root) {
  const entries = await readdir(root, { withFileTypes: true, recursive: true });
  return entries.filter(entry => entry.isFile()).map(entry => path.relative(root, path.join(entry.parentPath, entry.name)).split(path.sep).join("/")).sort();
}
const publicFiles = await files(path.join(frontend, "public"));
for (const id of requested.length ? requested : ids) {
  const out = path.join(frontend, "plugin-dist", id);
  const assets = new Set();
  await build({
    configFile: path.join(frontend, "vite.plugins.config.js"),
    mode: "production",
    plugins: [{
      name: "blog-plugin-public-assets",
      enforce: "pre",
      resolveId(name) { if (name === "blog-plugin-assets") return "\0blog-plugin-assets"; },
      load(name) {
        if (name === "\0blog-plugin-assets") return 'export function assetURL(path) { return new URL(path, import.meta.url).href; }';
      },
      transform(source, filename) {
        if (!filename.replaceAll("\\", "/").includes("/src/") || !/\.[jt]sx?$/.test(filename)) return;
        let code = source;
        for (const asset of publicFiles) {
          const literal = JSON.stringify(`/${asset}`);
          if (code.includes(literal)) {
            assets.add(asset);
            code = code.replaceAll(literal, `__blogAsset(${JSON.stringify(asset)})`);
          }
        }
        if (code !== source) return { code: `import { assetURL as __blogAsset } from "blog-plugin-assets";\n${code}`, map: null };
      },
    }],
    build: {
      outDir: out,
      lib: { entry: path.join(frontend, "plugins", id, "entry.jsx") },
      rollupOptions: { output: { chunkFileNames: "[name]-[hash].js" } },
    },
  });
  for (const asset of assets) {
    await mkdir(path.dirname(path.join(out, asset)), { recursive: true });
    await cp(path.join(frontend, "public", asset), path.join(out, asset));
  }
  if (id === "travel") await cp(path.join(frontend, "public/assets/earth/ATTRIBUTION.md"), path.join(out, "assets/earth/ATTRIBUTION.md"));
  const contents = {};
  const hash = createHash("sha256");
  for (const filename of await files(out)) {
    const bytes = await readFile(path.join(out, filename));
    contents[filename] = bytes;
    hash.update(filename).update("\0").update(bytes).update("\0");
  }
  const manifest = {
    id, name: id, version: `3.0.0-${hash.digest("hex").slice(0, 16)}`,
    route: `/p/${id}`, entry: "entry.js", styles: ["style.css"], type: "module", apiVersion: 1,
    enabled: true, navigation: { label: id, order: (ids.indexOf(id) + 1) * 10 },
    permissions: id === "index" ? ["read:home", "write:home"] : id === "journal" ? ["read:articles", "write:articles", "write:view-events", "write:likes", "write:uploads"] : ["read:travel-places", "write:travel-places"],
  };
  contents["manifest.json"] = Buffer.from(JSON.stringify(manifest, null, 2) + "\n");
  await writeFile(path.join(out, "manifest.json"), contents["manifest.json"]);
  await mkdir(path.join(frontend, "plugin-packages"), { recursive: true });
  const archive = Object.fromEntries(Object.entries(contents).map(([name, bytes]) => [name, [bytes, { mtime: new Date("2020-01-01T00:00:00Z") }]]));
  await writeFile(path.join(frontend, "plugin-packages", `${id}-${manifest.version}.zip`), zipSync(archive));
  console.log(`Packaged ${id}@${manifest.version}`);
}
