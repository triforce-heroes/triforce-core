import { describe, expect, it } from "vitest";

import { nextMultiple } from "@/Number.js";

describe("number", () => {
  const samples = [
    [0, 4, false, 0],
    [1, 4, false, 4],
    [2, 4, false, 4],
    [3, 4, false, 4],
    [4, 4, false, 4],
    [5, 4, false, 8],
    [6, 4, false, 8],
    [7, 4, false, 8],
    [8, 4, false, 8],
    [4, 5, false, 5],
    [5, 5, false, 5],
    [6, 5, false, 10],
    [4, 5, true, 5],
    [5, 5, true, 10],
    [6, 5, true, 10],
  ] as const;

  it.each(samples)(
    "function nextMultiple(%j, %j, %j) = %j",
    (value, width, nextIfMatches, expected) => {
      expect(nextMultiple(value, width, nextIfMatches)).toBe(expected);
    },
  );
});
