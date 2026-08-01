# PRD Update — Animation and UI Reference

## Update Summary

Add the following technologies to the StickCheck MVP:

* **Anime.js** for interface and gameplay animations
* **React Bits** as a visual and interaction reference library

These tools must be used only for presentation, motion, and UI polish. Controller detection, Gamepad API polling, scoring, and diagnostic calculations must remain independent from animation components.

---

# 13. Technology Stack

## Core Framework

* Next.js
* React
* TypeScript
* Tailwind CSS

## Controller Integration

* Browser Gamepad API
* `navigator.getGamepads()`
* `gamepadconnected` event
* `gamepaddisconnected` event
* `requestAnimationFrame()`

## Animation

* Anime.js

## UI and Design Reference

* React Bits

## Browser Storage

* localStorage

---

# 14. Anime.js Animation Requirements

## Purpose

Use Anime.js to create smooth, responsive, and meaningful animations throughout StickCheck.

Animations should:

* Improve interaction feedback
* Make controller checks feel responsive
* Communicate application-state changes
* Make check completion clear
* Improve perceived responsiveness
* Support a polished game-inspired interface

Animations must not delay or interfere with controller input processing.

---

## Required Anime.js Setup

Install Anime.js:

```bash
npm install animejs
```

Use the current Anime.js package API supported by the installed version.

Keep Anime.js usage inside client components because DOM animation requires browser access.

Example:

```ts
"use client";

import {
  animate,
  createScope,
  stagger,
} from "animejs";
```

Do not assume that Anime.js automatically handles React component cleanup.

Animations and scopes must be cleaned up when components unmount.

---

## Animation Rules

1. Do not use Anime.js for controller polling.
2. Do not use Anime.js as the application state manager.
3. Do not store controller input values only inside Anime.js animations.
4. Do not connect Gamepad API logic directly to animation code.
5. Keep controller input logic inside React hooks and utility functions.
6. Use React state to represent application state.
7. Use Anime.js only to animate UI elements based on application-state changes.
8. Clean up animation scopes when components unmount.
9. Avoid infinite animations that consume unnecessary CPU resources.
10. Respect reduced-motion preferences.
11. Do not create a new animation instance on every controller polling frame.
12. Do not allow animation timing to change controller-test results.

---

# 15. Required Animations

## 15.1 Home Screen Entrance

When StickCheck loads:

* Fade in the logo.
* Move the main heading upward slightly.
* Fade in the controller connection card.
* Reveal the Start Check button after a controller is detected.

Suggested sequence:

```text
Logo
  ↓
Title
  ↓
Description
  ↓
Controller status
  ↓
Start Check button
```

Suggested timing:

```ts
const entranceDuration = 400;
const entranceStagger = 80;
```

Timing values use milliseconds.

The animation should be subtle and fast.

Do not use long loading animations.

---

## 15.2 Controller Connection Animation

When a controller connects:

* Animate the connection indicator.
* Transition the status from:

```text
No controller detected
```

to:

```text
Controller connected
```

* Fade in the controller name.
* Scale the status icon slightly.
* Reveal the Start Check button.

Suggested behavior:

```text
Disconnected
    ↓
Connection indicator appears
    ↓
Controller information fades in
    ↓
Start button becomes active
```

Do not use a large celebration animation.

---

## 15.3 Check Transition Animation

When moving between checks:

1. Animate the completed check out.
2. Display a short completion state.
3. Animate the next check in.

Example:

```text
BUTTON CHECK COMPLETE

✓

Next: Stick Check
```

Suggested transition duration:

```ts
const checkTransitionDuration = 300;
```

The transition must not exceed approximately one second.

The user should not feel blocked by animations.

Controller input should remain disabled only when the application is intentionally changing check state, not because an animation is still running.

---

## 15.4 Button Check Feedback

When the user presses the correct button:

* Briefly scale the button prompt.
* Show a success indicator.
* Animate the score increase.
* Transition to the next prompt.

When the user presses an incorrect button:

* Apply a short horizontal shake.
* Display an incorrect-input indicator.
* Do not use excessive screen shaking.

Example:

```text
Correct input:

Prompt:
Scale 1 → 1.08 → 1

Score:
Fade and move upward

Incorrect input:

Prompt:
Move left → right → center
```

Animations must not affect button detection.

Input must be processed immediately even if an animation is still running.

---

## 15.5 Stick Check Animation

The player cursor must move smoothly based on analog-stick input.

Use:

* CSS transforms
* Anime.js transform animation
* Direct transform updates through a reusable animation utility

Avoid creating a new Anime.js animation instance on every animation frame.

The controller polling loop must remain responsible for reading stick values.

The animation layer must only render the calculated cursor position.

Preferred architecture:

```text
Gamepad API
    ↓
useGamepad hook
    ↓
Normalized stick position
    ↓
Stick Check state
    ↓
Cursor visual update
```

When the player reaches a target:

* Animate the target scale.
* Fade the target out.
* Display the next target.
* Briefly animate progress.

Example:

