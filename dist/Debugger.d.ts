import type { Command } from "commander";
export declare function debugCommander(program: Command, argv: string[]): void;
interface DebugBenchmarkData<T> {
    average: number;
    minimum: number;
    result: T;
}
export declare function debugBenchmark<T>(callback: () => T, printerIn?: ({ average, minimum, result }: DebugBenchmarkData<T>) => void, samplesIn?: number, loopsIn?: number, maxVariance?: number): void;
export {};
