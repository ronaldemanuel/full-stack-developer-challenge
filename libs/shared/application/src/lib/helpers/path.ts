import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url || __dirname));

export function getResourcesFolder(asset?: string) {
  const resourcesPath = path.join(dirname, "..", "..", "resources");
  return asset ? path.join(resourcesPath, asset) : resourcesPath;
}

export function getTmpFolder(asset?: string) {
  const tmpPath = path.join(dirname, "..", "..", "..", "tmp");
  return asset ? path.join(tmpPath, asset) : tmpPath;
}
