import { Command } from "commander";
import { describe, expect, it } from "vitest";

import { debugCommander } from "@/Debugger.js";

describe("debugger", () => {
  it("function debugCommander()", () => {
    expect.assertions(2);

    const program = new Command();

    program
      .command("test")
      .argument("<input>")
      .action((input) => {
        expect(input).toBe("123");
      });

    debugCommander(program, ["test", "123"]);
    debugCommander(program, ["test", "123"]);
  });
});
