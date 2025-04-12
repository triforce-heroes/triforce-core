import { describe, expect, it } from "vitest";

import { secureHash } from "@/Hash.js";

describe("hash", () => {
  it("function secureHash()", async () => {
    expect.assertions(1);

    await expect(secureHash(Buffer.from("test"))).resolves.toBe(
      142_732_611_767_432,
    );
  });
});
