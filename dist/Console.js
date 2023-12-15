#!/usr/bin/env node
import e from"chalk";import{diffString as i}from"json-diff";export function fatal(...f){let r=[];if(r.push(e.red(`

${e.bgRed.black(" ERROR ")} ${f[0]}

`)),void 0!==f[1]){if(void 0===f[2])r.push(e.bold(`Details:

`),`${JSON.stringify(f[1],null,2)}
`);else{if(Buffer.isBuffer(f[1])||Buffer.isBuffer(f[2])||r.push(e.bold(`Expected:

`),`${JSON.stringify(f[1],null,2)}
`,e.bold(`Received:

`),`${JSON.stringify(f[2],null,2)}
`),void 0!==f[3])for(let[i,o]of Object.entries(f[3]))r.push(e.bold(`${i}:

`),`${JSON.stringify(o,null,2)}
`);r.push(e.bold(`Difference:

`),i(f[1],f[2]))}}process.stderr.write(`${r.join("")}
`),process.exit(-1)}