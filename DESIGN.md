# BioReperia · See the response

## Approved brief

Create a 30-second English brand film, 1920×1080, 30 fps. Smooth, moderately fast rhythm; one clear attractive message per scene; sparse copy and balanced typography. Use Video Shotcraft and Remotion. Music and sparse effects, without voiceover. The user approved this plan and authorized the build.

The audience is oncology researchers, drug-development partners and clinical collaborators. The narrative is tumor variability → ZTX → human tumors in zebrafish → parallel treatment testing → measured response → five-day assay results → two applications → BioReperia.

## Visual direction

Scientific cinema: deep navy specimen space, translucent volumetric anatomy, fluorescent orange tumor, warm-white editorial interludes. Poppins and the actual BioReperia wordmark. Brand colors from the official theme: navy #074470, orange #E8642C, paper #FFFDFA. Dark navy #031B2B is a deliberate cinematic extension of the brand blue. Pale blue tissue is a supporting anatomical color, not a competing brand accent.

The existing approved storyboard and verified brand system serve as the style baseline; inexpensive scene stills validate it during implementation. Hero science is original procedural illustration, not microscopy or measured patient data. The larva has a head/eye, yolk sac, elongated segmented trunk and finfold. No adult-fish morphology. No cure claims, fabricated percentages, regulatory claims, or quantitative efficacy charts.

## Motion vocabulary

Three words: fluid, precise, confident. No camera shake, rhythmic screen pumping or cartoon bounce. Main type remains in a stable screen plane for legibility; anatomical objects move in depth. This intentionally adapts Shotcraft C3 (in-world type) to the user's readability priority. The quiet final lockup intentionally adapts Q8 rather than adding a crowded multi-object finale.

Shotcraft source: Vincentwei1021/video-shotcraft. Read gallery/api/library.json, the exact cards and their demo TSX. This is a brand-specific adaptation of the movement grammar, not a pixel copy of the demo design.

| Use | Card / style | Exact source | Adaptation |
|---|---|---|---|
| Larva reveal | crane-rise-reveal | demos/opening/crane-rise-reveal/CraneRiseReveal.tsx | Shared bezier(0.2,0,0.25,1) controls zoom and focal travel; cell detail reveals the whole organism. Four-second shot retains a substantial final hold. |
| Treatment comparison | depth-layer-moves · multiplane | demos/camera/depth-layer-moves/MultiplaneReal.tsx | 0.35 / 0.7 / 1.4 depth speeds and bezier(0.45,0,0.18,1); matched scientific models replace product cards. |
| Response measurement | before-after-slider-scrub | demos/data/before-after-slider-scrub/BeforeAfterSliderScrub.tsx | Fast reveal, brief settle, slower return and final hold. Same viewpoint, synchronized clip edge. Clearly marked illustrative; no numerical outcome claim. |
| Final brand | logo-shrink-wordmark-lockup | demos/outro/logo-shrink-wordmark-lockup/LogoShrinkWordmarkLockup.tsx | Abstract circle contracts; official intact wordmark lands, then tagline. No disassembly or rotation of brand logo. |

## Timeline

Scene boundaries are exact beats on an original 120 BPM score. Transitions overlap by 10 frames, within the 900-frame final duration. Titles settle quickly and stay readable; scene movement continues independently.

| Scene | Seconds | Frames | Primary copy | Visual |
|---|---:|---:|---|---|
| Variability | 0–3 | 0–89 | Every tumor responds differently. | Macro organic tumor cluster |
| Platform | 3–7 | 90–209 | Meet ZTX®. | Specimen/lens and platform reveal |
| Hero | 7–11 | 210–329 | Human tumors in zebrafish. | Translucent larva, fluorescent xenograft |
| Parallel testing | 11–15 | 330–449 | Test therapies side by side. | Three consistent models |
| Measurement | 15–19 | 450–569 | Measure tumor response. | Same-view baseline/follow-up illustration |
| Speed | 19–23 | 570–689 | Results in five days. | Large five, precise temporal arc |
| Applications | 23–27 | 690–809 | Two applications. One platform. | ONCOLEADS / drug discovery; PREDICT / clinical decision support |
| Brand | 27–30 | 810–899 | Changing the gameplan for cancer patients. | Original logo and clean warm-white hold |

## Sound

Original 120 BPM score and effects, generated from deterministic oscillators and seeded noise. Two independently controllable stems. No third-party music, samples or voiceover. Sparse key accents at 7, 15, 19 and 27 seconds. End resolves rather than abruptly cutting.

## Scientific message sources

- https://bioreperia.com/ztx-platform/
- https://bioreperia.com/tumor-efficacy/
- https://bioreperia.com/for-clincial-providers/
- https://bioreperia.com/company/

Five days describes the advertised assay turnaround, not guaranteed patient benefit. The visual comparison is conceptual and must be labeled. Detailed brand/asset provenance is in BRAND-SOURCES.md.

## QA gates

Check every scene at entrance, settled state and exit; review transitions and text at mobile preview scale. Validate exactly 900 frames at 30 fps, deterministic animation, no missing assets, no unexpected blank frames, audio headroom, and motion/cue synchronization. Independent visual review before delivery.
