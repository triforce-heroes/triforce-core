#!/usr/bin/env node

// oxlint-disable id-match
import chalk from "chalk";
import { diffString } from "json-diff";

export function fatal(
  ...arguments_:
    | [message: string, details?: unknown]
    | [message: string, expected: unknown, received: unknown, details?: Record<string, unknown>]
): never {
  const [message, second, third, details] = arguments_;

  const messages: string[] = [chalk.red(`\n\n${chalk.bgRed.black(" ERROR ")} ${message}\n\n`)];

  if (second !== undefined) {
    if (third === undefined) {
      messages.push(chalk.bold("Details:\n\n"), `${JSON.stringify(second, null, 2)}\n`);
    } else {
      if (!Buffer.isBuffer(second) && !Buffer.isBuffer(third)) {
        messages.push(
          chalk.bold("Expected:\n\n"),
          `${JSON.stringify(second, null, 2)}\n`,

          chalk.bold("Received:\n\n"),
          `${JSON.stringify(third, null, 2)}\n`,
        );
      }

      if (details !== undefined) {
        const entries = Object.entries(details);

        for (const [title, value] of entries) {
          messages.push(chalk.bold(`${title}:\n\n`), `${JSON.stringify(value, null, 2)}\n`);
        }
      }

      messages.push(chalk.bold("Difference:\n\n"), diffString(second, third));
    }
  }

  process.stderr.write(`${messages.join("")}\n`);
  process.exit(-1);
}
