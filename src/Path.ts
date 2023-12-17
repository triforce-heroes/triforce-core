import { normalize as n } from "node:path";

export function normalize(path: string): string {
  return n(path).replaceAll("\\", "/");
}
