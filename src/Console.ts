#!/usr/bin/env node

import chalk from "chalk";
import { diffString } from "json-diff";

// eslint-disable-next-line unicorn/no-exports-in-scripts
export function fatal(
  ...arguments_:
    | [message: string, details?: unknown]
    | [message: string, expected: unknown, received: unknown, details?: Record<string, unknown>]
): never {
  const messages: string[] = [
    chalk.red(`\n\n${chalk.bgRed.black(" ERROR ")} ${arguments_[0]}\n\n`),
  ];

  if (arguments_[1] !== undefined) {
    if (arguments_[2] === undefined) {
      messages.push(chalk.bold("Details:\n\n"), `${JSON.stringify(arguments_[1], null, 2)}\n`);
    } else {
      if (!Buffer.isBuffer(arguments_[1]) && !Buffer.isBuffer(arguments_[2])) {
        messages.push(
          chalk.bold("Expected:\n\n"),
          `${JSON.stringify(arguments_[1], null, 2)}\n`,

          chalk.bold("Received:\n\n"),
          `${JSON.stringify(arguments_[2], null, 2)}\n`,
        );
      }

      if (arguments_[3] !== undefined) {
        const entries = Object.entries(arguments_[3]);

        for (const [title, value] of entries) {
          messages.push(chalk.bold(`${title}:\n\n`), `${JSON.stringify(value, null, 2)}\n`);
        }
      }

      messages.push(chalk.bold("Difference:\n\n"), diffString(arguments_[1], arguments_[2]));
    }
  }

  process.stderr.write(`${messages.join("")}\n`);
  process.exit(-1);
}
