export function debugCommander(e,r){e.exitOverride(),e.configureOutput({writeOut:()=>{},writeErr:()=>{}}),e.parse(["node","dummy.js",...r])}