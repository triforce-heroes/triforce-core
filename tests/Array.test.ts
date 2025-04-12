import { describe, expect, it } from "vitest";

import { unique } from "@/Array.js";

describe("array", () => {
  it("function unique()", () => {
    expect(unique()).toStrictEqual([]);
    expect(unique("a", "b", "b", "c")).toStrictEqual(["a", "b", "c"]);
  });
});
