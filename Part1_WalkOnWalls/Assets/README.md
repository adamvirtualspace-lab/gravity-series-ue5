# Part 1 — Art references

## `astronaut-mascot-styleframe.png`

The canonical mascot style frame. Generated on Comfy Cloud with **gpt-image-2**
(`partner_generate` → `openai/images-generations`, variant in `params.model`),
from the Appendix A art direction in
`../Scripts/Custom-Gravity-Part1-Script.md`. 1024×1536 portrait.

**This frame is on-spec — treat it as the target.**

- **Shading:** true flat vector. Solid uniform colour fills, no gradients, no
  specular, no PBR. Where a shadow exists it is a single hard-edged shape of a
  darker flat colour. This is exactly what Appendix A asks for, and what
  `MeshBasicMaterial` / 2-step toon `gradientMap` should reproduce in three.js.
- **Proportions:** realistic adult, ~7.5 heads, matching the UE5 Mannequin in
  the screen-capture footage. Not chibi.
- **Colour blocking:** large flat panels of saturated purple and teal over a
  pale off-white suit, with acid-green and magenta trim rings at wrists, elbows,
  knees and boot cuffs. The big colour areas matter — with gradients gone, a
  mostly-white suit reads as empty.
- **Silhouette:** rounded capsule limbs, smooth helmet, solid black visor (no
  face to animate).

### Two things the frame does NOT carry
1. **No bloom/glow.** Flat vector has no emissive falloff. In the mograph the
   trim colours are emissive and picked up by UnrealBloom — expect the neon to
   glow in motion in a way this still does not.
2. **Deliberately stiff.** It is a symmetrical front elevation, which makes it a
   good modelling/reference plate but not a posed hero shot. Appendix A's
   "buoyant motion" charm comes from animation, not from this pose.

Superseded earlier versions (in git history): a 4-heads chibi low-poly frame,
and a smooth-but-glossy Flux frame. Both were rejected — the first on
proportions, the second because Flux would not stop adding specular gloss.
