import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const path=process.argv[2]??'output/draft-v3.mp4';
const result=JSON.parse(execFileSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',path],{encoding:'utf8'}));
const video=result.streams.find(x=>x.codec_type==='video'),audio=result.streams.find(x=>x.codec_type==='audio');
if(video?.width!==1920||video?.height!==1080||video?.codec_name!=='h264'||video?.r_frame_rate!=='30/1'||video?.pix_fmt!=='yuv420p'||audio?.codec_name!=='aac')throw Error('Export did not meet the 1080p/30/H.264/yuv420p/AAC requirements');
const report={path,width:video.width,height:video.height,fps:video.r_frame_rate,codec:video.codec_name,pixelFormat:video.pix_fmt,audio:audio.codec_name,duration:Number(result.format.duration),bytes:Number(result.format.size),sizeTarget:null};
writeFileSync('output/verification-v3.json',JSON.stringify(report,null,2)+'\n');console.log(report);
