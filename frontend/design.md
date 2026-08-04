# Design — fyuo-blogs

A locked custom editorial system for a personal portfolio and reading archive.

## Genre

Editorial — a digital magazine with the project index as its cover story.

## Macrostructure family

- Portfolio pages: Portfolio Grid — a typographic cover followed by an asymmetric project index.
- Content pages: Long Document — an issue masthead, utility search line, and reading ledger.
- App surfaces: Newspaper masthead — functional controls live in a compact, ruled utility strip.

## Theme

Warm paper and ink carry the reading surface. Vermilion marks an action; cobalt marks the index. Both are small signal colours, never backgrounds for whole sections.

## Typography

- Display: Bricolage Grotesque, 800, roman.
- Body: Newsreader, 400–600.
- Metadata: IBM Plex Mono, 400–500.
- Display is large, compact, and left-biased; prose remains calm and readable.

## Spacing

Use the 4-point named scale from `tokens.css`. Generous vertical whitespace is structural, not filler.

## Project index

- The cover story remains the lone lead feature.
- Selected work uses enlarged iPod-style Cover Flow: one centred project cover sits forward while adjacent covers recede, overlap slightly to avoid visible gaps, and rotate inward at 68 degrees. The first side gap remains 66%; each gap after it shrinks to two-thirds of the previous one. The selected project’s title, liner note, and external link live in a separate caption strip.
- Selection works with cover clicks, bounded previous/next controls, Left/Right keys, and horizontal drag. Drag behaves like an iPod wheel: distance immediately advances the selected cover while the stage stays composed, with each indexed change flowing through the existing Cover Flow angle and depth transition. Fast flicks project momentum across multiple projects on release. It does not loop or fade. Spatial transitions respect reduced motion.
- The Cover Flow stage carries a dynamically rendered, single-colour wood-grain field. Warm ink SVG lines flow slowly around a restrained knot, while individual line weights independently thicken and thin; local line density and weight—not transparency or a gradient—sets the light and dark grain. Each cover extends a clipped mirrored reflection below its lower edge, using the same animated wood-grain frame so both surfaces stay synchronized. The field becomes static when reduced motion is requested.

## Motion

- One quiet opacity/translate reveal for large desktop surfaces.
- The Journal masthead may use a pointer-reactive oil-glass treatment: a warm-paper lens refracts by a few pixels, with restrained cobalt/vermilion chromatic edges, displaced line-grain scatter, and a fine rim. It is decorative, preserves the readable ink title, and becomes static under reduced motion.
- The home cover title may use a fixed-centre paper-dot layer over cobalt; pointer proximity only reduces dot radius to reveal the lower colour.
- The halftone canvas fills the warm-paper home cover without scaling the title pattern: the title keeps an independently anchored 0.39-cell grid, while the surrounding cover receives an added 0.78-cell grid. A damped two-dimensional wave-heightfield injects stronger sources at randomized intervals along the left edge, and pointer presses inject a local ripple; stronger wave peaks shrink the fixed-centre dots to reveal more cobalt.
- A vermilion typesetter mark advances through the home-title characters every half-second; reduced motion pins it to the first character.
- The selected-work section uses one continuous fixed vermilion selection block, mirroring the home title without adding a competing rhythm.
- Links and cards use a short colour or 2px translate response only.
- Reduced motion removes all spatial movement.

## Microinteractions stance

- Focus rings are instant and high contrast.
- No splash screen, cursor effect, physics fall, carousel, or autoplay.
- Controls stay rectangular and typographic; no glossy pills.

## CTA voice

- Primary: solid vermilion rectangle, black label, single-line verb.
- Secondary: ink text with a fine underline/rule.

## Shared rules

- Existing routes, project links, blog data, authentication, and admin controls remain unchanged.
- Decorative illustration is not used; type, rules, image crops, and colour blocks do the work.
- Every page uses this token system and shares the masthead/footer voice.

## Exports

### tokens.css

The source of truth is `frontend/tokens.css`.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(0.97 0.014 82);
  --color-ink: oklch(0.19 0.014 55);
  --color-accent: oklch(0.63 0.21 30);
  --font-display: "Bricolage Grotesque", sans-serif;
  --font-body: "Newsreader", serif;
}
```

### DTCG `tokens.json`

```json
{"color":{"paper":{"$value":"oklch(0.97 0.014 82)","$type":"color"},"ink":{"$value":"oklch(0.19 0.014 55)","$type":"color"},"accent":{"$value":"oklch(0.63 0.21 30)","$type":"color"}}}
```

### shadcn/ui CSS variables

```css
:root { --background: 0.97 0.014 82; --foreground: 0.19 0.014 55; --primary: 0.63 0.21 30; --primary-foreground: 0.19 0.014 55; }
```
