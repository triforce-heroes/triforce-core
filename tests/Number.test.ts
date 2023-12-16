import { describe, expect, it } from "vitest";

import { nextMultiple } from "../src/Number.js";

describe("number", () => {
  const samples = [
    [0, 4, 0],
    [1, 4, 4],
    [2, 4, 4],
    [3, 4, 4],
    [4, 4, 4],
    [5, 4, 8],
    [6, 4, 8],
    [7, 4, 8],
    [8, 4, 8],
  ] as const;

  it.each(samples)(
    "function nextMultiple(%j, %j) = %j",
    (value, width, expected) => {
      expect(nextMultiple(value, width)).toBe(expected);
    },
  );
});
