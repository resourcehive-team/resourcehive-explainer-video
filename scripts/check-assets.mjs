import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const base = fileURLToPath(new URL('../public/', import.meta.url));
const required = [
  'recordings/demo-01-catalogue.mp4',
  'recordings/demo-02-resource-detail.mp4',
  'recordings/demo-03-booking.mp4',
  'recordings/demo-04-bookings.mp4',
  'recordings/demo-05-admin-montage.mp4',
  'recordings/demo-06-membership-pending.mp4',
  'recordings/demo-07-membership-approval.mp4',
  'recordings/demo-08-membership-result.mp4',
  ...['create-resource','analytics','disputes','notifications'].map(name=>`recordings/${name}.mp4`),
  ...['01-intro','02-problem','03-overview','04-product-workflow','05-bridge','06-architecture','07-booking-request','08-deployment','09-close','10.1','10.2','10.3','10.4','12.1','12.2','12.3','12.4'].map(name=>`audio/voice/${name}.mp3`),
];
let missing=0;
for(const file of required){const found=existsSync(join(base,file));console.log(`${found?'FOUND':'MISSING'}  public/${file}`);if(!found) missing++;}
if(missing){console.error(`${missing} required assets missing. See docs/CAPTURE_GUIDE.md and docs/VOICEOVER_GENERATION.md.`);process.exitCode=1;}
