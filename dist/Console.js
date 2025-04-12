#!/usr/bin/env node
import e from"chalk";import{diffString as i}from"json-diff";export function fatal(...f){let n=[];if(n.push(e.red(`

${e.bgRed.black(" ERROR ")} ${f[0]}

`)),void 0!==f[1])if(void 0===f[2])n.push(e.bold("Details:\n\n"),`${JSON.stringify(f[1],null,2)}
`);else{if(Buffer.isBuffer(f[1])||Buffer.isBuffer(f[2])||n.push(e.bold("Expected:\n\n"),`${JSON.stringify(f[1],null,2)}
`,e.bold("Received:\n\n"),`${JSON.stringify(f[2],null,2)}
`),void 0!==f[3])for(let[i,r]of Object.entries(f[3]))n.push(e.bold(`${i}:

`),`${JSON.stringify(r,null,2)}
`);n.push(e.bold("Difference:\n\n"),i(f[1],f[2]))}process.stderr.write(`${n.join("")}
`),process.exit(-1)}