# AGENTS.md

## Project overview

`@triforce-heroes/triforce-core` is a strict TypeScript utility library (ESM only) providing
low-level building blocks shared by Triforce translation tooling (consumed by
`@triforce-heroes/triforce-publisher`): binary buffer serialization (`BufferBuilder`,
`BufferConsumer`) with selectable endianness, byte encodings, an in-memory `Cache`, console and
debug helpers, hashing, and small array/number/path utilities.

Stack: TypeScript (strict), Bun, tsdown bundling, Vitest, oxlint + oxfmt through
`@rheactor/rheactor-oxc-config`.

Entry points (`dist/*.mjs` with `dist/*.d.mts` types): `.` plus `./Array`, `./Buffer`,
`./BufferBuilder`, `./BufferConsumer`, `./Cache`, `./Console`, `./ConsoleHexadecimal`, `./Debugger`,
`./Encoding`, `./Hash`, `./Number`, `./Path`, `./types/ByteOrder`, `./types/PrintHexadecimalPreset`.
The root entry re-exports every module except `Buffer`, `Encoding` and `Hash`, which are
subpath-only.

Directory structure:

- `src/` — one flat module per utility (`Array.ts`, `Buffer.ts`, ...), shared types in `src/types/`,
  runtime shims in `src/polyfills/`, barrel in `src/index.ts`
- `tests/` — `tests/<Module>.test.ts` mirroring each source module, shared constants in
  `tests/fixtures/data.ts`, ANSI/color snapshots in `tests/__snapshots__/`
- `dist/` — tsdown build output (published to consumers)

## Mandatory rules

- ESM only (`"type": "module"`); no CommonJS.
- Path aliases are `#/*` → `./src/*` and `#tests/*` → `./tests/*`, declared in both the
  `package.json` `imports` field and the `tsconfig.json` `paths` (Node-native `#` imports, no
  tsconfig-paths plugin).
- Every public module has a matching `package.json` subpath export and a `tsdown.config.ts` entry;
  only `dist/` is published (`files: ["dist"]`).
- All class members (constructors, getters, methods) use the `public` modifier.
- Enums carry explicit initializers; numeric/underscore identifiers live under file-level
  `// oxlint-disable id-match` comments (the shared oxlint pattern forbids digits).
- Tests mirror sources one file per module; multi-scenario coverage uses `it.each` with typed
  arrays; console output is asserted with `ansi`/`colors` snapshots.
- Code and comments are in English; comments are sparse (security alerts, fixed bugs, distant
  context only).

## Testing policy

- Framework: Vitest, always executed through `bun run test` (single run, `vitest --run`) or
  `bun run test:watch`.
- Test files run sequentially (`fileParallelism: false`, `isolate: false` in `vitest.config.ts`).
- No minimum coverage threshold is configured.
- Every bug fix must include a regression test reproducing the bug before the fix.

## Documentation format

`README.md`, `AGENTS.md` and `CHANGELOG.md` are maintained by the `/create-agents` skill, which
audits them against the code. README entries follow this exact format: H1 is the package `name`
verbatim, tagline is the `description` verbatim, then `Installation`, a minimal `Quick start`, and
one `# <Entry> functions` section per entry point containing `## <Service> functions` groups in
alphabetical order. Each function uses `### functionName`, a TypeScript signature block (listing
every overload), one to three sentences (what it does, when to use it, edge cases), and a minimal
TypeScript example with the expected output as a comment.

## Dependency policy

- Bun is the official package manager (`bun.lock`); install with `bun install`.
- Runtime dependencies are `chalk` and `json-diff` only. Zero new dependencies without
  justification; suggestions belong in a final note, never in the tree.

## Build and publish

- `tsdown` bundles each entry point into `dist/` (platform `node`, minified, with `.d.mts` types);
  `bun run build` runs lint and tests first.
- Private package: consumed directly from GitHub (`bun add github:triforce-heroes/triforce-core`),
  not published to npm.

## Quality gates

Scripts available in `package.json`: `build` (`bun run lint && bun run test && tsdown`), `lint`
(`bun run typecheck && bun run oxlint && bun run oxfmt`), `lint:fix`, `oxfmt`, `oxfmt:fix`,
`oxlint`, `oxlint:fix`, `test` (`vitest --run`), `test:watch`, `typecheck` (`tsc --noEmit`). Always
use `bun run <script>` (the `package.json` scripts), never a direct binary: bare `bun test`, for
instance, bypasses the project's vitest configuration.
