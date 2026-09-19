#!/usr/bin/env node
import e from"chalk";import{diffString as t}from"json-diff";function n(...n){let[r,i,a,o]=n,s=[e.red(`\n\n${e.bgRed.black(` ERROR `)} ${r}\n\n`)];if(i!==void 0){if(a===void 0)s.push(e.bold(`Details:

`),`${JSON.stringify(i,null,2)}\n`);else{if(!Buffer.isBuffer(i)&&!Buffer.isBuffer(a)&&s.push(e.bold(`Expected:

`),`${JSON.stringify(i,null,2)}\n`,e.bold(`Received:

`),`${JSON.stringify(a,null,2)}\n`),o!==void 0){let t=Object.entries(o);for(let[n,r]of t)s.push(e.bold(`${n}:\n\n`),`${JSON.stringify(r,null,2)}\n`)}s.push(e.bold(`Difference:

`),t(i,a))}}process.stderr.write(`${s.join(``)}\n`),process.exit(-1)}export{n as fatal};