---
name: Celestial Ethereal
colors:
  surface: '#fbf8ff'
  surface-dim: '#d3d8ff'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#ececff'
  surface-container-high: '#e5e6ff'
  surface-container-highest: '#dee0ff'
  on-surface: '#0f1743'
  on-surface-variant: '#464653'
  inverse-surface: '#252d59'
  inverse-on-surface: '#f0efff'
  outline: '#767685'
  outline-variant: '#c6c5d6'
  surface-tint: '#4950c7'
  primary: '#474dc5'
  on-primary: '#ffffff'
  primary-container: '#6067df'
  on-primary-container: '#fffbff'
  inverse-primary: '#bfc2ff'
  secondary: '#864d61'
  on-secondary: '#ffffff'
  secondary-container: '#fdb5cc'
  on-secondary-container: '#7a4357'
  tertiary: '#635a55'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c736d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bfc2ff'
  on-primary-fixed: '#02006d'
  on-primary-fixed-variant: '#3035af'
  secondary-fixed: '#ffd9e3'
  secondary-fixed-dim: '#fab3ca'
  on-secondary-fixed: '#360b1e'
  on-secondary-fixed-variant: '#6a364a'
  tertiary-fixed: '#ede0d9'
  tertiary-fixed-dim: '#d0c4be'
  on-tertiary-fixed: '#201a16'
  on-tertiary-fixed-variant: '#4d4540'
  background: '#fbf8ff'
  on-background: '#0f1743'
  surface-variant: '#dee0ff'
typography:
  display-lg:
    fontFamily: Domine
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Domine
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Domine
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 1.5rem
  stack-gap-lg: 2rem
  stack-gap-md: 1rem
  stack-gap-sm: 0.5rem
  card-inset: 1.25rem
---

## Brand & Style
The design system is centered on a **Mystical & Ethereal** aesthetic, blending **Glassmorphism** with **Tactile** spiritual elements. The brand personality is serene, introspective, and premium—evoking the feeling of a digital sanctuary. 

The visual language uses soft, luminous gradients to simulate "aura" energy, paired with high-precision serif typography that feels both ancient and contemporary. Interactions should feel fluid and "weighted," as if the user is interacting with physical tarot cards or crystal surfaces. White space is generous, treated as "breathable air" to maintain a calm user experience. Key accents include microscopic sparkle effects and thin, golden-threaded borders to signify spiritual value.

## Colors
The palette is built on **Soft Pastels** and **Iridescent Gradients**. 
- **Primary & Secondary:** Used sparingly for interactive states and decorative symbols.
- **Tertiary/Surface:** A warm, creamy white (`#FDF0E9`) serves as the base canvas, preventing the "coldness" of pure white.
- **Neutral:** A deep, cosmic indigo (`#1A224E`) is used for text to ensure high legibility against pastel backgrounds.
- **Aura Gradients:** Soft transitions between lavender, blush pink, and pale peach are used for containers and interactive "Glow" states.

## Typography
This design system employs a high-contrast typographic pairing to balance tradition and modern utility.
- **Headlines:** Use **Domine** for an authoritative yet elegant "editorial" feel. Display sizes should utilize tighter letter-spacing for a sophisticated look.
- **Body & Interface:** Use **Plus Jakarta Sans** for its approachable, rounded glyphs that complement the soft UI shapes. 
- **Hierarchy:** Critical information (like "Birth Aura") uses the Serif face, while functional metadata (like "Libra • Air • Opal") uses the Sans face in a semi-bold weight.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high internal margins to emphasize the "floating" nature of the components. 
- **Safe Zones:** Use a minimum 24px (1.5rem) horizontal margin for mobile screens.
- **Rhythm:** Vertical spacing should follow an 8px base unit. Larger gaps (32px+) are encouraged between distinct sections to maintain the minimalist, airy brand feel.
- **Card Padding:** All primary containers use a consistent internal padding of 20px to allow content to sit comfortably away from the rounded edges.

## Elevation & Depth
Depth is created through **Luminous Stacking** rather than traditional shadows.
- **Inner Glows:** Instead of drop shadows, use `box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.5)` to create a backlit glass effect.
- **Backdrop Blurs:** Floating cards should utilize a `backdrop-filter: blur(10px)` with a semi-transparent white or pastel fill (15-40% opacity).
- **Soft Diffusion:** If shadows are required for legibility, use extremely diffused, low-opacity indigo tints (`rgba(26, 34, 78, 0.04)`) with large blur radii (20px+).

## Shapes
Shapes are highly organic and soft. 
- **Containers:** Cards and primary sections use a generous 24px radius to feel welcoming.
- **Interactive Elements:** Buttons and pill-toggles use a fully rounded (100px) "pill" shape to signify touch-friendliness.
- **Decorative Elements:** Circular motifs (spheres, halo rings) should be used as background ornaments to reinforce the mystical theme.
- **Borders:** Use hairline-thin (1px) borders with a subtle gradient or low-opacity white to define edges without adding visual weight.

## Components
- **Aura Cards:** The signature component. Feature a faint iridescent gradient background, soft inner glow, and a thin, light-colored border.
- **Sealing Buttons:** Large, high-pill-shaped buttons with a luminous linear gradient. Incorporate a "sparkle" icon on the leading edge. Use a "hold" interaction pattern with a circular progress fill.
- **Ethereal Chips:** Small, semi-transparent labels used for attributes (e.g., "Libra"). No borders, just a soft pastel background tint.
- **Input Fields:** Minimalist under-line or very soft ghost-box inputs. The focus state should trigger a subtle outer glow rather than a thick border change.
- **Icons:** Use thin-stroke (1px to 1.5px) icons. Incorporate 4-pointed star (sparkle) symbols as decorative accents on primary action items.
- **Navigation:** A centered floating bottom bar with high blur and a thin divider, utilizing soft color shifts for active states.