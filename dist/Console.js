#!/usr/bin/env node
import chalk from "chalk";
import { diffString } from "json-diff";
export function fatal(...args) {
    const messages = [];
    messages.push(chalk.red(`\n\n${chalk.bgRed.black(" ERROR ")} ${args[0]}\n\n`));
    if (args[1] !== undefined) {
        if (args[2] === undefined) {
            messages.push(chalk.bold(`Details:\n\n`), `${JSON.stringify(args[1], null, 2)}\n`);
        }
        else {
            if (!Buffer.isBuffer(args[1]) && !Buffer.isBuffer(args[2])) {
                messages.push(chalk.bold(`Expected:\n\n`), `${JSON.stringify(args[1], null, 2)}\n`, chalk.bold(`Received:\n\n`), `${JSON.stringify(args[2], null, 2)}\n`);
            }
            if (args[3] !== undefined) {
                for (const [title, value] of Object.entries(args[3])) {
                    messages.push(chalk.bold(`${title}:\n\n`), `${JSON.stringify(value, null, 2)}\n`);
                }
            }
            messages.push(chalk.bold(`Difference:\n\n`), diffString(args[1], args[2]));
        }
    }
    process.stderr.write(`${messages.join("")}\n`);
    process.exit(-1);
}
