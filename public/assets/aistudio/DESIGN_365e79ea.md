---
name: Warm Horizon
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d3'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#f0e6e1'
  surface-container-highest: '#eae1dc'
  on-surface: '#1f1b18'
  on-surface-variant: '#58423c'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#8b716a'
  outline-variant: '#dfc0b7'
  surface-tint: '#a73918'
  primary: '#a43716'
  on-primary: '#ffffff'
  primary-container: '#c54f2c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb5a0'
  secondary: '#006a6a'
  on-secondary: '#ffffff'
  secondary-container: '#9ff1f0'
  on-secondary-container: '#0c7070'
  tertiary: '#8b4c11'
  on-tertiary: '#ffffff'
  tertiary-container: '#a96428'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#862201'
  secondary-fixed: '#9ff1f0'
  secondary-fixed-dim: '#83d4d4'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f50'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb780'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#fff8f5'
  on-background: '#1f1b18'
  surface-variant: '#eae1dc'
typography:
  headline-xl:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
  headline-xl-mobile:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
  headline-lg-mobile:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 36px
  headline-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 32px
  body-xl:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 34px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  label-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1.5rem
  space-lg: 2.5rem
  space-xl: 4rem
---

## Brand & Style

This design system is engineered for complete digital newcomers, elderly demographics, or cognitively overwhelmed individuals who experience tech anxiety. The emotional core is safety, gentle reassurance, and immediate comprehension without cognitive friction.

### Philosophy & Visual Aesthetic
- **Minimalist Tactile Realism:** Eliminates abstract conventions (hamburgers, carousels, nested dropdowns, multi-step drawers). Employs gentle, inviting physical metaphors—cushioned elevations, soft press states, and luminous focal rings.
- **Sensory & Visual Primacy:** Operates on visual clarity, unmistakable silhouettes, pictograms, and color-coded state transitions rather than dense instructional text.
- **Distraction-Free Serenity:** Spacious, unhurried environments with expansive margins that isolate one single clear choice or action at a time.
- **Breathing State Feedback:** Interactive affordances pulsate with rhythmic, soft luminance rings (4-second breath cycle) to gently draw attention without jarring notifications or aggressive alarms.

## Colors

The palette balances warm, sunlit organic energy with tranquil equilibrium. All color pairings are rigorously calibrated to surpass WCAG AAA standards for low-vision and non-literate legibility.

### Palette Architecture
- **Primary (`#D95D39` - Terracotta Peach):** Directs the primary life-line of the screen. Used exclusively for positive progression, primary action buttons, and active presence rings.
- **Secondary (`#2B8282` - Deep Sea Teal):** Delivers stabilizing, grounding counterpoints. Deployed for confirmed completion states, supportive toggles, and calm contextual anchors.
- **Tertiary (`#F4A261` - Gentle Amber Glow):** Reserved for subtle breathing highlights, focus auras, and transient loading states.
- **Neutral Foreground (`#24201D` - Hearth Umber):** A deep, warm carbon tone that replaces stark pure black, offering intense visual contrast against pale backdrops while avoiding visual glare.
- **Canvas & Surface System:** 
  - `surface-base`: `#FFFDF9` (Ivory Linen, non-reflective base canvas).
  - `surface-card`: `#FFFFFF` (Pure Bright Surface for crisp interactive separation).
  - `surface-muted`: `#F5EBE1` (Soft Clay, used for inset wells and neutral inactive zones).

## Typography

Typography uses **Atkinson Hyperlegible Next** across all text levels. Its glyph distinctiveness (such as exaggerated crossbars, distinct loops, and differentiated 'I', '1', and 'l') guarantees uncompromised legibility for individuals with low vision, dyslexia, or minimal reading comprehension.

### Rules of Engagement
- **Size Floors:** Nothing renders smaller than 16px under any condition. Key prompts never dip below 20px.
- **Short-Burst Copy:** Text never exceeds three lines per block. Words serve merely as secondary reassurance alongside self-evident icons and shapes.
- **Letter Spacing:** Maintain natural, generous default tracking (`0.01em` to `0.02em`) to prevent letter crowding.

## Layout & Spacing

Layout avoids complexity and embraces single-task immersion. The screen operates as a calm stage where only one central interactive concept lives at any given time.

