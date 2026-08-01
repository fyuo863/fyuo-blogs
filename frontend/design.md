# Design — fyuo-blogs.

## Genre

Playful graphic lab: a personal project archive with the tactility of printed matter, not a generic SaaS dashboard.

## Macrostructure family

- Project pages: Project Poster Wall — an asymmetric featured work panel followed by a deterministic collage.
- Content pages: Long Document — a strong masthead, utility search strip, and calm reading list.
- App surfaces: Utility rail — compact controls that never compete with content.

## Theme

Dark indigo ink is the stable field. Acid green, coral, and cobalt act as small, purposeful collision points; dots and moire are texture, never content containers.

## Typography

- Display: Archivo Black, normal.
- Body: Space Grotesk.
- Mono: DM Mono.
- Headings remain roman; emphasis comes from colour and scale, never italics.

## Motion

- Pointer field: a local, low-opacity colour halo and moire offset on fine pointers only.
- Entry: short opacity and translate reveal.
- Exit: existing physics transition remains.
- Reduced motion: no pointer field or spatial animation.

## Interaction stance

- Cards lift by a small translate and reveal a contrasting rule.
- Controls maintain a 44px touch target and instant visible focus.
- No autoplay carousel, bounce, or scroll-triggered choreography.

## Shared rules

- All colours and font choices originate in `tokens.css`.
- Decorative textures stay below 10% opacity and never obscure text.
- Project names, descriptions, routes, authentication, and API behavior remain unchanged.
