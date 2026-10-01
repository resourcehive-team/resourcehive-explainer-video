import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, interpolate, Easing, staticFile, useCurrentFrame} from 'remotion';
import {ArrowRight, Bell, Boxes, CalendarDays, Check, CheckCheck, CircleUserRound, Database, GitBranch, Globe, KeyRound, Layers, LockKeyhole, Monitor, Radio, ReceiptText, Search, Server, ShieldCheck, Users, Wallet, X, type LucideIcon} from 'lucide-react';
import {FPS, scenes, type SceneDef} from './data/scenes';
import timing from './data/timing.json';
import captionData from './data/captions.json';
import './fonts';
import {siNextdotjs,siVercel,siPostgresql,siApachekafka,siGithubactions,siDocker} from 'simple-icons';
import {MembershipFootage, MembershipRecord} from './membership';

const P='#f3efe7', A='#faf8f4', I='#1c1d1d', C='#c96f48', O='#e6a820', S='#d9ddd0', M='#aaa79e';
const measured=timing as Record<string,number>;
type Cue={text:string;startMs?:number;endMs?:number;start?:number;end?:number};
const captions=captionData as Record<string,Cue[]>;
export const sceneFrames=scenes.map(s=>Math.ceil(measured[`audio/voice/${s.voice}.mp3`]*FPS)+(s.id==='close'?120:60));
export const starts=sceneFrames.map((_,i)=>sceneFrames.slice(0,i).reduce((a,b)=>a+b-24,0));
export const totalFrames=starts.at(-1)!+sceneFrames.at(-1)!;
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.22,1,.36,1);
const ramp=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp,easing:ease});
const cueStart=(c:Cue)=>(c.startMs??(c.start??0)*1000)/1000;
const cueEnd=(c:Cue)=>(c.endMs??(c.end??0)*1000)/1000;
const at=(voice:string,phrase:string,fallback:number)=>{
 const cue=captions[voice]?.find(c=>c.text.toLowerCase().includes(phrase.toLowerCase()));
 return cue?cueStart(cue):fallback;
};
const Brand:React.FC<{icon:{path:string};size?:number;color?:string}>=({icon,size=40,color='currentColor'})=><svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{flexShrink:0}}><path d={icon.path}/></svg>;
const stroke:React.CSSProperties={strokeWidth:1.6};

const CaptionLayer:React.FC<{voice:string}>=({voice})=>{
 const t=useCurrentFrame()/FPS;const cue=captions[voice]?.find(c=>t>=cueStart(c)&&t<cueEnd(c));
 if(!cue)return null;
 const words=cue.text.split(' ');const lines:string[]=[];let line='';
 for(const word of words){if(line.length+word.length>43){lines.push(line);line='';}line+=(line?' ':'')+word;}if(line)lines.push(line);
 return <div style={{position:'absolute',zIndex:30,bottom:42,width:'100%',textAlign:'center',fontFamily:'Geist',fontWeight:450,fontSize:36,lineHeight:1.35,color:'#fff',textShadow:'0 2px 2px #000'}}>{lines.map((s,i)=><div key={i}><span style={{background:'rgba(0,0,0,.82)',padding:'2px 10px',boxDecorationBreak:'clone'}}>{s}</span></div>)}</div>;
};

const Wordmark:React.FC<{dark?:boolean;size?:number}>=({dark=false,size=31})=><div style={{display:'flex',alignItems:'center',gap:14,color:dark?P:I}}><Img src={staticFile('images/resourcehive-mark.svg')} style={{width:size,height:size}}/><span style={{fontFamily:'Instrument Serif',fontSize:size*1.15}}>ResourceHive</span></div>;
const Title:React.FC<{children:React.ReactNode;sub?:string;dark?:boolean}>=({children,sub,dark})=><div style={{position:'absolute',left:100,top:103,color:dark?P:I}}><div style={{fontSize:60,fontWeight:500,letterSpacing:'-.035em',lineHeight:1.1}}>{children}</div>{sub&&<div style={{fontSize:25,marginTop:18,color:dark?M:'#67665f'}}>{sub}</div>}</div>;

