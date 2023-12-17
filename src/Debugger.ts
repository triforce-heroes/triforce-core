import { Command } from "commander";

export function debugCommander(program: Command, argv: string[]) {
  program.exitOverride();
  program.configureOutput({
    writeOut: () => {
      /** noop */
    },

    writeErr: () => {
      /** noop */
    },
  });

  program.parse(["node", "dummy.js", ...argv]);
}
