# Illustrated world rendering standard

Vero’s approved trial direction, 2026-09-26. Supersedes the geometric room as the visual benchmark. Applies to the illustrated vignette and any later approved scene migration.

## Visual target
Richly illustrated digital painting assembled as a 2.5D scene, with Vero and NPCs remaining 2D illustrated sprites. The still environment must work as game artwork before characters or UI are visible. Technical depth alone is not visual acceptance.

## Scenery and camera
- Look into the scene from a lower elevated three-quarter camera; show desk tops, vertical faces and object sides.
- Let overlap, architecture, scale, floor material and atmosphere establish perspective. Do not display a trapezoid floor perimeter or floating test slab.
- Use dimensional painted objects: rim, bevel, side thickness, seams, irregular silhouettes, material variation and internal shading.
- Never replace missing scenery with icon-like geometry. Mark it as an illustrated asset dependency and show a truthful loading/error state.
- Keep the vignette small and coherent: window/skyline, one cubicle, desk/monitor, separate chair, one foreground plant, Vero and a short walkable aisle.

## Color, light and material
- Use rich local variation within each material, not one flat UI color per object.
- Warm back-left sunlight, cool blue/lavender fill and shaded faces, restrained monitor glow and atmospheric distance.
- Painted carpet fibers/pattern, cubicle textile grain/seams, desk edging, metal highlights, leaf veins/varied greens and subtle wall grain.
- Preserve illustrated edge variation; no procedural line/noise treatment as a substitute for the artwork.
- Shared light direction must be visible in the artwork itself. Do not use a global filter to disguise mismatched assets.
- Ground objects with tight contacts, colored directional casts that soften outward, and ambient darkening under furniture/in corners. Avoid independent generic gray polygon shadows.

## Integration
- Keep illustrated pieces separate and unchanged by code except necessary projection, cropping from documented transparent bounds, scaling and compositing.
- World footprints control collision and sorting. Vero must be able to pass visibly behind partition/plant and in front of the desk.
- Use subtle depth scaling and restrained parallax; system reduced motion freezes camera shifts.
- Ensure ground-contact anchors match feet, legs, wheels and pot bottoms. Avoid excess transparent padding shifting objects off their contact points.

## Review gate
1. Independent reviewer inspects source images, transparency, light/camera compatibility and material fidelity before integration.
2. Capture the composed environment with Vero/UI hidden. A diagram, vector scene, geometric prototype or visibly mismatched sticker collection fails.
3. Inspect desktop/mobile composition and freeze several character positions. Check overlap, scale, shadows and grounding.
4. Test movement, touch/keyboard, collision, reduced motion, load failure and exit independently from the visual judgment.
5. Vero decides whether the result matches her intended style. Reviewer PASS is permission to show the trial, not approval to migrate the portfolio.

GPT-6 Astra directs the art agent; the image-generation tool produces raster assets. Keep actual prompts and provenance in ART_ASSETS.md. Preserve V1 illustrations and avoid public-log entries for individual asset edits.