// All movement is frame-driven. The same paths both draw and carry the packets.
const Wire:React.FC<{d:string;f:number;delay?:number;color?:string;active?:boolean;dashed?:boolean}>=({d,f,delay=0,color=C,active=true,dashed=false})=>{
 const p=ramp(f,delay,delay+35);const phase=((Math.max(0,f-delay)%155)/155);
 return <g opacity={active?1:.24}><path d={d} fill="none" stroke={color} strokeWidth={2} strokeOpacity={.38} strokeDasharray={dashed?'6 7':undefined}/><path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray="1" strokeDashoffset={1-p}/>{active&&p>.99&&<path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray=".012 .988" strokeDashoffset={-phase}/>}</g>;
};
const Service:React.FC<{x:number;y:number;name:string;detail:string;icon:LucideIcon;active:boolean;f:number;delay?:number;width?:number}>=({x,y,name,detail,icon:Icon,active,f,delay=0,width=280})=>{
 const show=ramp(f,delay,delay+26);const pulse=.5+.5*Math.sin(f/24);
 return <div style={{position:'absolute',left:x,top:y,width,height:140,opacity:show*(active?1:.45),transform:`translateY(${(1-show)*18}px)`,background:active?'#30302b':'#252624',border:`1px solid ${active?C:'#505149'}`,boxShadow:active?`0 12px 28px #0004, 0 0 ${14+pulse*10}px #c96f4828`:'none',padding:'23px 25px'}}><Icon size={29} color={active?O:M} style={stroke}/><div style={{fontSize:29,color:P,marginTop:8,letterSpacing:'-.02em'}}>{name}</div><div style={{fontSize:17,color:active?S:M,marginTop:5,whiteSpace:'nowrap'}}>{detail}</div></div>;
};

