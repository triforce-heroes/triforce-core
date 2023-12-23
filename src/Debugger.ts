import { Command } from "commander";

export function debugCommander(program: Command, argv: string[]) {
  program.exitOverride();
  program.configureOutput({
    writeOut: Function,
    writeErr: Function,
  });

  program.parse(["node", "dummy.js", ...argv]);
}
