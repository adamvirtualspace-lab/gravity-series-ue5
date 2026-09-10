# Part 1 — Walk on Walls · Progress & Handoff

_Last updated: 2026-09-09. Branch: `claude/session-0ufx5s`._

This file exists so work can resume in a **fresh session (local or cloud)** without
re-deriving decisions. Read it top to bottom before touching anything.

---

## TL;DR — where we are

| Area | State |
|---|---|
| Part 1 script | ✅ Written (347 lines), chapters + chunks + checkpoints |
| Art direction (Appendix A) | ✅ Settled — smooth 3D, flat vector-look shading |
| Mascot style frame | ✅ Final — `Assets/astronaut-mascot-styleframe.png` |
| Storyboard frames | ✅ 3× 16:9 third-person beats in `Assets/storyboard/` |
| `Remotion/` project | ✅ Scaffolded, typechecks, **renders real frames** |
| Mograph beats 1–4 | ✅ Animated · beats 5–9 static states, TODO |
| Brand mascot | ✅ Ported into `theme.ts` + `Astronaut.tsx`; storyboards regenerated |
| Part 2 / Part 3 | ⬜ Not started |

---

## Art direction — settled decisions (do not re-litigate)

These were each decided deliberately. The reasoning matters more than the conclusion.

1. **Smooth 3D geometry, flat vector-look shading.** Not faceted low-poly.
   - Hard edges force vertex splitting (a cube needs 24 verts, not 8), so facets
     cost more — and, more importantly, Kurzgesagt is smooth, not faceted.
   - Geometry stays *genuinely 3D* so the flagship "Three Axes" piece can **show**
     that one axis can't lock an orientation. Only the *shading* reads as 2D.
   - Implement with `MeshBasicMaterial`, or `MeshToonMaterial` + a 2-step
     `gradientMap`. **No specular, no roughness falloff** — a standard PBR
     material with smooth normals produces the soft "realistic render" look we
     explicitly rejected.

2. **Mascot proportions: realistic adult, ~7.5 heads.** Not chibi.
   - It must read as the **same body as the UE5 Mannequin** in the screen capture.
     A 4-heads mascot looks like a different character and defeats the insert.

3. **Violet suit, not white.** Once gradients are gone, a white suit reads empty.
   Large saturated colour blocks are where the Kurzgesagt charm actually lives.

4. **The mascot carries channel identity.** The helmet quotes the
   `@AdamsVirtualSpace` avatar — cream dome, thick orange-red rim, dark visor
   with a small ringed green planet. Reference:
   `Assets/astronaut-mascot-brand-styleframe.png`.

5. **Only the channel's WARM half goes on the body.** Cream, orange-red and
   amber collide with no axis colour. Teal and lime are the nearest neighbours
   to `axis.right` and `axis.forward` — functional signal — so they stay inside
   the visor emblem and must never become large fields. An intermediate design
   ran `#32b1f9` strips down every limb and competed directly with the
   explainer's arrows. Sky-blue wrist/knee rings are a bounded exception.

---

## Measured palette

Sampled from `Assets/astronaut-mascot-styleframe.png` (octree-quantised) — these
are **measured, not prompted**, so they are the real values.

```
#00000e   background — near-black space
#5b1dd9   suit primary — deep violet
#9165f7   suit secondary — periwinkle panels
#3611a1   suit shadow — dark violet (hard-edged)
#fca602   visor — amber            ★ hero accent
#dfd5f9   helmet shell — lavender-white
#f55504   red-orange — straps/connectors
#32b1f9   cyan — hose clips, detail lines
#fcc403   golden yellow — buckles
```

Axis colours from Appendix A (these are **functional signal**, not decoration):

```
UP / gravity axis   #ffffff   white
yaw / left-right    #38bdf8   neon blue
pitch / up-down     #4ade80   neon green
gravity vector      #e935c1   hot magenta
```

---

## ⚠️ Two OPEN decisions (blocking `theme.ts`)

1. ~~**Background: near-black or navy?**~~ **SETTLED — near-black `#00011a`.**
   Both brand frames landed there and it gives the violet more separation.
   `palette.bgNavy` is kept in `theme.ts` for reference only.

2. **Violet suit vs magenta gravity arrow.** (still open)
   The suit occupies violet; magenta is reserved for the gravity axis. They are
   neighbours on the colour wheel. The suit was kept deliberately deep
   (`#5b1dd9`) so hot magenta still pops — **but this must be verified in the
   first animated test.** If the mascot competes with the axis colours, the
   explainer gets muddier. The warm accents (amber, red-orange, yellow) are safe:
   they collide with no axis colour.

---

## Remotion project status

`Remotion/` — **scaffolded and verified.** `npm run typecheck` passes with zero
errors, and a real frame renders (see `Remotion/README.md`).

Beats 1–4 (the core argument) are animated. Beats 5–9 render correct static
states and are marked TODO — Appendix C's build order says confirm the argument
reads before building the rest.

### ⚠️ Two install pitfalls (both already hit and solved — don't repeat them)

1. **Do not name the package `remotion`.** npm refuses to install a dependency
   with the same name as the containing package. `package.json` is named
   `gravity-series-mograph`.
