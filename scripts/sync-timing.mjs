import {readdirSync, writeFileSync} from 'node:fs';
import {join, relative} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const pub=join(root,'public');
const timing={};
for(const folder of ['recordings','audio/voice','audio/music','audio/sfx']){
  for(const entry of readdirSync(join(pub,folder),{withFileTypes:true})){
    if(!entry.isFile()||!(/\.(mp4|mp3|wav)$/i).test(entry.name)) continue;
    const file=join(pub,folder,entry.name);
    const seconds=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file],{encoding:'utf8'}).trim());
    if(!Number.isFinite(seconds)||seconds<=0) throw Error(`Invalid media duration: ${file}`);
    timing[relative(pub,file).replaceAll('\\','/')]=seconds;
  }
}
writeFileSync(join(root,'src/data/timing.json'),JSON.stringify(timing,null,2)+'\n');
console.log(`Measured ${Object.keys(timing).length} media files.`);