const Architecture:React.FC<{mode?:'architecture'|'request'|'deployment'}>=({mode='architecture'})=>{
 const f=useCurrentFrame();const t=f/FPS;const deployment=mode==='deployment';const request=mode==='request';
 const names=['Identity','Resource','Booking','Notification'];const xs=[150,585,1020,1455];const centers=xs.map(x=>x+140);
 let active=-1;
 if(request)active=t<4?-1:t<at('07-booking-request','After the transaction',49)?2:3;
 else if(!deployment){active=t<at('06-architecture','Identity handles',21)?-1:t<at('06-architecture','Resource handles',25)?0:t<at('06-architecture','Booking owns',30)?1:t<at('06-architecture','Notification processes',35)?2:t<at('06-architecture','Prisma',40)?3:-1;}
 const dataStart=at('06-architecture','Prisma',40); const dataOn=request||deployment||t>dataStart; const dataFrame=request||deployment?f+200:f-dataStart*FPS;
 const kafkaStart=at('06-architecture','Kafka',45); const kafkaOn=request||deployment||t>kafkaStart; const kafkaFrame=request||deployment?f+200:f-kafkaStart*FPS;
 const show=deployment||request?300:f;
 return <AbsoluteFill style={{background:I,color:P}}>
  <Title dark sub={deployment?'One public entry point. Four private service containers.':request?'POST /bookings → Caddy → Booking Service':'Independent HTTP routes · shared persistence · asynchronous events'}>{deployment?'Separate services. One deployment.':request?'Follow one reservation.':'Four services, clear responsibilities.'}</Title>
  {deployment&&<><svg width="1920" height="1080" style={{position:'absolute',inset:0,clipPath:`inset(0 ${(1-ramp(f,138,186))*100}% 0 0)`}}><path d="M700 258 H1805 V678 H115 V410 H700 Z" fill="#242521" stroke="#747468"/></svg><div style={{position:'absolute',left:1240,top:280,display:'flex',gap:12,alignItems:'center',fontSize:22,color:S}}><Brand icon={siDocker} size={30}/>Linode VM / private Docker network</div></>}

  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
   <Wire d="M550 324 H800" f={show} delay={10}/>
   {centers.map((x,i)=><Wire key={x} d={`M960 369 V416 H${x} V485`} f={show} delay={28+i*10} active={active<0||active===i}/>) }
   {dataOn&&centers.map((x,i)=><Wire key={`db${i}`} d={`M${x} 625 V722 H825 V785`} color={S} f={dataFrame} delay={0} active={(!request||t>24.9)&&(active<0||active===i)} dashed/>) }
   {kafkaOn&&<><Wire d="M1230 625 V681 H1420 V785" f={kafkaFrame} color={O} active={!request||t>46.2}/><Wire d="M1665 808 H1790 V555 H1735" f={kafkaFrame-20} color={O} active={!request||t>46.2}/></>}
  </svg>
  <div style={{position:'absolute',left:180,top:280,width:370,height:89,display:'flex',alignItems:'center',gap:20,color:P}}><Brand icon={deployment?siVercel:siNextdotjs} size={40}/><div><div style={{fontSize:27}}>{deployment?'Vercel':'Browser'}</div><div style={{fontSize:20,color:M}}>Next.js frontend</div></div></div>
  <div style={{position:'absolute',left:800,top:280,width:320,height:89,background:P,color:I,padding:'17px 26px',display:'flex',gap:22,alignItems:'center'}}><GitBranch size={34}/><div><div style={{fontSize:28}}>Caddy</div><div style={{fontSize:17}}>Public HTTPS → private routes</div></div></div>
  {names.map((name,i)=><Service key={name} x={xs[i]} y={485} name={name} detail={['Accounts · authentication','Organizations · catalogue','Slots · reservations · points','Messages · realtime'][i]} icon={[KeyRound,Boxes,CalendarDays,Bell][i]} active={active<0||active===i} f={show} delay={45+i*8}/>)}
  {dataOn&&<div style={{position:'absolute',left:620,top:785,width:410,opacity:ramp(dataFrame,15,45),color:S,display:'flex',gap:20,alignItems:'center'}}><Brand icon={siPostgresql} size={44}/><div><div style={{fontSize:27}}>Neon · PostgreSQL</div><div style={{fontSize:18,color:M}}>Prisma · shared database</div></div></div>}
  {kafkaOn&&<div style={{position:'absolute',left:1300,top:785,width:360,opacity:ramp(kafkaFrame,15,45),color:O,display:'flex',gap:20,alignItems:'center'}}><Brand icon={siApachekafka} size={44}/><div><div style={{fontSize:27}}>Aiven · Kafka</div><div style={{fontSize:18,color:M}}>Booking events → Notification</div></div></div>}
  {deployment&&<div style={{position:'absolute',left:150,top:798,color:M,fontSize:18,maxWidth:350}}>Managed infrastructure<br/>outside the VM</div>}
  {request&&t<14&&<div style={{position:'absolute',left:1030,top:432,color:O,fontSize:22,display:'flex',gap:10,alignItems:'center'}}><LockKeyhole size={22}/>Authenticated request</div>}
 </AbsoluteFill>;
};

const Footage:React.FC<{name:string;label?:string;focus?:'modal'|'cost'|'reference';small?:boolean;rate?:number;bookingTiming?:boolean}>=({name,label,focus,small=false,rate=1,bookingTiming=false})=>{
 const f=useCurrentFrame();const seconds=measured[`recordings/${name}.mp4`];const cutoff=name==='demo-03-booking'?18:seconds-.2;
 const sourceTime=bookingTiming?interpolate(f,[0,9.3*FPS,15*FPS,19.5*FPS],[3,12.8,15.2,18],clamp):f/FPS*rate;
 const still=name==='demo-03-booking'?'booking-confirmation.png':`${name}-last.png`;
 const scale=small?.72:interpolate(f,[0,160,900],[.935,.955,.97],clamp);
 // Source is 1776 x 1052. Cropping browser chrome retains its native pixels; max scale < 1.
 return <div style={{position:'absolute',left:72,top:151,width:1776,height:800,transform:`perspective(3000px) translateY(${8*Math.sin(f/230)}px) rotateY(${small?-8:interpolate(f,[0,90],[-1.2,0],clamp)}deg) scale(${scale})`,transformOrigin:small?'right center':'center center',background:A,boxShadow:'0 26px 65px #1c1d1d25',overflow:'hidden'}}>
   <div style={{position:'absolute',top:-94,left:0,width:1776,height:1052}}>{sourceTime>=cutoff?<Img src={staticFile(`screenshots/${still}`)} style={{width:1776,height:1052}}/>:<Freeze frame={Math.round(sourceTime*FPS)}><OffthreadVideo src={staticFile(`recordings/${name}.mp4`)} muted style={{width:1776,height:1052}}/></Freeze>}</div>
   {label&&<div style={{position:'absolute',left:32,bottom:28,fontSize:22,background:I,color:P,padding:'10px 17px',display:'flex',alignItems:'center',gap:14}}><Check size={22} color={O}/>{label}</div>}
   {focus&&<div style={{position:'absolute',border:`3px solid ${C}`,boxShadow:`0 0 ${15+8*Math.sin(f/17)}px #c96f4880`,left:focus==='cost'?334:452,top:focus==='cost'?480:focus==='reference'?425:252,width:focus==='cost'?1080:854,height:focus==='cost'?124:focus==='reference'?177:456,opacity:ramp(f,55,85),pointerEvents:'none'}}/>}
 </div>;
};

