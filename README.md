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

```
ue5-gravity-series/
├─ scripts/        Production scripts + storyboards (.md), one per part
├─ remotion/       Motion graphics — Kurzgesagt-inspired, rendered 3D low-poly
├─ assets/         Shared style frames & small art refs (no video renders)
└─ README.md
```

## Motion graphics (Remotion)

Explainer animations built with [Remotion](https://www.remotion.dev/) + `@remotion/three` (react-three-fiber), styled as **3D low-poly** with a deep-space palette and soft bloom. The `AxisGizmo` component is prop-driven so Parts 1–3 reuse it (flat surface → sphere → multi-planet).

```bash
cd remotion
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

Renders land in `remotion/out/` and are **git-ignored** — video files stay out of the repo.

## Stack

- Unreal Engine 5 (Blueprints only) — the tutorial subject
- Remotion + Three.js / react-three-fiber — motion graphics
- `@react-three/drei`, `@react-three/postprocessing` — helpers + bloom

## Working in the cloud

The `remotion/` project is plain Node + TypeScript, so it runs cleanly in a Claude Code cloud session — install, iterate, and render on the VM, then pull the result down. Push your branch first; cloud sessions clone from the GitHub remote, not your local checkout.

## License

_TBD — e.g. MIT for the code; keep footage/audio rights separate._
