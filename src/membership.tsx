import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {Check, CircleUserRound, ClipboardCheck, Database, RefreshCw, ShieldCheck} from 'lucide-react';
import captionsJson from './data/captions.json';
import wordsJson from './data/words.json';

const P='#f3efe7', A='#faf8f4', I='#1c1d1d', C='#c96f48', O='#e6a820', M='#aaa79e';
const FPS=30;
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.22,1,.36,1);
const ramp=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp,easing:ease});
type Cue={text:string;startMs:number};
const captions=captionsJson as Record<string,Cue[]>;
const words=wordsJson as Record<string,{text:string;start:number;end:number}[]>;
const at=(voice:string,phrase:string,fallback:number)=>{
 const normalize=(text:string)=>text.toLowerCase().replace(/[^a-z0-9]/g,'');
 const tokens=phrase.split(' ').map(normalize);
 const track=words[voice]??[];
 const index=track.findIndex((_,i)=>tokens.every((token,j)=>normalize(track[i+j]?.text??'')===token));
 if(index>=0)return track[index].start;
 const cue=captions[voice]?.find(c=>c.text.toLowerCase().includes(phrase.toLowerCase()));
 return cue?cue.startMs/1000:fallback;
};
const footage={
 'membership-request':{name:'demo-06-membership-pending',voice:'10.1',title:'Membership begins with a request.',detail:'Faculty of Engineering · member view',points:[[0,.4],[7.2,.8],[11.8,2.7],[12.3,3],[12.34,13],[21.4,13]]},
 'membership-review':{name:'demo-07-membership-approval',voice:'10.2',title:'An administrator reviews the request.',detail:'Faculty of Engineering · members',points:[[0,11],[4.6,13],[7.6,14.5],[8.6,16],[9.6,16.4],[10.25,16.9],[10.35,30],[12.3,30]]},
 'membership-result':{name:'demo-08-membership-result',voice:'10.3',title:'The member sees the decision.',detail:'My memberships · Pending → Approved',points:[[0,.3],[2.5,2.5],[4.3,5.5],[6.2,8.9],[9,10.5],[18.9,10.5]]},
} as const;
type FootageId=keyof typeof footage;
const Frame:React.FC<{name:string;sourceTime:number;f:number;emphasis?:boolean}>=({name,sourceTime,f,emphasis})=><div style={{position:'absolute',left:80,top:180,width:1760,height:754,overflow:'hidden',background:A,boxShadow:'0 27px 70px #1c1d1d2a'}}>
 <div style={{position:'absolute',left:0,top:-61,width:1760,height:953}}><Freeze frame={Math.round(sourceTime*FPS)}><OffthreadVideo src={staticFile(`recordings/${name}.mp4`)} muted style={{width:1760,height:953}}/></Freeze></div>
 {emphasis&&<div style={{position:'absolute',left:320,top:225,width:1000,height:320,border:`2px solid ${C}`,boxShadow:`0 0 ${14+6*Math.sin(f/13)}px #c96f4860`,opacity:ramp(f,155,185),pointerEvents:'none'}}/>}
 </div>;
export const MembershipFootage:React.FC<{id:FootageId}>=({id})=>{
 const f=useCurrentFrame();const data=footage[id];const t=f/FPS;
 const point=data.points.findIndex((p,i)=>i<data.points.length-1&&t>=p[0]&&t<=data.points[i+1][0]);
 const i=point<0?(t<data.points[0][0]?0:data.points.length-2):point;
 const a=data.points[i],b=data.points[i+1];
 const sourceTime=interpolate(t,[a[0],b[0]],[a[1],b[1]],clamp);
 return <AbsoluteFill style={{background:P,color:I}}>
  <div style={{position:'absolute',left:105,top:92,display:'flex',alignItems:'baseline',gap:27}}><span style={{fontSize:43,fontWeight:500,letterSpacing:'-.03em'}}>{data.title}</span><span style={{fontSize:23,color:'#706d64'}}>{data.detail}</span></div>
  <Frame name={data.name} sourceTime={sourceTime} f={f}/>
  <div style={{position:'absolute',right:82,top:202,width:4,height:Math.min(717,ramp(f,0,Math.round((id==='membership-request'?19.33:id==='membership-review'?10.27:16.85)*FPS))*717),background:C}}/>
 </AbsoluteFill>;
};

