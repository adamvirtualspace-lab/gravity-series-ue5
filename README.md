# UE5 Gravity Series

Production companion for the **AdamTechTips** tutorial series on relative gravity direction in Unreal Engine 5 — everything is **100% Blueprints, no C++**. This repo holds the **video scripts** and the **motion-graphics source** for the series. (The Unreal project itself lives outside this repo — binary `.uasset` files don't belong in Git.)

## The series

| Part | Video | Status |
|------|-------|--------|
| 1 | Custom Gravity — walk on any surface | ▶ _link_ |
| 2 | Planet Gravity — walk on a sphere | ▶ _link_ |
| 3 | Multiple Planet Gravity | ▶ _link_ |

The core trick, in one line: **three pivots for three axes** (up · yaw · pitch), **Absolute Rotation** to keep "up" world-locked, and **Make Rotation From Axes** to rebuild the camera frame whenever gravity changes.

## What's in here

One folder per part. Each part owns its script and its own art refs; the Remotion
project is shared across the series so components (`AxisGizmo`) get reused.

```
gravity-series-ue5/
├─ Part1_WalkOnWalls/
│  └─ Scripts/       Production script + storyboard (.md)
├─ Part2_PlanetGravity/       (planned)
├─ Part3_MultiPlanet/         (planned)
├─ Remotion/         Motion graphics — Kurzgesagt-inspired, smooth 3D, flat vector-look shading (planned)
└─ README.md
```

**Current state:** the Part 1 script is written. The Remotion project isn't
scaffolded yet — its full structure, `AxisGizmo` prop contract, and beat sheet
are specified in Appendices A–C of the Part 1 script, which is the spec to build from.

## Motion graphics (Remotion)

Explainer animations built with [Remotion](https://www.remotion.dev/) + `@remotion/three` (react-three-fiber), styled as **smooth 3D with flat vector-look shading** with a deep-space palette and soft bloom. The `AxisGizmo` component is prop-driven so Parts 1–3 reuse it (flat surface → sphere → multi-planet).

Not scaffolded yet — the commands below are the intended workflow once `Remotion/` exists.

```bash
cd Remotion
npm install
npm run studio        # live preview
```

Render:

```bash
# final MP4
npx remotion render ThreeAxisExplainer out/part1-axes.mp4

# ProRes for editing
npx remotion render ThreeAxisExplainer out/part1-axes.mov --codec=prores

# transparent PNG sequence (overlay on UE capture)
npx remotion render ThreeAxisExplainer out/part1/ --image-format=png --codec=png
```

Renders land in `Remotion/out/` and are **git-ignored** — video files stay out of the repo.

## Stack

- Unreal Engine 5 (Blueprints only) — the tutorial subject
- Remotion + Three.js / react-three-fiber — motion graphics
- `@react-three/drei`, `@react-three/postprocessing` — helpers + bloom

## Working in the cloud

The `Remotion/` project is plain Node + TypeScript, so it runs cleanly in a Claude Code cloud session — install, iterate, and render on the VM, then pull the result down. Push your branch first; cloud sessions clone from the GitHub remote, not your local checkout.

## License

Code and scripts in this repo are [MIT licensed](LICENSE). Rendered video, footage,
and audio for the series are **not** covered by that license — those rights are held separately.
