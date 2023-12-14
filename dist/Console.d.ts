#!/usr/bin/env node
export declare function fatal(...args: [
    message: string,
    expected: unknown,
    received: unknown,
    details?: Record<string, unknown>
] | [message: string, details?: unknown]): never;
