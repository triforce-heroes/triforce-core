import { describe, expect, it } from "vitest";

import { secureHash } from "../src/Hash.js";

describe("hash", () => {
  it("function secureHash()", () => {
    void expect(secureHash(Buffer.from("test"))).resolves.toBe(
      142_732_611_767_432,
    );
  });
});