const ProductShot:React.FC<{name:string;title:string;detail?:string;focus?:'modal'|'cost'|'reference';rate?:number;bookingTiming?:boolean}>=({name,title,detail,focus,rate,bookingTiming})=>{
 const f=useCurrentFrame();return <AbsoluteFill style={{background:P,clipPath:`inset(0 ${(1-ramp(f,0,22))*100}% 0 0)`}}><div style={{position:'absolute',left:110,top:91,display:'flex',alignItems:'baseline',gap:26}}><span style={{fontSize:42,fontWeight:500,letterSpacing:'-.025em'}}>{title}</span>{detail&&<span style={{fontSize:23,color:'#706d64'}}>{detail}</span>}</div><Footage name={name} focus={focus} rate={rate} bookingTiming={bookingTiming}/></AbsoluteFill>;
};
const Workflow:React.FC=()=>{
 const voice='04-product-workflow';
 const b=at(voice,'I open Create booking',20), c=at(voice,'confirmation gives',40), d=at(voice,'From the Bookings',48);
 const shots=[{s:0,e:7.6,name:'demo-01-catalogue',title:'Discover what is available.',detail:'The resource catalogue'}, {s:7.6,e:b,name:'demo-02-resource-detail',title:'Know the resource before you book.',detail:'Owner · access · point cost'}, {s:b,e:c,name:'demo-03-booking',title:'Choose a published slot.',detail:'Availability checked by the API'}, {s:c,e:d,name:'demo-03-booking',title:'One confirmed reservation.',detail:'Reference · schedule · points'}, {s:d,e:sceneFrames[3]/FPS,name:'demo-04-bookings',title:'Keep the result in view.',detail:'Your booking history'}];
 return <>{shots.map((s,i)=><Sequence key={i} from={Math.round(s.s*FPS)} durationInFrames={Math.ceil((s.e-s.s)*FPS)+22}>{i===3?<Confirmation title={s.title}/>:<ProductShot name={s.name} title={s.title} detail={s.detail} rate={1} bookingTiming={i===2}/>}</Sequence>)}</>;
};
const Confirmation:React.FC<{title?:string;bridge?:boolean}>=({title='What happens behind Confirm?',bridge=false})=>{
 const f=useCurrentFrame();const pull=bridge?ramp(f,55,160):0;
 return <AbsoluteFill style={{background:P}}><Title>{title}</Title><div style={{position:'absolute',left:140,top:245,width:1640,height:650,overflow:'hidden',boxShadow:'0 25px 60px #1c1d1d25',transform:`translateX(${-pull*300}px) scale(${1-pull*.34})`,transformOrigin:'center center'}}><Img src={staticFile('screenshots/booking-confirmation.png')} style={{position:'absolute',width:1776,height:1052,left:-65,top:-224}}/><div style={{position:'absolute',left:387,top:190,width:845,height:310,border:`3px solid ${C}`,boxShadow:`0 0 ${18+Math.sin(f/20)*10}px #c96f4860`}}/></div>{bridge&&<div style={{position:'absolute',left:1240,top:380,opacity:pull,transform:`translateX(${(1-pull)*60}px)`,width:560}}><div style={{color:C}}><ArrowRight size={70}/></div><div style={{fontSize:52,lineHeight:1.15,letterSpacing:'-.025em',marginTop:24}}>A simple action.<br/>A coordinated system.</div><div style={{fontSize:25,color:'#726c60',marginTop:26}}>Authenticate. Validate. Commit. Notify.</div></div>}</AbsoluteFill>;
};

