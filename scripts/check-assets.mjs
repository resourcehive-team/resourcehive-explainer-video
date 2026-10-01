import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const base = fileURLToPath(new URL('../public/', import.meta.url));
const required = [
  'recordings/demo-01-catalogue.mp4',
  'recordings/demo-02-resource-detail.mp4',
  'recordings/demo-03-booking.mp4',
  'recordings/demo-04-bookings.mp4',
  ...['01-intro','02-problem','03-overview','04-product-workflow','05-bridge','06-architecture','07-booking-request','08-deployment','09-close'].map(name=>`audio/voice/${name}.mp3`),
];
let missing=0;
for(const file of required){const found=existsSync(join(base,file));console.log(`${found?'FOUND':'MISSING'}  public/${file}`);if(!found) missing++;}
if(missing){console.error(`${missing} required assets missing. See docs/CAPTURE_GUIDE.md and docs/VOICEOVER_GENERATION.md.`);process.exitCode=1;}
