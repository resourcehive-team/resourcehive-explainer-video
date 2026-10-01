from pathlib import Path
import json, re, difflib, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parent.parent
model=None
def existing(name):
    path=root/'src/data'/name
    return json.loads(path.read_text()) if path.exists() else {}
output=existing('captions.json'); status=existing('caption-status.json'); words_out=existing('words.json')
for data in [output,status,words_out]: data.pop('12',None)  # Superseded by the four supplied feature tracks.
paths=sorted([*(root/'voiceover-text').glob('0*.txt'),*(root/'voiceover-text').glob('10.[1-4].txt'),*(root/'voiceover-text').glob('12.[1-4].txt')])
requested=set(sys.argv[1:])
if requested:
    unknown=requested-{p.stem for p in paths}
    if unknown: raise SystemExit(f'Unknown voice segments: {sorted(unknown)}')
    paths=[p for p in paths if p.stem in requested]
for path in paths:
    name=path.stem
    cache=root/'output'/f'{name}-words.json'
    if cache.exists(): words=json.loads(cache.read_text())
    else:
        if model is None: model=WhisperModel('base.en',device='cpu',compute_type='int8',cpu_threads=6)
        segments,_=model.transcribe(np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(root/'public/audio/voice'/f'{name}.mp3'),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32),word_timestamps=True,beam_size=5,initial_prompt='ResourceHive, Next.js, NestJS, Caddy, Prisma, PostgreSQL, Neon, Aiven, Kafka, Linode, Vercel.')
        words=[{'text':w.word.strip(),'start':w.start,'end':w.end} for s in segments for w in s.words]
        cache.write_text(json.dumps(words,indent=2))
    exact=path.read_text(encoding='utf-8-sig').split()
    norm=lambda s: re.sub(r'[^a-z0-9]','',s.lower())
    # Whisper can split compounds such as "In -app"; keep their real word boundaries.
    if name.startswith('12.'):
        exact_norm={norm(w) for w in exact}
        combined=[]
        for word in words:
            if combined and word['text'].startswith('-') and norm(combined[-1]['text']+word['text']) in exact_norm:
                combined[-1]={'text':combined[-1]['text']+word['text'],'start':combined[-1]['start'],'end':word['end']}
            else: combined.append(word)
        words=combined
    matching=difflib.SequenceMatcher(None,[norm(x) for x in exact],[norm(w['text']) for w in words],autojunk=False)
    times=[None]*len(exact)
    for block in matching.get_matching_blocks():
        for k in range(block.size): times[block.a+k]=(words[block.b+k]['start'],words[block.b+k]['end'])
    matched=sum(t is not None for t in times)
    i=0
    while i<len(times):
        if times[i] is not None: i+=1; continue
        j=i
        while j<len(times) and times[j] is None: j+=1
        start=times[i-1][1] if i else 0
        end=times[j][0] if j<len(times) else words[-1]['end']
        for k in range(i,j): times[k]=(start+(end-start)*(k-i)/(j-i),start+(end-start)*(k-i+1)/(j-i))
        i=j
    cues=[]; chunk=[]; start=0; end=0
    max_chars=60 if name.startswith('12.') else 76
    for idx,word in enumerate(exact):
        if chunk and (len(' '.join(chunk+[word]))>max_chars or times[idx][0]-end>.65 or times[idx][1]-start>5):
            cues.append({'text':' '.join(chunk),'startMs':round(start*1000),'endMs':round(end*1000),'timestampMs':None,'confidence':None});chunk=[]
        if not chunk: start=times[idx][0]
        chunk.append(word);end=times[idx][1]
        if re.search(r'[.!?]$',word) and len(' '.join(chunk))>25:
            cues.append({'text':' '.join(chunk),'startMs':round(start*1000),'endMs':round(end*1000),'timestampMs':None,'confidence':None});chunk=[]
    if chunk:cues.append({'text':' '.join(chunk),'startMs':round(start*1000),'endMs':round(end*1000),'timestampMs':None,'confidence':None})
    output[name]=cues
    words_out[name]=[{'text':w,'start':t[0],'end':t[1]} for w,t in zip(exact,times)]
    status[name]={'method':'Whisper base.en word timestamps mapped to supplied script','matched_words':matched,'total_words':len(exact)}
    print(name,status[name],flush=True)
(root/'src/data/captions.json').write_text(json.dumps(output,indent=2))
(root/'src/data/words.json').write_text(json.dumps(words_out,indent=2))
(root/'src/data/caption-status.json').write_text(json.dumps(status,indent=2))