const Intro:React.FC=()=>{
 const f=useCurrentFrame();const open=ramp(f,0,65);
 return <AbsoluteFill style={{background:P}}><div style={{position:'absolute',left:1030,top:160,width:720,height:650,transform:`rotate(-4deg) translateY(${20*Math.sin(f/160)}px)`,overflow:'hidden',boxShadow:'0 28px 70px #1c1d1d22'}}><Img src={staticFile('screenshots/booking-confirmation.png')} style={{position:'absolute',height:720,width:1216,left:-225,top:-64}}/></div><div style={{position:'absolute',left:110,top:260,width:930}}><div style={{overflow:'hidden'}}><div style={{fontFamily:'Instrument Serif',fontSize:150,letterSpacing:'-.035em',transform:`translateY(${(1-open)*160}px)`}}>ResourceHive</div></div><div style={{fontSize:47,letterSpacing:'-.025em',lineHeight:1.2,marginTop:30}}>Shared resources.<br/>One clear path to a booking.</div><svg width="700" height="80" style={{marginTop:35}}><Wire d="M0 30 H640" f={f} delay={48} color={C}/></svg><div style={{fontSize:24,color:'#716d65'}}>From the member’s screen to the system behind it.</div></div></AbsoluteFill>;
};
const Problem:React.FC=()=>{
 const f=useCurrentFrame();const t=f/FPS;const converge=ramp(f,210,330);const items=[{icon:Boxes,label:'Equipment',x:1120,y:285},{icon:Users,label:'Communities',x:1500,y:620},{icon:CalendarDays,label:'Available time',x:1100,y:650}];
 return <AbsoluteFill style={{background:P}}><div style={{position:'absolute',left:110,top:245,width:810}}><div style={{fontFamily:'Instrument Serif',fontSize:97,lineHeight:1.05,letterSpacing:'-.02em'}}>Sharing starts<br/>with visibility.</div><div style={{fontSize:32,lineHeight:1.5,marginTop:38,width:600,color:'#68645b'}}>Find what exists.<br/>Know who can use it.<br/>Reserve time without a conflict.</div></div><svg width="1920" height="1080"><Wire d={`M1204 ${323-15*Math.sin(f/90)} C1300 ${323-15*Math.sin(f/90)} 1390 395 1470 395`} f={f} delay={40}/><Wire d="M1200 650 C1320 650 1350 550 1530 455" f={f} delay={100}/><Wire d="M1545 620 V465" f={f} delay={140}/></svg>{items.map(({icon:Icon,label,x,y},i)=><div key={label} style={{position:'absolute',left:x,top:y-15*Math.sin(f/90+i),color:I,opacity:ramp(f,10+i*20,65+i*20)}}><Icon size={76} strokeWidth={1.1}/><div style={{fontSize:27,marginTop:18}}>{label}</div></div>)}<div style={{position:'absolute',left:1470,top:315,width:170,height:170,background:I,color:O,display:'grid',placeItems:'center',transform:`scale(${.9+converge*.1})`,boxShadow:`0 22px 50px #1c1d1d20`}}>{t<10?<Search size={77} strokeWidth={1.2}/>:<ShieldCheck size={77} strokeWidth={1.2}/>}</div><div style={{position:'absolute',left:1040,top:825,width:700,height:3,background:'#d7d0c4'}}><div style={{width:`${ramp(f,30,630)*100}%`,height:3,background:C}}/></div></AbsoluteFill>;
};
const Overview:React.FC=()=>{
 const f=useCurrentFrame();const step=Math.min(2,Math.floor(f/180));return <AbsoluteFill style={{background:P}}><Footage name='demo-01-catalogue' small rate={.7}/><div style={{position:'absolute',left:110,top:285,zIndex:2,width:640}}>{['Discover.','Check.','Reserve.'].map((w,i)=><div key={w} style={{fontFamily:'Instrument Serif',fontSize:96,lineHeight:1.22,color:I,opacity:.4+.6*Math.exp(-Math.pow((f-(i*180+90))/140,4)),transform:`translateX(${24*Math.exp(-Math.pow((f-(i*180+90))/100,4))}px)`}}>{w}</div>)}<div style={{fontSize:26,marginTop:35,color:'#706a60'}}>One connected member workflow.</div></div></AbsoluteFill>;
};

