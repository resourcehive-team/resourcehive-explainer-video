import React from "react";
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing} from "remotion";
import {BarChart3, Bell, Boxes, Check, Scale, type LucideIcon} from "lucide-react";
import timingJson from "./data/timing.json";
import {FPS} from "./data/scenes";

const P="#f3efe7", A="#faf8f4", I="#1c1d1d", C="#c96f48";
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const ease=Easing.bezier(0.22,1,0.36,1);
const measured=timingJson as Record<string,number>;

type FeatureItem={voice:string;label:string;title:string;icon:LucideIcon;sourceHeight:number};
const featureList:FeatureItem[]=[
  {voice:"12.1",label:"Resource creation",title:"Create and publish a resource.",icon:Boxes,sourceHeight:1040},
  {voice:"12.2",label:"Analytics",title:"Monitor community usage.",icon:BarChart3,sourceHeight:1040},
  {voice:"12.3",label:"Disputes",title:"Report reservation issues.",icon:Scale,sourceHeight:1040},
  {voice:"12.4",label:"Notifications",title:"Realtime updates across the platform.",icon:Bell,sourceHeight:1080},
];

const Frame:React.FC<{name:string;sourceHeight:number;f:number}>=({name,sourceHeight,f})=>{
  // Fit the entire source between the heading and captions. No crop, trim, or speed change.
  const height=734;
  const width=height*1920/sourceHeight;
  const lastFrame=Math.max(0,Math.ceil(measured[`recordings/${name}.mp4`]*FPS)-1);
  return <div style={{
    position:"absolute",left:(1920-width)/2,top:190,width,height,background:A,
    boxShadow:"0 27px 70px #1c1d1d2a",
  }}>
    <Freeze frame={lastFrame} active={f>=lastFrame}>
      <OffthreadVideo src={staticFile(`recordings/${name}.mp4`)} muted
        style={{display:"block",width:"100%",height:"100%",objectFit:"contain"}}/>
    </Freeze>
  </div>;
};

export const FeatureShowcase:React.FC<{voice:string;recordingName:string}>=({voice,recordingName})=>{
  const f=useCurrentFrame();
  const activeIndex=featureList.findIndex(item=>item.voice===voice);
  if(activeIndex<0)throw new Error(`Unknown feature narration: ${voice}`);
  const current=featureList[activeIndex];
  const CurrentIcon=current.icon;
  const duration=Math.max(measured[`audio/voice/${voice}.mp3`],measured[`recordings/${recordingName}.mp4`])*FPS;
  const emphasis=interpolate(f,[0,24],[0,1],{...clamp,easing:ease});
  return <AbsoluteFill style={{background:P,color:I}}>
    <div style={{position:"absolute",left:105,top:92,display:"flex",alignItems:"baseline",gap:27}}>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <CurrentIcon size={34} color={C} strokeWidth={1.5}/>
        <span style={{fontSize:43,fontWeight:500,letterSpacing:"-.03em"}}>{current.title}</span>
      </div>
    </div>
    <div style={{position:"absolute",right:105,top:96,display:"flex",gap:10,alignItems:"center"}}>
      {featureList.map((item,idx)=>{
        const active=idx===activeIndex;
        const passed=idx<activeIndex;
        return <div key={item.voice} style={{
          display:"flex",alignItems:"center",gap:8,padding:"6px 14px",
          background:active?C:passed?"#e3dfd6":"transparent",
          border:`1px solid ${active?C:passed?"#c9c4b9":"#d6d0c4"}`,
          color:active?"#fff":passed?"#4a4843":"#8f8b82",
          fontSize:18,fontWeight:active?550:450,
          boxShadow:active?`0 4px 12px rgba(201,111,72,${0.19*emphasis})`:"none",
        }}>
          {passed&&<Check size={16} color="#436c4f" strokeWidth={2.2}/>}
          <span>{item.label}</span>
        </div>;
      })}
    </div>
    <Frame name={recordingName} sourceHeight={current.sourceHeight} f={f}/>
    <div style={{position:"absolute",right:82,top:202,width:4,
      height:interpolate(f,[0,duration],[0,717],clamp),background:C}}/>
  </AbsoluteFill>;
};
