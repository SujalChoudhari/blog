import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../src/config/stock-covers.json", import.meta.url), "utf8"));
const directory = new URL("../public/images/stock/", import.meta.url);
await mkdir(directory, { recursive: true });

const isJpeg = (data) => data.length > 4 && data[0] === 0xff && data[1] === 0xd8
  && data.at(-2) === 0xff && data.at(-1) === 0xd9;

async function prepareCover([id, { image }]) {
  const target = new URL(id + ".jpg", directory);
  const cached = await readFile(target).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  if (cached && isJpeg(cached)) return;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(image, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = Buffer.from(await response.arrayBuffer());
      if (!isJpeg(data)) throw new Error("Expected a complete JPEG");
      await writeFile(target, data);
      return;
    } catch (error) {
      if (attempt === 2) throw new Error("Unable to prepare cover for " + id + " from " + image, { cause: error });
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}

const entries = Object.entries(manifest);
for (let index = 0; index < entries.length; index += 5) {
  await Promise.all(entries.slice(index, index + 5).map(prepareCover));
}
