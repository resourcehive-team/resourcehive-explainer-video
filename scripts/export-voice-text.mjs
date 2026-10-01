import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const markdown=readFileSync(join(root,'docs/NARRATION_SCRIPT.md'),'utf8');
const headers=[...markdown.matchAll(/^## (\d\d) — ([^\n]+)\n\n/gm)];
const sections=headers.map((match,index)=>({number:match[1],text:markdown.slice(match.index+match[0].length,headers[index+1]?.index??markdown.length).trim()}));
const names=['intro','problem','overview','product-workflow','bridge','architecture','booking-request','deployment','close'];
if(sections.length!==names.length)throw Error(`Expected ${names.length} narration sections, found ${sections.length}`);
mkdirSync(join(root,'voiceover-text'),{recursive:true});
sections.forEach((section,index)=>writeFileSync(join(root,'voiceover-text',`${section.number}-${names[index]}.txt`),section.text+'\n'));
console.log(`Wrote ${sections.length} voiceover text files.`);
