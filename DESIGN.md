---
name: Dotz Loyalty
colors:
  surface: '#fff8f6'
  surface-dim: '#efd5ca'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae1'
  surface-container-high: '#fee3d8'
  surface-container-highest: '#f8ddd2'
  on-surface: '#261812'
  on-surface-variant: '#5a4136'
  inverse-surface: '#3d2d26'
  inverse-on-surface: '#ffede6'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#0062a1'
  on-tertiary: '#ffffff'
  tertiary-container: '#059eff'
  on-tertiary-container: '#003357'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#fff8f6'
  on-background: '#261812'
  surface-variant: '#f8ddd2'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The brand identity of this design system centers on rewarding interactions through a vibrant, high-energy aesthetic tempered by professional utility. The personality is optimistic, efficient, and user-centric, designed to make the act of tracking and spending loyalty "Dotz" feel like a premium achievement.

The design style follows a **Corporate / Modern** approach with a strong focus on mobile-first accessibility. It prioritizes clarity and speed, using a bright signature orange to draw the eye toward value-generating actions. The interface utilizes a "Card-First" architecture, where information is chunked into approachable, rounded containers to reduce cognitive load and facilitate easy thumb-navigation on mobile devices.

## Colors

This design system utilizes a high-contrast palette to distinguish between brand presence and functional utility. 

- **Primary & Accent:** The signature Orange (#FF6B00) is reserved exclusively for interactive elements, points/saldo displays, and primary calls-to-action. It serves as the "hero" color of the interface.
- **Secondary:** A Neutral Gray (#6B7280) provides a soft anchor for body copy and UI scaffolding, ensuring the primary orange remains impactful without overstimulating the user.
- **Neutrals:** A pure white background provides maximum breathability, while a light gray surface (#F5F5F5) is used to define card boundaries and secondary containers.
- **Status Colors:** These are utilized for transaction and shipment tracking, providing immediate semantic feedback on order states.

## Typography

This design system uses **Inter** for all text levels to maintain a systematic and utilitarian feel. The hierarchy is established through significant weight shifts between headings (#333333) and body text (#6B7280).

Headlines use tight letter-spacing and bold weights to command attention, particularly for saldo and point displays. Body text is optimized for readability with a generous line-height. Labels and captions use medium to semi-bold weights at smaller sizes to ensure metadata remains legible on smaller screens.

## Layout & Spacing

The layout philosophy is built on a **Fluid Grid** that adapts to mobile-first constraints. 

- **Grid:** A 12-column grid is used for desktop, collapsing to a single column for mobile.
- **Rhythm:** An 8px linear scale (base 4px) governs all margins and padding. 
- **Containers:** Content is typically housed within cards that span the full width of the mobile viewport (minus 16px margins) or sit within a max-width container on desktop to prevent excessive line lengths.
- **Touch Targets:** All interactive elements maintain a minimum 44px hit area.

## Elevation & Depth

This design system uses **Ambient Shadows** and **Tonal Layers** to create a sense of depth without clutter. 

- **Level 0 (Background):** Pure #FFFFFF.
- **Level 1 (Cards/Surface):** Neutral #F5F5F5 with a very subtle 1px border (#E5E7EB) and a soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)).
- **Level 2 (Interactive/Active):** Elements in an active or hovered state increase shadow spread and decrease opacity (0px 8px 20px rgba(0,0,0,0.08)) to appear as if they are lifting toward the user.
- **Interactive Feedback:** Smooth transitions (200ms ease-in-out) are applied to all elevation changes.

## Shapes

The shape language is defined by a **Rounded** profile, conveying friendliness and modern accessibility. 

- **Primary Cards:** Use the `rounded-xl` (1.5rem / 24px) setting to create a distinct, soft container for rewards and product listings.
- **Buttons & Inputs:** Use the standard `rounded-lg` (1rem / 16px) for a cohesive look that mirrors the card corners.
- **Chips & Tags:** Use fully rounded (pill-shaped) borders to distinguish them from larger layout containers.

## Components

- **Buttons:** Primary buttons use the Orange #FF6B00 background with white text. Secondary buttons use a transparent background with a #6B7280 border.
- **Cards:** The core of the UI. Cards should feature #F5F5F5 backgrounds, 24px border-radius, and 16px-24px internal padding. They contain shadows that intensify on hover.
- **Input Fields:** Minimalist design with a 1px border (#D1D5DB). Upon focus, the border transitions to Orange #FF6B00 with a subtle glow.
- **Saldo Display:** A specialized component using H1 typography in #FF6B00, often placed within a high-elevation card at the top of the dashboard.
- **Status Chips:** Small, pill-shaped indicators using the Status Colors with a 10% opacity background of the same hue for a "tonal" look (e.g., Success text #28A745 on a light green background).
- **Progress Bars:** Used for loyalty tiers. The "filled" portion uses a gradient or solid Orange #FF6B00 against a #F5F5F5 track.