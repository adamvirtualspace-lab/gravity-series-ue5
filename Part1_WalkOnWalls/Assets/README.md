# Part 1 — Art references

## `astronaut-mascot-styleframe.png`

The series mascot style frame, generated on Comfy Cloud (Flux 2 Pro) from the
Appendix A art direction in `../Scripts/Custom-Gravity-Part1-Script.md`.

**Read it for:** proportion, silhouette, palette, and neon-trim placement.

- Proportions are **realistic adult, ~7 heads tall** — deliberately matching the
  UE5 Mannequin in the screen-capture footage. An earlier 4-heads-tall chibi
  version was rejected: a mascot that reads as a different character from the
  one on screen defeats the purpose of the insert.
- Geometry is **smooth** — capsule limbs, spherical helmet, no facets.

> ⚠️ **Do not copy its shading.** The frame still carries soft PBR gradients and
> a specular highlight on the visor. Appendix A calls for **flat vector-look
> shading** — `MeshBasicMaterial`, or `MeshToonMaterial` with a 2-step
> `gradientMap`, and no specular. Diffusion models are heavily biased toward
> glossy 3D renders and resist flat shading, so this was not worth more
> generations to chase: the flat look is applied precisely in three.js, where we
> control the material directly.

This is a **reference**, not a production asset — the mograph builds the
astronaut from three.js geometry.

Pose is a relaxed A-pose, which also makes it a usable plate if the mascot is
ever converted to a mesh (e.g. via the `api_tripo_multiview_to_model` workflow).
