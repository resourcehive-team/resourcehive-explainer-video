# Voiceover generation

Generate nine MP3 files from the **exact text** in `NARRATION_SCRIPT.md`, one numbered section per file. Use one ElevenLabs stock voice with unchanged model, stability, similarity and style settings. Export MP3 without added music or effects. Keep a natural brief pause at the beginning and end of each file; the video timeline will use actual measured durations.

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

These are estimates. Do not time-stretch narration to fit them. If ElevenLabs offers timing/alignment JSON, save the matching file beside each MP3 with the same stem and `.json` extension.
