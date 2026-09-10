# Gravity Series — Motion Graphics

Remotion + three.js explainer animations for the UE5 Gravity Series.
Kurzgesagt-inspired: **smooth 3D geometry, flat vector-look shading.**

Art direction and beat sheet live in
`../Part1_WalkOnWalls/Scripts/Custom-Gravity-Part1-Script.md` (Appendices A–C).
Progress and open decisions: `../Part1_WalkOnWalls/PROGRESS.md`.

## Quick start

```bash
npm install
npm run studio          # live preview
```

## Render

```bash
npm run render          # MP4
npm run render:prores   # ProRes for the edit
npm run render:png      # transparent PNG sequence to overlay on UE capture
npm run typecheck
```

Output lands in `out/`, which is git-ignored.

## ⚠️ Rendering in a cloud session

Remotion downloads its own Chrome Headless Shell from `remotion.media` on first
render. **That host is blocked by the cloud sandbox's egress policy**, so the
download 403s. Point Remotion at the Chromium that is already installed instead:

```bash
npx remotion still ThreeAxisExplainer out/frame.png --frame=120 \
  --gl=swangle \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

`--gl=swangle` (software ANGLE) is needed on a headless box with no GPU.
**Neither flag is necessary locally** — Remotion downloads its own browser and
`angle` works when there is a real GPU.

## Structure

```
src/
├─ Root.tsx                 registers compositions (Parts 2/3 = a prop change)
├─ ThreeAxisExplainer.tsx   the 30s flagship, 9 beats
├─ theme.ts                 palette, beat sheet, toon-gradient helper
├─ Scene3D.tsx              canvas + lights + Bloom/Vignette
└─ components/
   ├─ AxisGizmo.tsx         ★ the reusable heart — builds a basis from gravity
   ├─ Arrow3D.tsx           smooth arrow, flat emissive fill
   ├─ Astronaut.tsx         the mascot (rough blockout — needs sculpting)
   ├─ CameraProp.tsx        the orbiting camera object
   ├─ SpaceBackdrop.tsx     deterministic starfield + radial glow
   └─ Caption.tsx           bold white lower-third
```

## The one idea worth understanding

`AxisGizmo` builds an **orthonormal basis from the gravity direction** — up comes
from gravity, then right and forward are rebuilt to match. That is the same move
as Unreal's *Make Rotation From Axes*, and it is the trick the whole tutorial
series turns on. Parts 1–3 differ only by the `mode` prop
(`flat` → `sphere` → `multi`), not by a rewrite.

## Why the shading looks the way it does

`meshToonMaterial` with a **2-step `gradientMap`** collapses lighting to one hard
terminator — smooth geometry that reads as flat vector art. Pure fills that
should ignore lighting entirely use `meshBasicMaterial` with `toneMapped={false}`
so Bloom can pick them up. **Do not switch these to `meshStandardMaterial`** —
PBR falloff reintroduces exactly the soft "realistic render" look the art
direction rejects.

## Version pins (deliberate — do not bump casually)

- `@react-three/fiber` is pinned to the **v8** line. v9 pulls the Expo /
  React-Native stack through optional peers and fails to resolve.
- `@types/react` is pinned to **v18** to match React 18. The v19 types move JSX
  under `React.JSX`, which breaks R3F v8's global JSX augmentation and makes
  every `<mesh>` a type error.
- `src/r3f-types.d.ts` exists solely to pull that augmentation into the project.
