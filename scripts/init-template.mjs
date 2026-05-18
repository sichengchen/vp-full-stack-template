import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const defaultScope = "@template";
const root = process.cwd();
const args = process.argv.slice(2);
const help = args.includes("--help") || args.includes("-h");
const dryRun = args.includes("--dry-run");
const scope = readOption("--scope");
const name = readOption("--name");

if (help || !scope) {
  console.log(`Usage: vp run -w template:init --scope @acme [--name my-app] [--dry-run]

Examples:
  vp run -w template:init --scope @acme
  vp run -w template:init --scope @acme --name billing-platform

This rewrites package names, imports, aliases, scripts, and docs from "${defaultScope}" to your package scope.`);
  process.exit(help ? 0 : 1);
}

if (!/^@[a-z0-9][a-z0-9._-]*$/.test(scope)) {
  throw new Error(`Invalid scope "${scope}". Use a package scope like "@acme".`);
}

if (name && !/^[a-z0-9][a-z0-9._-]*$/.test(name)) {
  throw new Error(`Invalid package name "${name}". Use lowercase npm package-name format.`);
}

const files = await collectTextFiles(root);
const changedFiles = [];

for (const file of files) {
  const current = await readFile(file, "utf8");
  const relativePath = path.relative(root, file);
  let next = current.replaceAll(defaultScope, scope);

  if (name && relativePath === "package.json") {
    const rootPackage = JSON.parse(next);
    rootPackage.name = name;
    next = `${JSON.stringify(rootPackage, null, 2)}\n`;
  }

  if (next === current) {
    continue;
  }

  changedFiles.push(relativePath);

  if (!dryRun) {
    await writeFile(file, next);
  }
}

for (const file of changedFiles) {
  console.log(`${dryRun ? "would update" : "updated"} ${file}`);
}

console.log(`${dryRun ? "Would initialize" : "Initialized"} template package scope as ${scope}.`);

if (!dryRun) {
  console.log(
    "Run `vp install` after initialization to refresh workspace links and lockfile metadata.",
  );
}

function readOption(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(root, absolutePath);

    if (shouldSkip(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && isTextFile(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function shouldSkip(relativePath) {
  return (
    relativePath === ".git" ||
    relativePath === "node_modules" ||
    relativePath === "dist" ||
    relativePath === "scripts/init-template.mjs" ||
    relativePath.includes(`${path.sep}.git${path.sep}`) ||
    relativePath.includes(`${path.sep}node_modules${path.sep}`) ||
    relativePath.includes(`${path.sep}dist${path.sep}`) ||
    relativePath.endsWith(".db") ||
    relativePath.includes(".db-")
  );
}

function isTextFile(fileName) {
  return /\.(css|html|json|md|ts|tsx|yaml|yml)$/.test(fileName);
}
