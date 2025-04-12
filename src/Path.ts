import { normalize as nodeNormalize } from "node:path";

export function normalize(path: string): string {
  return nodeNormalize(path).replaceAll("\\", "/");
}
