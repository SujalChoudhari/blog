import { existsSync } from "node:fs";
import { cwd } from "node:process";
import { resolve } from "node:path";

const remoteAsset = /^(https?:|data:)/i;

/** Return a local public asset only when it exists at build time. */
const publicAsset = (value?: string) => {
  if (!value || remoteAsset.test(value) || !value.startsWith("/")) {
    return undefined;
  }

  const pathWithoutQuery = value.split(/[?#]/, 1)[0];
  const filePath = resolve(cwd(), "public", pathWithoutQuery.slice(1));

  return existsSync(filePath) ? value : undefined;
};

export default publicAsset;