### Grid Model
- **Mobile (Up to 600px):** Single column layout with generous `1.25rem` outer margins. No side-by-side interactive inputs. Tap targets stretch fully across the safe width.
- **Tablet / Desktop (601px+):** Centered max-width content container (`680px`), isolated within a wide peaceful canvas (`margin: 2.5rem`). Multi-column dashboards are prohibited; all steps flow linearly top-to-bottom.
- **Touch Insulation:** Minimum physical target clearance between interactive objects is `space-md` (24px) to prevent accidental mis-taps by users with motor tremors or unpracticed fingers.

## Elevation & Depth

This design system avoids harsh artificial drop shadows and flat invisible planes in favor of **pillowy tactile warmth** and **ambient breathing light**.

### Surface Hierarchy
- **Level 0 (Quiet Canvas):** `#FFFDF9`. Completely flat, non-distracting background foundation.
- **Level 1 (Cushion Card):** `#FFFFFF` paired with an ultra-diffused peach-tinted ambient shadow: `box-shadow: 0 8px 30px rgba(217, 93, 57, 0.08)`. Conveys resting physical presence.
- **Level 2 (Active / Raised Interactive):** Lifts up on hover or approach: `box-shadow: 0 16px 40px rgba(217, 93, 57, 0.16)`. Accompanied by a 2px downward displacement upon press to mimic an authentic cushioned spring.
- **Breathing Glow Ring:** High-priority buttons and focal cues feature a pulsating double-ring animation:
  - `ring-1`: `0 0 0 6px rgba(217, 93, 57, 0.25)`
  - `ring-2`: `0 0 0 14px rgba(217, 93, 57, 0.10)`
  - Animates smoothly in an ease-in-out breathing rhythm over a 4-second duration.

## Shapes

The shape system embraces **Pill-shaped (`roundedness: 3`) geometry**. Sharp right angles are strictly eliminated to reduce cognitive stress, sharp visual corners, and sterile rigidity.

- **Primary Buttons & Floating Triggers:** Fully pill-shaped (`border-radius: 9999px`).
- **Cards & Enclosures:** Large, friendly curves (`border-radius: 2rem` to `3rem`).
- **Input Wells & Toggles:** Ultra-rounded capsules (`border-radius: 1.5rem`).
- **Visual Weight:** Every border or stroke maintains a minimum thickness of 3px to 4px to ensure distinct boundary clarity.

## Components

### 1. Tactile Push Buttons
- **Architecture:** Giant touch targets (minimum height: 68px, target area > 72px) with full pill contours.
- **Visuals:** Filled with Primary Terracotta (`#D95D39`), topped with crisp white Atkinson Hyperlegible glyphs and large universal icons (minimum 28px icon).
- **Tactile Feedback:** A deep mechanical press state that shifts down by 4px (`transform: translateY(4px)`) paired with a visible color-deepen filter to visually acknowledge touch even if the device's haptic motor is muted.

### 2. Breathing Glow Attention Rings
- Encases critical navigational actions (e.g., "Start", "Listen", "Yes", "Help").
- Radiates soft light outward in continuous cycles, signaling affordance without demanding urgency.

### 3. Non-Text Visual Choice Cards (Replacing Lists & Radios)
- Traditional tiny radio dots and checkboxes are banned.
- Replaced by large tactile choice tiles (minimum height: 100px).
- **Unselected:** Warm off-white background with a gentle 3px border (`#F5EBE1`).
- **Selected State:** Switches instantly to Soft Teal surface (`#2B8282`), text flips to pure white, and an oversized white checkmark icon pops smoothly into view.

### 4. Picture-Assisted Input Wells
- Replaces plain line inputs with generous pill-shaped wells padded with warm ivory tones.
- Each input is flanked on the left by an unmistakable real-world icon (e.g., a phone handset, a house, an ear).
- When active, the entire border swells with a 4px Deep Sea Teal glow (`#2B8282`), removing all ambiguity regarding active keyboard focus.

### 5. Ambient Flow Toggles
- Sized at double typical mobile dimensions (80px width, 48px height).
- The sliding toggle knob is an oversized white pearl that travels across an illuminated Teal (On) or Muted Terracotta (Off) track, giving immediate physical state confirmation.