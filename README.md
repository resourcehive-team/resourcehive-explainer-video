# ResourceHive explainer video

This is a code-generated Remotion project for an academic ResourceHive implementation video. The factual story is in `docs/IMPLEMENTATION_AUDIT.md`; the exact recordings and voice files are specified in `docs/CAPTURE_GUIDE.md` and `docs/VOICEOVER_GENERATION.md`.

## Current state

The scene and audio timeline, architecture diagrams, media placeholders, asset validator, duration measurement, caption cue generator, render, compression, and structural QA scripts are scaffolded. Narration MP3s and real UI recordings have not been supplied. `render:preview` is a development preview with visibly marked missing assets. It is not a submission video. Caption cues use ElevenLabs character alignment JSON when supplied; otherwise they are estimated from the exact script and measured audio duration and require visual synchronization review.

## Commands

```text
pnpm install
pnpm run export-voice-text
pnpm run check-assets
pnpm run studio
pnpm run render:preview
pnpm run submission
```

`npm run submission` blocks on missing required files, measures actual media durations, renders `output/master.mp4`, compresses `output/submission.mp4` near the file-size target, and writes `output/QA_REPORT.md`. FFmpeg and FFprobe must be available on PATH. Review the final output visually and listen to the mix before submitting.

The current timeline is provisional: after recording, clip trim points, caption alignment, visual pacing, and music ducking must be tuned to the real media. The source files stay in this folder; no editor project is required.
