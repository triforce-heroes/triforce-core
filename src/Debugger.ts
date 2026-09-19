import type { Command } from "commander";

export function debugCommander(program: Command, argv: string[]) {
  program.exitOverride();
  program.configureOutput({
    writeOut: () => {
      /* Swallow commander output during debug runs. */
    },
    writeErr: () => {
      /* Swallow commander output during debug runs. */
    },
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
  loopsIn = Infinity,
  maxVariance = 0.01,
) {
  let loops = 0;
  let average: number | undefined = undefined;
  let minimum = Infinity;

  const printer =
    printerIn ??
    (({ average: averageValue, minimum: minimumValue, result }) => {
      // eslint-disable-next-line no-console
      console.log(
        {
          loops,
          minimum: minimumValue,
          average: averageValue,
        },
        result,
      );
    });

  while (loops++ < loopsIn) {
    const samples = Math.min(samplesIn, loops);
    const now = performance.now();

    const result = callback();

    if (average === undefined) {
      average = performance.now() - now;
    } else {
      const performanceNow =
        (average / samples) * (samples - 1) + (performance.now() - now) / samples;

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
