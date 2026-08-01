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

- Generative field: the home masthead owns a Canvas 2D dot field with two low-opacity moire passes. It is deterministic at rest and only ripples briefly under a fine pointer.
- Runtime guardrails: animation runs only while the masthead is visible and the tab is active; it pauses immediately when either condition changes.
- Entry: a short opacity and translate reveal may use a native CSS view timeline when available, with the static composition as the baseline.
- Exit: existing physics transition remains.
- Reduced motion: the masthead retains a static generated texture; no pointer or spatial animation runs.

## Interaction stance

- Cards lift by a small translate and reveal a contrasting rule.
- Controls maintain a 44px touch target and instant visible focus.
- No autoplay carousel, bounce, or scroll-triggered choreography.

## Shared rules

- All colours and font choices originate in `tokens.css`.
- Decorative textures stay below 10% opacity and never obscure text.
- Generated visual layers are `aria-hidden`, pointer-transparent, and never carry content or controls.
- Project names, descriptions, routes, authentication, and API behavior remain unchanged.
