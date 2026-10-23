# BioReperia · See the response

A 30-second English brand film built with Remotion, React Three Fiber and movement patterns adapted from [Video Shotcraft](https://github.com/Vincentwei1021/video-shotcraft). The composition is **1920 × 1080, 30 fps, 900 frames**. Eight scenes connect tumor variability, the ZTX® platform, zebrafish xenografts, parallel testing, response measurement, five-day results, the platform's two applications, and BioReperia's identity.

The cells, larva and treatment comparison are **original scientific illustrations**, not microscopy footage, patient data or measured treatment outcomes. “Results in five days” refers to the assay turnaround described by BioReperia. No voiceover is included.

## Repository, preview and export

This repository contains the editable film source, audio stems, brand assets, and build instructions. The rendered MP4s and per-frame QA assets are distributed separately, rather than committed to Git. The original delivery includes:

- `out/BioReperia-30s.mp4` — full film with music and sound effects.
- `out/BioReperia-30s-no-music.mp4` — the same picture with sound effects only.
- `out/QA-REPORT.md` — verification results and remaining limitations.

To edit the source on a Mac, install Node.js 24 or newer, clone this repository, and run:

```sh
git clone https://github.com/jucheng279/BioreperiaVideo.git
cd BioreperiaVideo
npm ci
npm run dev
```

For local preview, open the Studio URL printed by Remotion and select **BioReperia-30s**. The eight scenes are also registered individually in the **Scenes** folder. The interactive browser preview was inaccessible in the build environment, so this local preview workflow was not visually verified there; the rendered MP4 is the delivered master.

Render the full film:

```sh
npx remotion render src/index.ts BioReperia-30s out/BioReperia-30s.mp4
```

Render without background music while retaining sound effects:

```sh
npx remotion render src/index.ts BioReperia-30s out/BioReperia-30s-no-music.mp4 --props='{"bgm":false,"sfx":true}'
```

The first export may download Remotion's browser. Remotion's [license terms](https://www.remotion.dev/license) apply to commercial use.

## Editing

- `src/design.ts` holds brand colors, easing and the shared `SHOTS` timing/copy table.
- `src/Film.tsx` assembles the scenes and independently switches music and SFX.
- `src/scenes/` contains eight self-contained scenes; the larva geometry is in `src/biology/`.
- `src/workbench.ts` is an optional Shotcraft integration manifest that exposes the same scene components and timings. Editable headline controls are declared only where a scene actually consumes a `title` prop. Platform, speed and application copy remains authored within those scenes.
- The adjacent scene windows overlap by ten frames. Each scene owns its entrance fade, so the Workbench manifest intentionally adds no separate transition layer. The final logo holds without an exit fade.

## Sound and provenance

`public/audio/bioreperia-music.wav` and `bioreperia-sfx.wav` are separate, already balanced 30-second stems. They start at frame zero at volume 1. The original 120 BPM score and sound effects were generated using deterministic oscillators and seeded noise; no third-party music, samples or voice recordings are used. See `public/audio/PROVENANCE.md` for the cue sheet and audio details.

The official logo and local Poppins fonts retain the company's visual identity. `BRAND-SOURCES.md` records the website sources and distinguishes scientific reference imagery from the film's original illustration. `NOTICE.md` identifies the source credits and included license files. `DESIGN.md` records the creative decisions and planned review gates; the original delivery's QA report is available separately with its rendered exports.

## Shotcraft references

These movements adapt the recipes and source examples to BioReperia's brand and the film's restrained pace:

| Film moment | Shotcraft card / style | Adaptation |
|---|---|---|
| Larva reveal | `crane-rise-reveal` | A coordinated camera retreat and focal shift exposes the whole organism. |
| Parallel treatments | `depth-layer-moves` / `multiplane` | Depth-dependent travel places three matched experimental models in one spatial composition. |
| Response comparison | `before-after-slider-scrub` | A synchronized reveal compares the same illustrative viewpoint. |
| Brand ending | `logo-shrink-wordmark-lockup` | A contracting circular motif resolves into the intact official wordmark. |

Exact demo paths and timing adaptations are recorded in `DESIGN.md`. The optional Shotcraft Workbench runtime is separate from this Remotion project. It was not launched or tested, and no Workbench parity comparison was performed. Its Remotion versions and additional packages must be aligned with this project's dependencies before attempting that integration. Workbench is not required to edit the source or render the delivered master with the commands above.
