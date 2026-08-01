# Design System: StickCheck

## 1. Visual Theme & Atmosphere

A restrained, game-inflected diagnostic interface. The atmosphere is clinical yet energized — like a premium gaming peripheral's setup screen meets a clean lab readout. Dark substrate with surgical precision, single electric accent for active states, and the diagnostic clarity of a HUD overlay. Built by gamers, for gamers.

**Design Read:** A gamepad diagnostic tool built by gamers for gamers. Clean editorial structure with dark substrate, precise data presentation, and a single electric accent. Think Steam Input meets Linear.

| Dial | Value |
|------|-------|
| DESIGN_VARIANCE | 5 |
| MOTION_INTENSITY | 5 |
| VISUAL_DENSITY | 5 |

---

## 2. Color Palette & Roles

- **Canvas Black** (`#0A0A0B`) — Primary background surface
- **Surface Dark** (`#161618`) — Card and panel backgrounds
- **Border Subtle** (`#2A2A2E`) — Card borders, 1px structural lines
- **Text Primary** (`#EDEDEF`) — Headlines, button labels, active elements
- **Text Secondary** (`#8B8B90`) — Descriptions, metadata, labels
- **Accent Green** (`#00E676`) — Single accent for CTAs, active states, success indicators, focus rings
- **Danger Red** (`#FF453A`) — Error states, incorrect input, disconnection warnings

Maximum 1 accent color. Saturation controlled. No purple/neon AI slop.

---

## 3. Typography Rules

- **Display/UI:** Geist Sans — sharp, modern sans-serif. Track-tight for headlines (`tracking-tight`). Hierarchy driven by weight and color, not raw size.
- **Data/Telemetry:** Geist Mono — button names (A, B, X, Y), axis values, scores, timestamps. Monospace for all numeric and technical readouts.
- **Scale:** `text-4xl md:text-6xl` for hero text. `text-sm` for data labels. `text-xs` for metadata.
- **Body:** `text-sm leading-relaxed max-w-[65ch]` for descriptions.
- **Banned:** Inter, Roboto, Arial, Helvetica. The project uses Geist (already installed via next/font).
- **Serif:** BANNED. This is a diagnostic tool, not an editorial.
- **Numeric Display:** All numbers use Geist Mono. Score counters, reaction times, axis values — always monospace.

---

## 4. Component Stylings

- **Buttons:** Flat, no outer glow. Tactile `-translate-y-[1px]` or `scale-[0.98]` on `:active`. Accent fill for primary, ghost/outline for secondary. Rounded-lg corners.
- **Cards:** `rounded-xl` corners. `1px solid var(--border)` borders. No drop shadows (shadows banned in dark mode for this aesthetic). Background: `var(--bg-surface)`.
- **Controller Status Card:** Animated border color on connect/disconnect. Internal padding `p-6`. Controller name in monospace. Button/axis counts as data labels.
- **Button Prompts:** Clean outlined keycap shapes. Monospace letter inside. Border + accent color on correct press.
- **Progress Bars:** Thin, sharp bars (`h-1.5`). Accent fill. No rounded ends (keep sharp for diagnostic feel).
- **Inputs:** Label above, error below. Focus ring in accent color. No floating labels.

---

## 5. Layout Principles

- Grid-first responsive architecture. CSS Grid over Flexbox math.
- Max-width containment: `max-w-3xl mx-auto` for content areas.
- Full-height sections use `min-h-screen` (not `h-screen` — iOS Safari).
- Generous vertical padding: `py-24` to `py-32` between sections.
- Asymmetric layouts for data displays (stick check arena, button matrix).
- Single-column collapse below `768px`. No horizontal scroll on mobile.
- Z-index scale: nav=10, modals=20, overlays=30, diagnostic-grid=0.

---

## 6. Motion & Interaction

- **Spring physics** for all interactive elements. No linear easing.
- **Staggered cascade reveals** for page load (logo → title → status → button).
- **Hardware-accelerated transforms only.** Animate `transform` and `opacity`. Never `top`, `left`, `width`, `height`.
- **Anime.js** is the animation library. Never GSAP, never Motion/Framer Motion.
- **Scope cleanup:** All animation scopes revert on component unmount.
- **Reduced motion:** When `prefers-reduced-motion: reduce` is active, disable decorative animations. Keep state transitions visible. Keep controller input responsive.
- **No animation inside Gamepad polling loop.** Animations are purely visual, driven by React state changes.

---

## 7. Anti-Patterns (Banned)

- No emojis anywhere in code or UI text
- No Inter, Roboto, or generic system fonts
- No pure black (`#000000`) — use `#0A0A0B` or `#161618`
- No neon/outer glow shadows
- No purple/blue AI gradient slop
- No generic loading spinners (use skeletal loaders matching layout shape)
- No `Lorem Ipsum` or placeholder text
- No AI copywriting ("Elevate", "Seamless", "Unleash", "Next-Gen")
- No custom mouse cursors
- No 3-column equal card grids
- No serif fonts for display
- No `h-screen` — always `min-h-screen` or `min-h-[100dvh]`
- No GSAP — Anime.js only
- No Framer Motion — Anime.js only
- No animation instances created inside requestAnimationFrame loops
- No controller logic inside animation code

---

## 8. Gaming-Specific Design Language

- **Controller button prompts:** A, B, X, Y rendered as clean outlined keycap shapes
- **Stick visualization:** Clean dot on subtle grid arena (fighting game training mode)
- **Trigger meters:** Thin horizontal bars with accent fill
- **Success feedback:** Brief green border pulse on correct input
- **Error feedback:** Short horizontal red shake on incorrect input
- **Diagnostic grid:** Extremely subtle crosshair pattern at `opacity-[0.015]` on section backgrounds
- **Score display:** Large monospace number with count-up animation
- **Rating labels:** EXCELLENT / GOOD / FAIR / POOR rendered in monospace with appropriate accent colors
