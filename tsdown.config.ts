import { defineConfig } from "tsdown";

// oxlint-disable-next-line import/no-anonymous-default-export
export default defineConfig({
  deps: { neverBundle: ["commander"] },
  entry: [
    "./src/index.ts",
    "./src/Array.ts",
    "./src/Buffer.ts",
    "./src/BufferBuilder.ts",
    "./src/BufferConsumer.ts",
    "./src/Cache.ts",
    "./src/Console.ts",
    "./src/ConsoleHexadecimal.ts",
    "./src/Debugger.ts",
    "./src/Encoding.ts",
    "./src/Hash.ts",
    "./src/Number.ts",
    "./src/Path.ts",
    "./src/types/ByteOrder.ts",
    "./src/types/PrintHexadecimalPreset.ts",
  ],
  minify: true,
  platform: "node",
});
