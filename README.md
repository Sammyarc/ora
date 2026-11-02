# Ora — Day 03

An independent portable-light concept. Open index.html through your editor's static server. No installation or build step is required. Deploy the Day-03 directory as a static site when ready.

## Spatial redesign

The opening is a full-bleed apartment scene at dusk, with Ora on a walnut side table beside a sofa and open book. The headline and actions sit over the quiet side of the room; brightness and power controls set its atmosphere from the bottom strip. Mobile puts the message above the room's focal area. A sticky room sequence opens from a small central circle into the full viewport as the visual clock advances from 17:00 to 21:30. Scrolling backward contracts the same circle. It illustrates the transition into evening with photographic exposure; it does not simulate actual sunlight or physical light transport.

The studio uses a full-width room with floating controls positioned away from the lamp. The material study uses a complete square crop, capped at 440px wide, with no scroll zoom. It shows the brushed shade, seam and diffuser together beside the explanatory text. The lifestyle scenes use different crops and staggered proportions. The finale adds a large working switch and a soft triangular light beam from a hidden source above the footer. The beam widens downward and shares the page's brightness, warmth and power state.

experience.css contains the redesigned composition; styles.css supplies shared component styling. script.js owns the shared lighting state, GSAP transitions, scroll composition and reduced-motion behavior. No scroll input is captured. The room sequence becomes a static scene without JavaScript or with reduced motion.

## Design rationale

The previous projects established preferences, not a template to repeat:

- A strong focal object: Ora opens with an interactive metal lamp, full-bleed olive surroundings and oversized typography.
- Behavior belongs to the product: brightness, warmth and power shape the atmosphere. Hero, studio, saved preview and footer share one state.
- Precise response matters: GSAP eases from the current lighting values, overwriting unfinished transitions without resetting. Native scrolling remains uninterrupted.
- A complete brand world: product introduction, lighting studio, material details, two lifestyle scenes, a working save/share experience and a large closing signature.
- Finishing details count: frosted fixed navigation, circular back-to-top control, SVG/ICO/Apple favicons, local fonts, compressed images and clear focus states.

Upright DM Sans carries both display and interface typography. Section numbering and italic serif accents are omitted. Olive, ivory and lime distinguish Ora from the earlier sports and coffee projects. Readable content stays inside 1400px while section backgrounds fill the viewport. Icons use official Lucide SVG paths with upstream license and provenance retained in assets/icons.

## Functional scope

Use any power control to switch the light on/off. Native sliders and three presets change the shared light. Adjusting a slider turns the light on. Save stores one named atmosphere in this browser's localStorage; sharing encodes it into the URL. Shared settings take precedence over saved settings. Reset clears both. A copyable dialog handles unavailable clipboard access. A shared local preview URL becomes publicly useful once the site has a public address.

Lighting is a photographic/CSS simulation, not physically accurate relighting or a manufactured product specification. There is no checkout, account or backend. No invented customer reviews or performance claims are used.

## Verification

See [ACCESSIBILITY-CHECK.md](ACCESSIBILITY-CHECK.md) for the latest six-width accessibility results, rendered-background contrast measurements, circular reveal checks and icon provenance.

Chrome browser checks passed at 320, 390, 600, 800, 1100 and 1440px without horizontal overflow or broken images. Reviewed desktop/mobile composition and loaded photography. Tested preset synchronization, keyboard slider input, all power controls, save/reload persistence, URL bounds, reset, clipboard fallback, GSAP absence, scroll reveals and live reduced-motion changes. No page errors or missing asset responses were observed.

The redesign was also checked at 601, 1000 and 1001px, around its layout breakpoints. Verified the closing switch, reverse scroll clock, URL restoration, clipboard fallback dialog, keyboard synchronization and the static no-JavaScript page. Rechecked the mobile hero and studio panel placement against the actual rendered images.

Text uses AA contrast color pairs. Text over photography uses dark scrims or opaque badges; translucent navigation uses high-opacity backgrounds and backdrop blur. Reduced motion removes entrance movement and lighting interpolation. Content remains visible without GSAP; without JavaScript the editorial page remains readable and the light controls require scripting, as disclosed in the page.

All seven deployed photographic assets are below 81 KB each. See assets/GENERATION.md for the exact prompts and compression notes. Local DM Sans and GSAP license/source notes remain with their assets.