2. **Pin `@react-three/fiber` to the v8 line.** Unpinned it resolves to v9,
   whose optional peers drag in the entire Expo / React-Native stack — wrong tree
   for a web render, and the install fails to resolve.

### Known-good install

```bash
cd Remotion
npm i react@^18.3.1 react-dom@^18.3.1 remotion @remotion/cli @remotion/three \
      three@^0.169.0 "@react-three/fiber@^8.17.10" "@react-three/drei@^9.114.0" \
      "@react-three/postprocessing@^2.16.3"
npm i -D typescript @types/react @types/react-dom @types/three
```

Resolved clean: 326 packages, 0 vulnerabilities, Remotion `4.0.523`.

### ⚠️ Rendering in a CLOUD session

Remotion downloads its own Chrome Headless Shell from `remotion.media` on first
render. **That host is blocked by the cloud sandbox egress policy** (403). Use
the Chromium already installed in the image:

```bash
npx remotion still ThreeAxisExplainer out/frame.png --frame=120 \
  --gl=swangle \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

`--gl=swangle` is software ANGLE, needed on a headless box with no GPU.
**Neither flag is needed LOCALLY** — Remotion fetches its own browser and `angle`
works with a real GPU. This is the main reason a local session may be smoother.

### Two more pinning gotchas (already solved)

3. **Pin `@types/react` to v18** to match React 18. The v19 types move JSX under
   `React.JSX`, breaking `@react-three/fiber` v8's global JSX augmentation —
   every `<mesh>` becomes a type error.
4. **`src/r3f-types.d.ts`** exists only to side-effect-import
   `@react-three/fiber`, pulling that JSX augmentation into the whole project.
   Without it, files that import only `three` fail to typecheck.

### Render settings (Appendix C)

`fps 30 · 900 frames (30s) · 1920×1080`

### Build order (from Appendix C — follow it, each step is testable)

1. `theme.ts` + `Scene3D` (canvas, rim light, bloom) — get one glowing frame.
2. `Arrow3D` → `AxisGizmo` (static) — the reusable heart, smooth + emissive.
3. `SpaceBackdrop` + `Astronaut` + `CameraProp`.
4. Beats 1–4 (the core argument) — confirm it reads before building the rest.
5. Beats 5–9, then `Caption` pass + timing to the VO.
6. Wire Part 2/3 in `Root.tsx` via props (later).

### The reusable core

`AxisGizmo` is the component Parts 1–3 all share — flat wall → sphere → multi-planet
is a **prop change**, not a rewrite:

```ts
type AxisGizmoProps = {
  mode: 'flat' | 'sphere' | 'multi';      // Part 1 · Part 2 · Part 3
  gravityDir: [number, number, number];   // [0,0,-1] → [0,-1,0]
  show: { up?: boolean; right?: boolean; forward?: boolean };
  highlight?: 'up' | 'right' | 'forward' | null;
  chaos?: boolean;                         // beat 6
};
```

---

## Image generation — how to reproduce

Via the **Comfy Cloud** MCP connector (`comfy`). Not built into Claude — it is a
custom connector added at `https://cloud.comfy.org/mcp`.

**Use gpt-image-2, not Flux.** Flux repeatedly added specular gloss and PBR
gradients despite explicit negative prompting, and ignored aspect-ratio requests
(locked to 4:3). gpt-image-2 follows style instructions literally and respects size.

```js
partner_generate({
  type: "image",
  model: "openai/images-generations",   // ← the registered slug
  params: { model: "gpt-image-2",       // ← variant goes HERE, not top-level
            size: "1536x1024",          // 16:9 · use 1024x1536 for portrait
            quality: "high" },
  prompt: "…"
})
```

Passing `gpt-image-2` as the top-level `model` bounces as "unknown model".

For 2+ images use `submit_batch` once rather than N separate calls.

**Note:** this container is egress-blocked from `cloud.comfy.org` (403), so the
`/api/s/…` download links can't be fetched from inside a cloud session. The
`storage.googleapis.com` `inline_url` (request `inline_urls: true`) **is**
reachable — use that to pull generated images into the repo.

---

## Next steps

1. **Refine `Astronaut.tsx` further.** It now carries the brand design and the
   right proportions, but it is still primitive-assembled — the torso reads
   bulky against the slim-waist reference, and the plate panels are floating
   capsules rather than shaped shells.
2. Resolve the remaining colour decision (violet suit vs magenta gravity arrow)
   in the first animated test. **Background is settled: near-black `#00011a`.**
3. Animate beats 5–9.
4. Time captions to the VO.
5. Wire Parts 2/3 in `Root.tsx` via the `mode` prop.

## Repo notes

- `.gitignore` was previously named `gitignore` and therefore inactive —
  `node_modules/` and video renders were never actually being ignored. Fixed.
- `.claude/commands/` holds 13 vendored MIT files from
  [Comfy-Org/comfy-skills](https://github.com/Comfy-Org/comfy-skills) @ `d50722a`
  (the `/plugin` install route is unavailable in cloud sessions). One of them is
  a `rickroll` command — safe to delete.
