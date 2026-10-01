import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const names=['01-intro','02-problem','03-overview','04-product-workflow','05-bridge','06-architecture','07-booking-request','08-deployment','09-close'];
const output={};
const status={};
const timing=JSON.parse(readFileSync(join(root,'src/data/timing.json'),'utf8'));
for(const name of names){
  const file=join(root,'public/audio/voice',`${name}.json`);
  if(!existsSync(file)){
    const seconds=timing[`audio/voice/${name}.mp3`];
    if(!seconds)continue;
    const words=readFileSync(join(root,'voiceover-text',`${name}.txt`),'utf8').trim().split(/\s+/);
    const chunks=[];let chunk='';
    for(const word of words){if(chunk&&`${chunk} ${word}`.length>46){chunks.push(chunk);chunk='';}chunk+=(chunk?' ':'')+word;if(/[.!?]$/.test(word)&&chunk.length>=25){chunks.push(chunk);chunk='';}}
    if(chunk)chunks.push(chunk);
    const totalWords=chunks.reduce((n,text)=>n+text.split(/\s+/).length,0);
    let cursor=0;
    output[name]=chunks.map(text=>{const length=(seconds-.25)*text.split(/\s+/).length/totalWords;const cue={start:cursor,end:cursor+length,text};cursor+=length;return cue;});
    status[name]='estimated from exact script and audio duration';
    continue;
  }
  const data=JSON.parse(readFileSync(file,'utf8'));
  const a=data.normalized_alignment??data.alignment??data;
  if(!Array.isArray(a.characters)||!Array.isArray(a.character_start_times_seconds)||!Array.isArray(a.character_end_times_seconds))throw Error(`Invalid ElevenLabs alignment: ${file}`);
  const cues=[];let chunk='';let start=0;let end=0;
  const flush=()=>{if(chunk.trim())cues.push({start,end,text:chunk.trim()});chunk='';};
  a.characters.forEach((char,index)=>{
    if(!chunk.trim())start=a.character_start_times_seconds[index];
    chunk+=char;end=a.character_end_times_seconds[index];
    if((chunk.length>=45&&/\s/.test(char))||(/[.!?]/.test(char)&&chunk.length>=24))flush();
  });
  flush();output[name]=cues;
  status[name]='ElevenLabs character alignment';
}
writeFileSync(join(root,'src/data/captions.json'),JSON.stringify(output,null,2)+'\n');
writeFileSync(join(root,'src/data/caption-status.json'),JSON.stringify(status,null,2)+'\n');
console.log(`Built captions for ${Object.keys(output).length} voice segments.`);