const Validation:React.FC=()=>{
 const f=useCurrentFrame();const checks=[['Authenticated member',KeyRound],['Organization access',Users],['Active resource',Boxes],['Future, available slot',CalendarDays],['Sufficient points',Wallet]] as const;const idx=Math.min(4,Math.floor(f/70));
 return <AbsoluteFill style={{background:I,color:P}}><Title dark sub="Booking Service validates the request before any write.">Every reservation passes the same checks.</Title><div style={{position:'absolute',left:160,top:330,width:560}}><div style={{fontFamily:'Instrument Serif',fontSize:100,lineHeight:1.06}}>Access.<br/>Availability.<br/>Balance.</div><div style={{marginTop:36,color:O,fontSize:25}}>The server makes the decision.</div></div><div style={{position:'absolute',left:930,top:320,width:780}}>{checks.map(([label,Icon],i)=><div key={label} style={{height:101,borderBottom:'1px solid #44443d',display:'flex',alignItems:'center',gap:24,color:i<=idx?P:'#787a70',opacity:.5+.5*ramp(f,i*70-15,i*70+15),transform:`translateX(${12*Math.exp(-Math.pow((f-(i*70+35))/50,4))}px)`}}><Icon size={32} color={i===idx?O:M}/><span style={{fontSize:31,flex:1}}>{label}</span><Check size={31} color={C} style={{opacity:ramp(f,i*70,i*70+20)}}/></div>)}</div></AbsoluteFill>;
};
const TransactionPhase:React.FC<{phase:number}>=({phase})=>{
 const f=useCurrentFrame();const code=phase===0?['isolationLevel:', 'Prisma.TransactionIsolationLevel.Serializable']:phase===1?['await this.points.appendBookingDeduction(', '  {', '    userId: context.userId,', '    bookingId: booking.id,', '    rootOrganizationId: context.rootOrganizationId,', '    amount: -context.pointCost,']:['CREATE UNIQUE INDEX bookings_active_slot_unique','ON bookings (resource_slot_id)',"WHERE status IN ('CONFIRMED', 'COMPLETED');"];
 return <AbsoluteFill style={{background:I,color:P}}><Title dark sub={phase===2?'Database constraint + concurrency test': 'Booking record and point deduction share one transaction.'}>{phase===2?'One slot. One winning request.':'Succeed together. Fail together.'}</Title><div style={{position:'absolute',left:130,top:335,width:660,height:440}}>{phase<2?<><div style={{position:'absolute',inset:0,border:`2px solid ${C}`,clipPath:`inset(0 ${(1-ramp(f,0,50))*100}% 0 0)`}}/><div style={{position:'absolute',left:30,top:-17,background:I,padding:'0 15px',fontSize:21,color:O}}>SERIALIZABLE TRANSACTION</div>{[{Icon:CalendarDays,label:'Confirmed booking'},{Icon:Wallet,label:'Point ledger entry'}].map(({Icon,label},i)=><div key={label} style={{position:'absolute',left:50,top:75+i*185,display:'flex',alignItems:'center',gap:28}}><Icon size={53} color={O}/><span style={{fontSize:30}}>{label}</span><CheckCheck size={30} color={C}/></div>)}<svg width="660" height="440"><Wire d="M76 138 V255" f={f} color={C}/></svg></>:<><div style={{fontSize:25,color:M,marginBottom:38}}>Two requests target the same slot</div>{['Request A','Request B'].map((s,i)=><div key={s} style={{display:'flex',alignItems:'center',gap:30,marginTop:28,fontSize:32}}><span>{s}</span><ArrowRight color={C}/><span style={{color:i?M:O}}>{i?'Rejected':'Confirmed'}</span>{i?<X size={29}/>:<Check size={29} color={O}/>}</div>)}<div style={{marginTop:60,color:M,fontSize:23}}>The test expects exactly one success.</div></>}</div><div style={{position:'absolute',left:900,top:360,width:880}}><div style={{fontSize:22,color:M,marginBottom:30}}>{phase===2?'db/schema/migrations/…/migration.sql':'services/booking-service · booking.service.ts'}</div><div style={{fontFamily:'Consolas, monospace',fontSize:26,lineHeight:1.9}}>{code.map((line,i)=><div key={`${phase}-${i}`} style={{color:i===0?O:P,clipPath:`inset(0 ${(1-ramp(f,i*8,i*8+30))*100}% 0 0)`}}>{line}</div>)}</div><div style={{height:2,background:'#555348',marginTop:40}}/><div style={{fontSize:27,color:S,marginTop:30}}>{phase===2?'Integrity is enforced in the database.':'A single atomic boundary.'}</div></div></AbsoluteFill>;
};
const Crossflow:React.FC<{children:React.ReactNode}>=({children})=>{
 const f=useCurrentFrame();const p=ramp(f,0,24);return <AbsoluteFill style={{opacity:p,transform:`translateX(${(1-p)*32}px)`}}>{children}</AbsoluteFill>;
};
const Transaction:React.FC=()=><>
 <Sequence durationInFrames={159}><TransactionPhase phase={0}/></Sequence>
 <Sequence from={135} durationInFrames={209}><Crossflow><TransactionPhase phase={1}/></Crossflow></Sequence>
 <Sequence from={320}><Crossflow><TransactionPhase phase={2}/></Crossflow></Sequence>
