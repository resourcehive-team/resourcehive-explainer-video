from pathlib import Path
import json, re, difflib, subprocess
import numpy as np
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parent.parent
model=WhisperModel('base.en',device='cpu',compute_type='int8',cpu_threads=6)
output={}; status={}; words_out={}
for path in sorted([*(root/'voiceover-text').glob('0*.txt'),*(root/'voiceover-text').glob('10.[1-4].txt')]):
    name=path.stem
    cache=root/'output'/f'{name}-words.json'
    if cache.exists(): words=json.loads(cache.read_text())
    else:
        segments,_=model.transcribe(np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(root/'public/audio/voice'/f'{name}.mp3'),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32),word_timestamps=True,beam_size=5,initial_prompt='ResourceHive, Next.js, NestJS, Caddy, Prisma, PostgreSQL, Neon, Aiven, Kafka, Linode, Vercel.')
        words=[{'text':w.word.strip(),'start':w.start,'end':w.end} for s in segments for w in s.words]
        cache.write_text(json.dumps(words,indent=2))
    exact=path.read_text(encoding='utf-8-sig').split()
    norm=lambda s: re.sub(r'[^a-z0-9]','',s.lower())
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
    for idx,word in enumerate(exact):
        if chunk and (len(' '.join(chunk+[word]))>76 or times[idx][0]-end>.65 or times[idx][1]-start>5):
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

