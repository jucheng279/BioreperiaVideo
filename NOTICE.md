# Credits and licenses

## Video Shotcraft

Motion recipes and example timing were adapted from **Video Shotcraft**, by Wei Yihao, repository [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft), inspected at commit `43bd349a136651865ecfa6ea1cf012f6e957d304`.

Copyright 2026 Wei Yihao. Shotcraft code and documentation are licensed under Apache License 2.0. The complete upstream license is included at `third-party/SHOTCRAFT-APACHE-2.0.txt`.

The adapted references are `crane-rise-reveal`, `depth-layer-moves` / `multiplane`, `before-after-slider-scrub`, and `logo-shrink-wordmark-lockup`. This project changes their subject, scene structure, styling, timing, camera framing and assets for the BioReperia film. Exact example paths and adaptations are listed in `DESIGN.md`. No Shotcraft stock audio is used.

## Poppins

Copyright 2020 The Poppins Project Authors ([itfoundry/Poppins](https://github.com/itfoundry/Poppins)). The included Poppins Light, Regular, Medium and Bold font files are distributed under the SIL Open Font License 1.1. The complete license is included at `third-party/POPPINS-OFL.txt`. The unmodified WOFF2 files were obtained from BioReperia's public theme; source URLs are in `BRAND-SOURCES.md`.

## BioReperia brand assets

The intact official BioReperia wordmark in `public/brand/bioreperia-logo.png`, the ZTX® platform names and the final company slogan are attributed to BioReperia. Logo source: https://bioreperia.com/wp-content/themes/fse-theme/images/logo/bioreperia_logo_2022.png. The company website supplied the palette, product descriptions and brand context. These brand assets are separate from the Shotcraft and font licenses.

## Original material created for this project

The procedural cells, zebrafish geometry, scientific scene construction, layout and animation were authored specifically for this film with AI-assisted code. They are illustrations, not measured experimental data or scientific photographs. Website microscopy and workflow images were inspected as references and are not used in the rendered scenes.

The original music and sound effects were procedurally composed for this film from mathematical oscillators and seeded noise. They contain no sampled songs, stock music, recordings or third-party sound effects. The source generator, beat metadata and audio provenance are included in `public/audio/`.

## Runtime dependencies

Remotion, React, React Three Fiber, Three.js and the other packages retain their respective licenses. Versions are recorded in `package-lock.json`; package license files are available after `npm ci`. Remotion's current licensing information is at https://www.remotion.dev/license. This notice does not apply the Shotcraft Apache license to unrelated brand assets or runtime packages.
