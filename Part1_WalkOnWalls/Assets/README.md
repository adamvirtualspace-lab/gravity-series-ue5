# Part 1 — Art references

> **Two frames live here.** `astronaut-mascot-styleframe.png` is what Part 1
> currently renders and remains the reference for it.
> `astronaut-mascot-brand-styleframe.png` is the approved brand direction for
> the mascot going forward. Nothing in `Remotion/` has been changed to match the
> brand frame yet — porting it is a separate, deliberate step.

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

---

## `astronaut-mascot-brand-styleframe.png`

The **approved mascot direction**. Same tooling as above (Comfy Cloud,
**gpt-image-2**), but generated as an image edit with earlier passes fed back in
as references, so the versions interpolate rather than re-roll. 1024×1536
portrait.

Two things drove it:

1. **Channel identity.** The helmet quotes the `@AdamsVirtualSpace` YouTube
   avatar — rounded cream shell, thick orange-red rim, dark-teal visor with a
   small ringed green planet in it. The mascot and the channel now read as one
   brand.
2. **A firmer silhouette.** A slimmer waist and longer legs than the original
   frame, with light plate segmentation on the shoulders, thighs and shins and
   thin amber seam lines — enough hard-surface structure to feel deliberate,
   without becoming armour.

### What the iteration settled

The pass sequence was: colour merge → full hard-surface exosuit → **this frame
(50/50)** → 65/35 armoured → slim armoured.

The two armoured passes were built and rejected. Heavier plating made the figure
read as *equipment* rather than as a *character*, and the leanest pass made the
round helmet look oversized against the narrowed shoulders. This frame keeps the
suit legible as a suit: rounded plate shapes, the friendly dome helmet, and the
full chest-panel / strap / buckle kit intact.

**The mascot stays a mascot.** That is the constraint any future pass has to
clear — added detail must not cost the character read. Note that the arms here
are deliberately smooth; the armoured passes segmented them, and that is
available in git history if the direction is ever revisited.

### Measured palette

Sampled from the PNG (octree-quantised), not from the prompt:

```
#00011a   77.8%   background — near-black space
#330ca5   10.1%   suit primary — deep violet
#1c0670    2.9%   suit shadow — deepest violet
#8243e7    2.3%   highlight panels — periwinkle
#ea4a18    1.9%   chest panel + straps — orange-red   ★ channel accent
#7336de    1.3%   suit mid violet
#07a1ef    0.9%   hoses, wrist + knee bands — sky blue
#f9e8d1    0.8%   helmet shell — cream
#f8a90c    0.5%   buckles + seam lines — amber
#76b03b    0.2%   visor planet — lime green
#0bd7ea    0.1%   visor planet ring — teal
```

### ⚠️ Why the limb accents are amber, not cyan

An intermediate pass ran bright `#32b1f9` emissive strips down both arms and
shins. That colour sits essentially on top of `axis.right` (`#38bdf8`) in
`Remotion/src/theme.ts`, which is **functional signal** — the viewer reads yaw
off it. As a small quote inside the visor that is fine; running the length of
every limb it competes directly with the explainer's arrows.

The seam lines were moved to amber for that reason. Amber, orange-red and
cream collide with no axis colour, which is exactly why the channel's warm pair
was the half of the avatar allowed onto the body. **The avatar's teal and lime
stay confined to the visor emblem** — they are the nearest neighbours to
`axis.right` and `axis.forward` and must not become large fields.

This is the same caution as deviation 2 above, and it survived contact with a
real frame: the warm accents are safe, the cool ones are spoken for.

### Not yet carried into code

`Remotion/src/components/Astronaut.tsx` and the `palette` tokens in
`Remotion/src/theme.ts` still describe the original amber-visor suit. Porting
this frame means adding the channel tokens and rebuilding the helmet, and is
tracked separately from Part 1's current render.
