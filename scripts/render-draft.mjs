import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
mkdirSync('output',{recursive:true});
const run=(program,args)=>{const r=spawnSync(program,args,{stdio:'inherit',shell:process.platform==='win32'&&program==='pnpm'});if(r.status!==0)process.exit(r.status??1);};
run('pnpm',['exec','remotion','render','src/index.ts','ResourceHiveExplainer','output/draft-v3-picture.mp4','--codec','h264','--image-format','png','--pixel-format','yuv420p','--concurrency','4']);
run('ffmpeg',['-hide_banner','-y','-i','output/draft-v3-picture.mp4','-c:v','copy','-af','loudnorm=I=-18:TP=-1.5:LRA=11','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart','output/draft-v3.mp4']);
run('node',['scripts/verify.mjs']);