```text
Target reached

Target:
Scale 1 → 1.3 → 0

Progress:
2 / 5 → 3 / 5
```

The cursor must remain responsive.

Do not add excessive smoothing that makes controller movement feel delayed.

---

## 15.6 Trigger Check Animation

The trigger meter should animate smoothly as the trigger value changes.

Requirements:

* Update based on the current trigger value.
* Avoid creating a new animation instance for every input update.
* Prefer transform-based updates.
* Keep visual latency low.
* Use `scaleX` or a CSS transform instead of repeatedly changing width.

The meter should visually represent:

```text
0% → empty
50% → half full
100% → full
```

When the trigger reaches the completion threshold:

* Briefly scale the meter.
* Show a completion indicator.
* Continue to the next screen.

Anime.js must not calculate the trigger value.

The Gamepad API remains the source of truth.

---

## 15.7 Results Animation

When the results page loads:

1. Fade in the completion heading.
2. Animate the overall score.
3. Animate category progress bars.
4. Reveal the controller rating.
5. Fade in action buttons.

Suggested sequence:

```text
CHECK COMPLETE
       ↓
Overall score
       ↓
Category scores
       ↓
Controller rating
       ↓
Action buttons
```

Use staggered animation for category cards.

Suggested timing:

```ts
const resultStagger = 120;
```

---

## 15.8 Score Count-Up

Animate the displayed overall score from:

```text
0
```

to:

```text
96
```

The final score must come from the scoring system.

Anime.js must only animate the displayed value.

Anime.js must not calculate or modify the actual controller score.

Suggested implementation:

```ts
const displayScore = {
  value: 0,
};

// Animate displayScore.value
// from 0 to finalScore.
//
// Update the visible score during
// the animation.
//
// The finalScore value remains
// controlled by the scoring system.
```

The displayed score must end at the exact calculated score.

---

# 16. Reduced Motion Support

Check:

```css
@media (
  prefers-reduced-motion: reduce
) {
  /* Reduce or disable
     non-essential motion */
}
```

When reduced motion is enabled:

* Disable decorative entrance animations.
* Disable unnecessary movement.
* Keep important state changes visible.
* Keep controller input responsive.
* Do not remove essential progress feedback.
* Show results immediately when appropriate.

Create a reusable hook if needed:

```ts
useReducedMotion();
```

When reduced motion is enabled, avoid starting non-essential Anime.js animations.

---

# 17. React Bits Reference

## Purpose

Use React Bits as a source of inspiration and reusable visual patterns for:

* Animated text
* Page transitions
* Buttons
* Cards
* Background effects
* Loading states
* Progress indicators
* Interactive UI elements

React Bits should guide the visual direction of StickCheck.

Do not copy components blindly.

Review each component before adding it to the project.

---

## React Bits Usage Rules

1. Use React Bits components only when they improve usability or visual feedback.
2. Prefer lightweight components.
3. Avoid adding multiple decorative effects to one screen.
4. Do not use animated backgrounds during controller checks if they reduce readability.
5. Do not use effects that reduce controller responsiveness.
6. Ensure components work with Next.js App Router.
7. Ensure components support TypeScript.
8. Ensure components are compatible with Tailwind CSS.
9. Respect reduced-motion preferences.
10. Remove unused component code.
11. Avoid adding a React Bits animation when Anime.js already provides the required behavior.
12. Do not use multiple animation systems for the same UI element.

---

# 18. Recommended React Bits References

Use React Bits as inspiration for the following areas.

## Home Screen

Possible references:

* Animated heading text
* Subtle text reveal
* Interactive button effects
* Minimal background effects

Suggested use:

```text
STICKCHECK

Interactive controller testing

[ START CHECK ]
```

The title may use a subtle text reveal.

Avoid animated text that continuously moves after the page loads.

---

## Controller Status Card

Possible references:

* Animated cards
* Hover effects
* Status indicators
* Border animations

Suggested behavior:

```text
Controller connected

Xbox Wireless Controller

Buttons: 17
Axes: 4
```

The card should animate when a controller connects.

Do not use continuously moving borders.

---

## Button Check

Possible references:

* Interactive buttons
* Press feedback
* Animated prompts
* Score feedback

The button prompt should be large and readable.

Avoid visual effects that make the requested button difficult to identify.

---

## Stick Check

Possible references:

* Interactive cursor effects
* Target animations
* Progress indicators
* Subtle grid backgrounds

The test arena must remain visually simple.

The player cursor and target must always be easy to see.

---

## Trigger Check

Possible references:

* Animated progress bars
* Gradient progress effects
* Loading indicators

The trigger value must remain readable.

Do not use visual effects that hide the actual progress percentage.

---

## Results Screen

Possible references:

* Number counters
* Animated progress bars
* Result cards
* Staggered card reveals

The results must remain readable even when animations are disabled.

---

# 19. Animation Performance Requirements

The application must:

* Maintain responsive controller input.
* Avoid unnecessary layout recalculation.
* Prefer `transform` and `opacity` animations.
* Avoid frequently animating:

  * `width`
  * `height`
  * `top`
  * `left`
  * Large box shadows