</>;
const Request:React.FC=()=>{
 const checks=at('07-booking-request','service checks',11);const txn=at('07-booking-request','booking record',25);const post=at('07-booking-request','After the transaction',49);
 return <>
 <Sequence durationInFrames={Math.round(checks*FPS)+28}><Architecture mode="request"/></Sequence>
 <Sequence from={Math.round(checks*FPS)} durationInFrames={Math.round((txn-checks)*FPS)+28}><SceneTransition index={1}><Validation/></SceneTransition></Sequence>
 <Sequence from={Math.round(txn*FPS)} durationInFrames={Math.round((post-txn)*FPS)+28}><SceneTransition index={1}><Transaction/></SceneTransition></Sequence>
 <Sequence from={Math.round(post*FPS)}><SceneTransition index={1}><Sequence from={-Math.round(post*FPS)-1}><Architecture mode="request"/></Sequence><div style={{position:"absolute",left:135,top:880,color:S,fontSize:25}}>Committed first. Notification delivery follows asynchronously.</div></SceneTransition></Sequence>
 </>;
};
const Pipeline:React.FC=()=>{
 const f=useCurrentFrame();const items=[{title:'Build',sub:'Four service images',Icon:Boxes},{title:'Publish',sub:'GitHub Container Registry',Icon:Layers},{title:'Migrate',sub:'Prisma migrations',Icon:Database},{title:'Deploy',sub:'Linode containers',Icon:Server}];const stage=Math.min(3,Math.floor(f/85));
 return <AbsoluteFill style={{background:I,color:P}}><Title dark sub="GitHub Actions → GHCR → Linode">From source code to running services.</Title><svg width="1920" height="1080"><Wire d="M260 540 H1650" f={f} color={C}/></svg>{items.map(({title,sub,Icon},i)=><div key={title} style={{position:'absolute',left:150+i*440,top:400,width:340,opacity:.35+.65*ramp(f,i*85-10,i*85+25),transform:`translateY(${-10*Math.exp(-Math.pow((f-(i*85+40))/55,4))}px)`}}><div style={{width:120,height:120,background:I,display:'grid',placeItems:'center',outline:`2px solid ${i<=stage?C:'#555'}`,outlineOffset:8,marginBottom:50}}><Icon size={66} color={i<=stage?O:M} strokeWidth={1.3}/></div><div style={{fontSize:42,marginBottom:18}}>{title}</div><div style={{fontSize:23,color:M}}>{sub}</div></div>)}<div style={{position:'absolute',left:150,top:825,fontSize:27,color:S}}>Four independent containers. A repeatable deployment.</div></AbsoluteFill>;
};
const Deployment:React.FC=()=>{
 const f=useCurrentFrame();const p=at('08-deployment','deployment workflow',23);
 return <><Sequence durationInFrames={Math.round(p*FPS)+28}><Architecture mode="deployment"/></Sequence><Sequence from={Math.round(p*FPS)}><SceneTransition index={1}><Pipeline/></SceneTransition></Sequence></>;
};
const Closing:React.FC=()=>{
 const f=useCurrentFrame();const pull=ramp(f,180,260);const thanksStart=Math.ceil(measured['audio/voice/09-close.mp3']*FPS);const thanks=ramp(f,thanksStart,thanksStart+35);
 return <AbsoluteFill style={{background:P}}>
  <AbsoluteFill style={{transform:`translateY(${-pull*70}px) scale(${1-pull*.035})`}}><ProductShot name="demo-05-admin-montage" title="Clear workflows. Explicit rules." detail="Membership · bookings · updates"/></AbsoluteFill>
  <AbsoluteFill style={{background:P,clipPath:`inset(0 ${(1-pull)*100}% 0 0)`}}>
   <div style={{position:'absolute',left:150,top:300,transform:`translateY(${(1-pull)*70-thanks*115}px)`}}><Wordmark size={85}/><div style={{fontFamily:'Instrument Serif',fontSize:107,lineHeight:1.08,marginTop:50}}>Share more.<br/>Create together.</div><div style={{fontSize:30,marginTop:35,color:'#6e675d'}}>Discover → reserve → keep moving.</div></div>
   <div style={{position:'absolute',right:235,top:330}}>{[S,O,C].map((c,i)=><div key={c} style={{position:'absolute',left:i*95-230,top:Math.sin(f/70+i)*14-thanks*35,width:58,height:360+thanks*60,background:c}}/>)}</div>
   <div style={{position:'absolute',left:150,top:725,opacity:thanks,transform:`translateY(${(1-thanks)*36}px)`}}><div style={{height:3,width:370,background:C,transform:`scaleX(${thanks})`,transformOrigin:'left'}}/><div style={{fontFamily:'Instrument Serif',fontSize:82,marginTop:24,letterSpacing:'-.018em'}}>Thank you for watching.</div></div>
  </AbsoluteFill>
 </AbsoluteFill>;
};
const Scene:React.FC<{scene:SceneDef}>=({scene})=>{
 const content=scene.id==='intro'?<Intro/>:scene.id==='problem'?<Problem/>:scene.id==='overview'?<Overview/>:scene.id==='workflow'?<Workflow/>:scene.id==='bridge'?<Confirmation bridge/>:scene.id==='architecture'?<Architecture/>:scene.id==='request'?<Request/>:scene.id==='deployment'?<Deployment/>:scene.id==='membership-request'||scene.id==='membership-review'||scene.id==='membership-result'?<MembershipFootage id={scene.id}/>:scene.id==='membership-record'?<MembershipRecord/>:<Closing/>;
 return content;
};
export const Explainer:React.FC=()=>{
 const frame=useCurrentFrame();const current=starts.findLastIndex(s=>frame>=s);const currentScene=scenes[Math.max(current,0)];const dark=['architecture','request','deployment'].includes(currentScene.id);
 return <AbsoluteFill style={{background:P,fontFamily:'Geist',color:I}}><style>{'* { box-sizing: border-box; }'}</style>{scenes.map((scene,i)=><Sequence key={scene.id} from={starts[i]} durationInFrames={sceneFrames[i]}><SceneTransition index={i} sceneId={scene.id}><Scene scene={scene}/></SceneTransition><Audio src={staticFile(`audio/voice/${scene.voice}.mp3`)} volume={1}/><CaptionLayer voice={scene.voice}/></Sequence>)}<div style={{position:'absolute',right:100,top:35,opacity:currentScene.id==='close'?1-ramp(frame-starts[current],180,330):.8}}><Wordmark dark={dark} size={25}/></div><div style={{position:'absolute',left:0,bottom:0,height:3,width:`${frame/(totalFrames-1)*100}%`,background:C}}/></AbsoluteFill>;
};
const SceneTransition:React.FC<{index:number;sceneId?:string;children:React.ReactNode}>=({index,sceneId,children})=>{
 const f=useCurrentFrame();const id=sceneId??scenes[index]?.id;const progress=['intro','request','deployment'].includes(id)?1:ramp(f,0,24);
 return <AbsoluteFill style={{clipPath:`inset(0 ${(1-progress)*100}% 0 0)`}}>{children}</AbsoluteFill>;
};



