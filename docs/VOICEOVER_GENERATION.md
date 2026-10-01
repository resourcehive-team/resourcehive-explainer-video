# Voiceover generation

The nine original MP3 files and four section 10 files are supplied. Their exact text is in `NARRATION_SCRIPT.md` and `voiceover-text/`. Use the same voice and settings if a segment ever needs rerecording. Export MP3 without added music or effects. The video timeline uses the measured durations; do not time-stretch narration.

| File in `public/audio/voice/` | Approx. duration | Pronunciation check |
| --- | ---: | --- |
| `01-intro.mp3` | 15 s | ResourceHive |
| `02-problem.mp3` | 28 s | none |
| `03-overview.mp3` | 25 s | none |
| `04-product-workflow.mp3` | 80 s | timezone |
| `05-bridge.mp3` | 18 s | none |
| `06-architecture.mp3` | 80 s | NestJS, Caddy, Prisma, Neon, Aiven, Kafka |
| `07-booking-request.mp3` | 95 s | serializable, concurrency |
| `08-deployment.mp3` | 65 s | Linode, Vercel, GHCR, Prisma |
| `09-close.mp3` | 30 s | ResourceHive |
| `10.1.mp3` | 19.33 s | Engineering Faculty, Pending |
| `10.2.mp3` | 10.27 s | Engineering Faculty, Approve |
| `10.3.mp3` | 16.85 s | My memberships, Approved |
| `10.4.mp3` | 31.56 s | Resource Service, audit record |

The 01–09 values in the table are earlier estimates; the section 10 values are measured. The actual duration of every supplied file is recorded in `src/data/timing.json`. Word-aligned caption cues are in `src/data/captions.json`.
