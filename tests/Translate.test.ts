import { describe, expect, it, vi } from "vitest";

import { TranslateResponse, translate } from "../src/Translator.js";

describe("translator", () => {
  const tests = [
    [true, "Olá, mundo!", "Olá, mundo!"],
    [true, null, null],
    [false, null, null],
  ] as const;

  it.each(tests)("function translate()", (success, message, expected) => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => ({ success, data: { message } }),
    } as Response & { json(): TranslateResponse });

    const response = translate(
      "http://127.0.0.1:7900",
      "en",
      "pt_br",
      "Hello, world!",
    );

    void expect(response).resolves.toBe(expected);
  });
});
