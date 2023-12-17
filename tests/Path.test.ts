import { describe, expect, it } from "vitest";

import { normalize } from "../src/Path.js";

describe("path", () => {
  it("function normalize()", () => {
    expect(normalize(".\\..\\src\\.\\Array.ts")).toBe("../src/Array.ts");
  });
});
