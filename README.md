# ResourceHive explainer video

Current motion-design draft: `output/draft-v3.mp4` (`draft-v2.mp4` retained for comparison). 1920×1080, 30 fps, H.264, narration only. Original source recordings are used directly. There is no final file-size target.

- `pnpm run studio` — Remotion Studio (no automatic browser opening)
- `pnpm run typecheck` — check the TypeScript composition
- `pnpm run render:draft` — render PNG frames to H.264 and normalize narration without reencoding the video stream
- `pnpm run verify` — inspect dimensions, codecs, duration and audio presence
- `python scripts/align-captions.py` — rebuild actual-audio caption timing (requires faster-whisper + numpy; downloads a local base.en model once)

Design and motion contract: DESIGN.md. Product/architecture evidence: docs/IMPLEMENTATION_AUDIT.md. Section 10 uses the three supplied membership recordings, four supplied voice files, and the matching `voiceover-text/10.1.txt` through `10.4.txt` scripts, immediately before the closing narration. The complete script is in docs/NARRATION_SCRIPT.md.

Captions retain the supplied script and use recognized audio timestamps. The match statistics are in src/data/caption-status.json. Unrecognized terms interpolate between neighboring word timestamps. No remote transcription or voice generation is used.

The legacy compression script is retained for optional future use, but the default export does not invoke it.