* Avoid creating new Anime.js animations inside the controller polling loop.
* Avoid updating React state unnecessarily on every animation frame.
* Use refs for high-frequency visual updates when appropriate.
* Clean up animation scopes when components unmount.
* Avoid running decorative animations during active controller tests.
* Keep cursor and trigger-meter updates low latency.

Preferred animated properties:

```text
transform
opacity
scale
translateX
translateY
```

Avoid:

```text
top
left
width
height
```

when a transform-based alternative is available.

---

# 20. Updated Project Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── check/
│   │   └── page.tsx
│   │
│   └── results/
│       └── page.tsx
│
├── components/
│   ├── animation/
│   │   ├── PageTransition.tsx
│   │   ├── AnimatedScore.tsx
│   │   ├── AnimatedProgress.tsx
│   │   └── AnimatedReveal.tsx
│   │
│   ├── controller/
│   │   ├── ControllerStatus.tsx
│   │   ├── ControllerInfo.tsx
│   │   └── ConnectionIndicator.tsx
│   │
│   ├── checks/
│   │   ├── ButtonCheck.tsx
│   │   ├── StickCalibration.tsx
│   │   ├── StickCheck.tsx
│   │   └── TriggerCheck.tsx
│   │
│   ├── results/
│   │   ├── ScoreCard.tsx
│   │   ├── CheckResultCard.tsx
│   │   └── ControllerRating.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ProgressBar.tsx
│
├── hooks/
│   ├── useGamepad.ts
│   ├── useGamepadConnection.ts
│   ├── useGameLoop.ts
│   └── useReducedMotion.ts
│
├── lib/
│   ├── animations.ts
│   ├── gamepad.ts
│   ├── scoring.ts
│   ├── stickAnalysis.ts
│   └── storage.ts
│
├── types/
│   ├── gamepad.ts
│   └── check.ts
│
└── constants/
    ├── animation.ts
    ├── gamepad.ts
    └── scoring.ts
```

---

# 21. Updated Acceptance Criteria

## Anime.js

* [ ] Anime.js is installed.
* [ ] Anime.js runs only in client-side components.
* [ ] Animation scopes or instances are cleaned up on component unmount.
* [ ] Controller polling does not depend on Anime.js.
* [ ] Controller input remains responsive during animations.
* [ ] No new Anime.js animation is created on every controller polling frame.
* [ ] Score animation does not modify the actual score.
* [ ] Results use animated score and progress reveals.
* [ ] Reduced-motion preferences are respected.
* [ ] Animations use transforms and opacity where practical.
* [ ] Active controller checks remain responsive on lower-powered devices.

## React Bits

* [ ] React Bits is used as a visual reference.
* [ ] Selected patterns improve usability.
* [ ] Decorative effects do not interfere with tests.
* [ ] Added components work with Next.js App Router.
* [ ] Added components are TypeScript-compatible.
* [ ] Unused React Bits code is removed.
* [ ] The application remains usable when animations are disabled.
* [ ] React Bits and Anime.js do not animate the same element simultaneously.

---

# 22. Updated AI Coding Agent Instructions

Use Anime.js for UI motion and React Bits as a design reference.

Follow these implementation rules:

1. Build the controller system before adding animations.
2. Complete Gamepad API detection first.
3. Keep controller logic independent from Anime.js.
4. Add Anime.js only after each check is functionally complete.
5. Use React Bits to select visual patterns, not to define application architecture.
6. Prefer subtle animations over decorative effects.
7. Test controller responsiveness after adding animations.
8. Test with reduced motion enabled.
9. Avoid animation-related performance regressions.
10. Do not add GSAP.
11. Do not add another animation library unless explicitly required.
12. Do not create Anime.js animations inside the Gamepad API polling loop.

Updated implementation order:

```text
Phase 1
- Initialize Next.js
- Configure TypeScript
- Configure Tailwind CSS
- Install Anime.js
- Review React Bits references
- Create the base layout

Phase 2
- Implement controller detection
- Create Gamepad hooks
- Add connection handling
- Add disconnection handling

Phase 3
- Build the functional home page
- Add controller information
- Add check state management

Phase 4
- Build Button Check
- Add button transition detection
- Add scoring
- Add Anime.js input feedback

Phase 5
- Build stick calibration
- Build Stick Check
- Add target detection
- Add center movement analysis
- Add optimized cursor rendering

Phase 6
- Build Trigger Check
- Add unsupported-input handling
- Add animated trigger progress

Phase 7
- Build the scoring system
- Build the results page
- Add Anime.js score count-up
- Add animated result cards

Phase 8
- Add localStorage
- Add error handling
- Add reduced-motion support
- Optimize animation performance
- Run lint
- Run tests
- Run the production build
```

Do not implement decorative animations before the core controller checks work correctly.

The final application must remain functional when:

* Anime.js animations are disabled
* Reduced motion is enabled
* A controller disconnects
* A controller has a custom mapping
* A controller does not expose trigger input