const Trace:React.FC<{d:string;f:number;from:number;to:number;color?:string;dim?:boolean}>=({d,f,from,to,color=C,dim})=>{
 const p=ramp(f,from,to);
 return <g opacity={dim?.25:1}><path d={d} stroke={color} strokeWidth={2} strokeOpacity={.28} fill="none"/><path d={d} pathLength={1} stroke={color} strokeWidth={3} strokeDasharray="1" strokeDashoffset={1-p} fill="none"/><path d={d} pathLength={1} stroke={color} strokeWidth={7} strokeLinecap="round" strokeDasharray=".012 .988" strokeDashoffset={-((Math.max(0,f-to)%100)/100)} fill="none" opacity={p>.99?1:0}/></g>;
};
export const MembershipRecord:React.FC=()=>{
 const f=useCurrentFrame();
 const request=at('10.4','request starts',3.2), serviceStart=at('10.4','Resource Service checks',9.34), permission=at('10.4','administrator has permission',11), eligible=at('10.4','and that this request',14.7), saved=at('10.4','approval and its audit',17.38), refresh=at('10.4','member refreshes',20.62), result=at('10.4','Approved result',28.78);
 const lift=ramp(f,8,45);const service=ramp(f,Math.round(serviceStart*FPS)-35,Math.round(serviceStart*FPS));const first=ramp(f,Math.round(permission*FPS),Math.round(permission*FPS)+28);const second=ramp(f,Math.round(eligible*FPS),Math.round(eligible*FPS)+28);const commit=ramp(f,Math.round(saved*FPS),Math.round(saved*FPS)+45);const pending=ramp(f,Math.round(request*FPS)-12,Math.round(request*FPS)+18);const statusOut=ramp(f,Math.round(saved*FPS),Math.round(saved*FPS)+18);const statusIn=ramp(f,Math.round(saved*FPS)+18,Math.round(saved*FPS)+42);const back=ramp(f,Math.round(refresh*FPS),Math.round(refresh*FPS)+55);const finish=ramp(f,Math.round(result*FPS)-15,Math.round(result*FPS)+25);
 return <AbsoluteFill style={{background:P,color:I}}>
  <div style={{position:'absolute',left:105,top:94,fontSize:59,fontWeight:500,letterSpacing:'-.038em',lineHeight:1.1}}>One membership. One decision.</div>
  <div style={{position:'absolute',left:108,top:168,fontSize:23,color:'#6f6a60'}}>The same record carries the request through approval.</div>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
   <rect x={96} y={336} width={694} height={462} fill="none" stroke={C} strokeWidth={2} pathLength={1} strokeDasharray="1" strokeDashoffset={1-commit} opacity={commit}/>
   <Trace d="M765 478 H916" f={f} from={Math.round(request*FPS)} to={Math.round(serviceStart*FPS)} dim={commit>.9}/>
   <Trace d="M1012 478 H1240 V350 H1360" f={f} from={Math.round(serviceStart*FPS)} to={Math.round(permission*FPS)+28} dim={commit>.9}/>
   <Trace d="M1012 478 H1360" f={f} from={Math.round(eligible*FPS)-30} to={Math.round(eligible*FPS)+17} dim={commit>.9}/>
   <Trace d="M964 526 V766 H790" f={f} from={Math.round(saved*FPS)-20} to={Math.round(saved*FPS)+45} color={O} dim={back>.9}/>
   {back>0&&<><path d="M765 582 H1160 V678 H1360" fill="none" stroke={P} strokeWidth={12} opacity={back}/><Trace d="M765 582 H1160 V678 H1360" f={f} from={Math.round(refresh*FPS)} to={Math.round(refresh*FPS)+48} color={C}/></>}
  </svg>
  <div style={{position:'absolute',left:115,top:300,width:650,opacity:lift,transform:`translateY(${(1-lift)*25}px)`}}>
   <div style={{fontSize:20,letterSpacing:'.03em',color:'#736d63',marginBottom:26}}>Faculty of Engineering</div>
   <div style={{position:'relative',background:A,border:`2px solid ${commit>.2?C:'#c9c3b7'}`,boxShadow:`0 16px 45px #1c1d1d10, 0 0 ${commit*22}px #c96f4828`,height:300,padding:'38px 44px'}}>
    <div style={{display:'flex',gap:22,alignItems:'center'}}><CircleUserRound size={53} strokeWidth={1.4}/><div><div style={{fontSize:35,letterSpacing:'-.025em'}}>Membership</div><div style={{fontSize:21,color:'#797369'}}>Member → organization</div></div></div>
    <div style={{height:1,background:'#d9d2c7',margin:'34px 0 26px'}}/>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontSize:23,color:'#6f6a60'}}>Status</span><div style={{position:'relative',width:225,height:43,fontSize:30,fontWeight:550}}><span style={{position:'absolute',right:0,color:'#8e5d1e',opacity:pending*(1-statusOut),transform:`translateY(${-statusOut*9}px)`}}>Pending</span><span style={{position:'absolute',right:0,color:'#436c4f',display:'flex',alignItems:'center',gap:12,opacity:statusIn,transform:`translateY(${(1-statusIn)*11}px)`,boxShadow:`0 0 ${statusIn*(14+Math.sin(f/20)*5)}px #64866835`}}><Check size={29}/>Approved</span></div></div>
   </div>
   
  </div>
  <div style={{position:'absolute',left:839,top:340,width:250,opacity:service,textAlign:'center'}}><div style={{fontSize:31,lineHeight:1.12,letterSpacing:'-.025em'}}>Resource<br/>Service</div><div style={{width:96,height:96,margin:'20px auto 0',border:`2px solid ${C}`,display:'grid',placeItems:'center',boxShadow:`0 0 ${service*19}px #c96f483e`}}><Database size={48} color={C} strokeWidth={1.35}/></div></div>
  <div style={{position:'absolute',left:1360,top:312,width:425,opacity:service}}><div style={{position:'relative',height:76,display:'flex',alignItems:'center',gap:22,opacity:.32+.68*first}}><ShieldCheck size={45} color={C} strokeWidth={1.4}/><div style={{fontSize:26,lineHeight:1.2}}>Administrator<br/>permission</div><Check size={25} color={C} style={{position:'absolute',right:0,opacity:first}}/></div><div style={{height:1,background:'#d5cfc4',margin:'23px 0 28px'}}/><div style={{position:'relative',height:76,display:'flex',alignItems:'center',gap:22,opacity:.32+.68*second}}><ClipboardCheck size={45} color={C} strokeWidth={1.4}/><div style={{fontSize:26,lineHeight:1.2}}>Request still<br/>eligible</div><Check size={25} color={C} style={{position:'absolute',right:0,opacity:second}}/></div></div>
  <div style={{position:'absolute',left:139,top:690,opacity:commit,transform:`translateY(${(1-commit)*24}px)`,display:'flex',alignItems:'center',gap:21}}><div style={{width:58,height:58,border:`1.5px solid ${C}`,display:'grid',placeItems:'center'}}><ClipboardCheck size={31} color={C}/></div><div><div style={{fontSize:27}}>Audit record</div><div style={{fontSize:19,color:'#777168'}}>Who approved · when</div></div><Check size={27} color={C}/></div>
  <div style={{position:'absolute',left:115,top:818,opacity:commit,color:'#736b60',fontSize:20,letterSpacing:'.03em'}}>One database transaction <span style={{color:C,margin:'0 13px'}}>—</span> status + audit</div>
  <div style={{position:'absolute',left:1360,top:650,opacity:back,width:360}}><RefreshCw size={55} color={C} strokeWidth={1.3} style={{transform:`rotate(${back*300}deg)`}}/><div style={{fontSize:31,marginTop:15}}>Member refresh</div><div style={{fontSize:22,color:'#6f6a60',marginTop:8}}>Reads the saved status</div><div style={{marginTop:18,fontSize:29,color:'#436c4f',opacity:finish,display:'flex',gap:13,alignItems:'center'}}><Check size={28}/>Approved</div></div>
  <div style={{position:'absolute',left:0,top:0,width:1920,height:1080,opacity:1-ramp(f,0,40),pointerEvents:'none',background:P}}><div style={{position:'absolute',left:80,top:180,width:1760,height:754,overflow:'hidden',boxShadow:'0 27px 70px #1c1d1d2a'}}><div style={{position:'absolute',top:-61}}><Freeze frame={315}><OffthreadVideo src={staticFile('recordings/demo-08-membership-result.mp4')} muted style={{width:1760,height:953}}/></Freeze></div></div></div>
 </AbsoluteFill>;
};
