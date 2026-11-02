# Ora review — 1 November 2026

## Layout and interaction

Chrome checks at 320, 390, 700, 701, 1000 and 1440px found no horizontal page overflow or runtime/missing-request errors after layout settled. Reviewed the hero, material heading, circle reveal, footer beam and mobile composition. Verified preset synchronization, keyboard range input, the shared footer power switch, and runtime reduced-motion changes.

The room reveal begins at a 28px radius, expands to cover the viewport diagonal, and contracts when scrolling backward. At a 1440×1000 viewport, checked radii were 28px, 453px, 879px and 198px for forward progress 0%, 50%, 100% and then reverse to 20%. Reduced motion and no-JavaScript layouts show the complete scene without clipping.

## Text and contrast

- Axe-core 4.10.3: zero reported violations for the WCAG 2 A/AA and 2.1 AA rule tags at all six widths. The color-contrast rule passed 96–104 text nodes per viewport.
- Supporting text is at least 12px; body descriptions use 16px. Display and interface type use upright DM Sans. Decorative section numbers and text-based icon glyphs are removed.
- Text over photography, opaque labels and lighting was additionally checked against screenshots of the rendered backgrounds with foreground text hidden. Samples at 390px and 1440px covered ten page regions. The lowest sampled text contrast was 4.77:1; no sampled normal text fell below 4.5:1 or large text below 3:1.
- The footer was checked separately at maximum brightness and 4500K. The lowest sampled footer text contrast was 5.65:1.
- Automated contrast checks marked some photographic/overlapping regions for review, including the lamp hint, room labels, photo stamp and decorative saved-card wordmark. The hint and labels use opaque backgrounds; screenshot sampling covered visible text. The saved-card wordmark is decorative and hidden from assistive technology.

These results describe the tested browser, sizes and states, not a certification of every possible browser or assistive-technology combination. Native controls, labels, focus styles and reduced-motion behavior remain in place.

## Icons and media

Lucide SVG sources are pinned to upstream commit a630cec77eac6568b989e87e4947a8bfe45caacd. The complete ISC/MIT notices and source details are retained in assets/icons. Inline icons are marked decorative; buttons retain text or accessible names.

All seven photographic assets remain below 100,000 bytes. Image provenance and compression notes are in assets/GENERATION.md.

## Room-led hero and contained material study

The subsequent hero revision was checked at the same six widths, with no page overflow, missing requests or runtime errors. Power and keyboard brightness controls remain synchronized. The material image is capped at 440px wide on desktop, uses its square composition and has no transform in either normal or reduced-motion mode. New hero text/background samples at 100% brightness and 4500K passed: minimum sampled ratios were 11.04:1 at 390px and 9.26:1 at 1440px.
