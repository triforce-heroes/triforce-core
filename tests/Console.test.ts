import chalk from "chalk";
import strip from "strip-ansi";
import { describe, expect, it, vitest } from "vitest";

import { fatal } from "@/Console.js";

describe("console", () => {
  chalk.level = 2;

  const samples = [
    ["just message", undefined],
    ["message with details", 123],
    ["message with array-diff", [1, 2, 3], [1, 2, 4]],
    ["message with buffer-diff", Buffer.from("123"), Buffer.from("456")],
    ["message with diff and details", [1], [2], { testA: 1, testB: 2 }],
  ] as const;

  it.each(samples)(
    "function fatal(%j)",
    (
      ...args:
        | [
            message: string,
            expected: unknown,
            received: unknown,
            details?: Record<string, unknown>,
          ]
        | [message: string, details?: unknown]
    ) => {
      let stderrMessage: Uint8Array | string | undefined = undefined;
      let exitCode: number | undefined = undefined;

      vitest.spyOn(process, "exit").mockImplementationOnce((code) => {
        exitCode = Number(code);

        return undefined as never;
      });

      vitest
        .spyOn(process.stderr, "write")
        .mockImplementationOnce((str: Uint8Array | string) => {
          stderrMessage = str;

          return true;
        });

      fatal(...args) as unknown;

      expect(exitCode).toBe(-1);
      expect(stderrMessage).toBeTypeOf("string");
      expect(strip(stderrMessage as unknown as string)).toMatchSnapshot("ansi");
      expect(stderrMessage).toMatchSnapshot("colors");
    },
  );
});
