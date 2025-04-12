import type { Command } from "commander";

export function debugCommander(program: Command, argv: string[]) {
  program.exitOverride();
  program.configureOutput({
    writeOut: Function,
    writeErr: Function,
  });

  program.parse(["node", "dummy.js", ...argv]);
}

interface DebugBenchmarkData<T> {
  average: number;
  minimum: number;
  result: T;
}

export function debugBenchmark<T>(
  callback: () => T,
  printerIn?: ({ average, minimum, result }: DebugBenchmarkData<T>) => void,
  samplesIn = 1000,
  loopsIn = Number.POSITIVE_INFINITY,
  maxVariance = 0.01,
) {
  const printer =
    printerIn ??
    (({ average, minimum, result }) => {
      // eslint-disable-next-line no-console
      console.log(
        {
          loops,
          minimum,
          average,
        },
        result,
      );
    });

  let loops = 0;
  let average: number | undefined = undefined;
  let minimum = Number.POSITIVE_INFINITY;

  while (loops++ < loopsIn) {
    const samples = Math.min(samplesIn, loops);
    const now = performance.now();

    const result = callback();

    if (average === undefined) {
      average = performance.now() - now;
    } else {
      const performanceNow =
        (average / samples) * (samples - 1) +
        (performance.now() - now) / samples;

      average = Math.max(
        performanceNow * (1 - maxVariance),
        Math.min(performanceNow * (1 + maxVariance), performanceNow),
      );
    }

    if (average < minimum) {
      minimum = average;
    }

    printer({ average, minimum, result });
  }
}
