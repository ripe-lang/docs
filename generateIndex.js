import { promises as fs } from "fs";
import path from "path";

const contentDir = path.resolve("src/content");
const outputFile = path.join(contentDir, "index.json");

async function generateIndex() {
  const files = [];
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".md")) continue;
    const fullPath = path.join(contentDir, entry.name);
    const text = await fs.readFile(fullPath, "utf8");
    const match = text.match(/^#\s+(.*)/m);
    const title = match ? match[1].trim() : entry.name.replace(/\.md$/i, "");
    files.push({ title, path: `/content/${entry.name}` });
  }
  await fs.writeFile(outputFile, JSON.stringify(files, null, 2));
  console.log(`Generated ${files.length} entries → ${outputFile}`);
}

generateIndex().catch(err => {
  console.error("Error generating index:", err);
  process.exit(1);
});
