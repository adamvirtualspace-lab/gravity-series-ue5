# Part 1 — Art references

## `astronaut-mascot-styleframe.png`

The canonical mascot style frame. Generated on Comfy Cloud with **gpt-image-2**
(`partner_generate` → `openai/images-generations`, variant in `params.model`),
from the Appendix A art direction in
`../Scripts/Custom-Gravity-Part1-Script.md`. 1024×1536 portrait.

**This frame is on-spec — treat it as the target.**

- **Shading:** true flat vector. Solid uniform colour fills, no gradients, no
  specular, no PBR. Shadows are single hard-edged shapes of a darker flat
  colour. This is what `MeshBasicMaterial` / a 2-step toon `gradientMap` should
  reproduce in three.js.
- **Proportions:** realistic adult, ~7.5 heads, matching the UE5 Mannequin in
  the screen-capture footage. Not chibi.
- **Silhouette:** rounded capsule limbs, smooth helmet, warm amber visor with no
  face to animate.

### Measured palette

Sampled directly from the PNG (octree-quantised), not from the prompt:

```
#00000e   68.5%   background — near-black space
#5b1dd9   12.5%   suit primary — deep violet
#9165f7    4.6%   suit secondary — periwinkle panels
#3611a1    3.1%   suit shadow — dark violet (hard-edged)
#4417b1    2.8%   suit mid violet
#fca602    1.7%   visor — amber   ★ hero accent
#a98cf9    1.6%   light lavender panels
#7845e9    1.3%   violet highlight
#dfd5f9    1.1%   helmet shell — lavender-white
#f55504    0.8%   red-orange — straps/connectors
#1d0961    0.8%   deepest violet shadow
#32b1f9    0.8%   cyan — hose clips, detail lines
#fcc403    0.4%   golden yellow — buckles
```

### ⚠️ Two deliberate deviations from the Appendix A tokens

1. **Background is near-black `#00000e`, not the spec's navy `#0b0d2a`.** The
   near-black gives the saturated violet more separation. Decide which wins
   before `theme.ts` is written — the frame and the appendix currently disagree.
2. **The suit occupies violet.** Appendix A assigns `#a855f7` purple as an
   *accent* and `#e935c1` magenta to the **gravity axis**. Violet suit and
   magenta gravity arrow are close neighbours on the wheel. The suit was kept
   deliberately deep (`#5b1dd9`) so hot magenta still pops against it, but watch
   this in the first animated test — the axis colours must read as *signal*, and
   the mascot must not compete with them. The warm accents (amber, red-orange,
   yellow) are safe: they collide with no axis colour.

### Two things the frame does NOT carry
1. **No bloom/glow.** Flat vector has no emissive falloff. In the mograph the
   trim and visor are emissive and picked up by UnrealBloom — expect the neon to
   glow in motion in a way this still does not.
2. **Deliberately stiff.** A symmetrical front elevation: a good modelling and
   reference plate, not a posed hero shot. The "buoyant" charm comes from
   animation.

Superseded versions are in git history: a 4-heads chibi low-poly frame, a
smooth-but-glossy Flux frame, and a white-suited flat-vector frame.
