# Tasks: Performance Quality System

## Overview
Add a device-capability-based quality toggle system with three levels (low, medium, high) to control transitions, blur effects, and animations across the application. The toggle should be accessible from the actions dropdown in the header.

---

## Task 1: Create Quality Detection Utility

**File:** `src/utils/quality.ts` (new)

- Create a function `detectDeviceCapability()` that evaluates CPU cores (`navigator.hardwareConcurrency`) and approximate RAM (`navigator.deviceMemory` - note: not available in all browsers, fallback to cores only).
- Return a suggested quality level: `"low"`, `"medium"`, or `"high"`.
  - **low**: cores <= 4 OR ram <= 4 (or ram unknown + cores <= 4)
  - **medium**: cores 5-8 OR ram 5-8
  - **high**: cores > 8 AND ram > 8
- Also check `prefers-reduced-motion: reduce` media query -- if set, default to `"low"`.
- Store and retrieve the user's quality choice from `localStorage` (key: `"quality-level"`).
- Export a `getQualityLevel()` function that returns the current level (from localStorage, or auto-detected).
- Export a `setQualityLevel(level)` function that saves to localStorage and applies a CSS class to `<html>` (e.g., `quality-low`, `quality-medium`, `quality-high`).
- Export a `useQuality()` hook (or just use the functions directly in Context).

---

## Task 2: Add Quality State to Global Context

**File:** `src/components/Context.tsx`

- Add `qualityLevel: "low" | "medium" | "high"` to the context type.
- Add `setQualityLevel: (level: "low" | "medium" | "high") => void` to the context type.
- On mount, initialize from `getQualityLevel()` and apply the CSS class to `<html>`.
- When `setQualityLevel` is called, update state, save to localStorage, and update the CSS class on `<html>`.

---

## Task 3: Add Quality Toggle to ActionSelect Dropdown (Mobile)

**File:** `src/components/ActionSelect.tsx`

- Add a new dropdown item "Quality" with a speed/gauge icon (e.g., `faGaugeHigh` or `faSignal`).
- Clicking it should cycle through `low -> medium -> high -> low` (or open a sub-selection).
- Display the current quality level as a label next to the icon (e.g., "Quality: Medium").
- Import and use `useMyContext()` to get/set `qualityLevel`.

---

## Task 4: Add Quality Toggle to ActionsNavbar (Desktop Icons)

**File:** `src/components/ActionsNavbar.tsx`

- Add a new `Navigation_Button` for quality toggle (desktop icon bar).
- Show the current quality level as a tooltip or small badge on hover.
- Click to cycle through `low -> medium -> high`.
- Use a gauge/speed icon.

---

## Task 5: Define Quality Levels CSS Rules

**File:** `src/index.css`

Define CSS rules scoped under `html.quality-low`, `html.quality-medium`, `html.quality-high` that control:

### Blur Levels (backdrop-filter)
| Element | Low | Medium | High (current) |
|---|---|---|---|
| Body (`body`) | `none` | `blur(1px)` | `blur(3px)` |
| Header (`HeaderWrapper`) | `none` | `blur(4px)` | `blur(12px)` |
| Dropdown menus (ActionSelect, PagesSelect) | `none` | `blur(8px)` | `blur(20px)` |
| Footer | `none` | `blur(8px)` | `blur(25px)` |
| Cards (Portfolio, Services, Socials, Landing) | `none` | `blur(4px)` | `blur(10-20px)` |
| Admin Form / Contact Form | `none` | `blur(6px)` | `blur(15-24px)` |
| Dashboard elements | `none` | `blur(4px)` | `blur(4-16px)` |
| Scrollbar thumb | `none` | `blur(2px)` | `blur(4px)` |
| Menu (fullscreen overlay) | `none` | `blur(3px)` | `blur(6px)` |

### Transition Speeds
| Level | Transition Duration |
|---|---|
| Low | `0s` (effectively disabled) |
| Medium | `0.15s` (half speed) |
| High | `0.3s` (full speed, current default) |

### Animations
| Level | Behavior |
|---|---|
| Low | Disable all non-essential animations (`animation: none` on float, glow, fadeIn, etc.) |
| Medium | Keep essential animations (fadeIn for dropdowns), disable decorative ones (float, glow, background orbs) |
| High | All animations enabled (current behavior) |

### Background Decorative Elements
| Level | Behavior |
|---|---|
| Low | Hide `.BackgroundElement` decorative orbs entirely (`display: none`) |
| Medium | Show but reduce opacity/blur |
| High | Full visibility (current) |

---

## Task 6: Apply Quality-Aware Styles to Components

For each component that uses `backdrop-filter`, `transition`, or `animation`, the styles should respond to the `html.quality-*` class. Two approaches (choose one):

### Option A: CSS-Only (Recommended)
Use CSS custom properties set by the quality class, and reference them in styled-components:

```css
html.quality-low {
  --blur-sm: none;
  --blur-md: none;
  --blur-lg: none;
  --transition-speed: 0s;
  --animation-enabled: none;
}
html.quality-medium {
  --blur-sm: blur(2px);
  --blur-md: blur(6px);
  --blur-lg: blur(10px);
  --transition-speed: 0.15s;
  --animation-enabled: auto;
}
html.quality-high {
  --blur-sm: blur(5px);
  --blur-md: blur(12px);
  --blur-lg: blur(20px);
  --transition-speed: 0.3s;
  --animation-enabled: auto;
}
```

Then update each component's styled-components to use `var(--blur-md)` instead of hardcoded `blur(12px)`, etc.

### Option B: Conditional Styled-Components
Pass `qualityLevel` as a prop and conditionally set styles in each component.

**Recommendation:** Use Option A (CSS custom properties) for cleaner code and easier maintenance.

### Files to update (all component files with blur/transition/animation):

1. `src/components/Header.tsx` - backdrop-filter on HeaderWrapper
2. `src/components/ActionSelect.tsx` - backdrop-filter on DropdownMenu, transitions on items
3. `src/components/ActionsNavbar.tsx` - transitions on Navigation_Button
4. `src/components/PagesSelect.tsx` - backdrop-filter on dropdown, transitions
5. `src/components/AboutUs.tsx` - backdrop-filter, ball-animation
6. `src/components/AdminForm.tsx` - backdrop-filter, transitions, shake animation
7. `src/components/ContactUs.tsx` - backdrop-filter on form, transitions
8. `src/components/Dashboard.tsx` - backdrop-filter on form/table, transitions
9. `src/components/Footer.tsx` - backdrop-filter, float/glow animations
10. `src/components/Landing.tsx` - backdrop-filter, float/glow animations, BackgroundElement blur
11. `src/components/Menu.tsx` - backdrop-filter on overlay
12. `src/components/Portfolio.tsx` - backdrop-filter on cards/categories, loader animation
13. `src/components/Services.tsx` - backdrop-filter, scroll-driven animation
14. `src/components/Socials.tsx` - backdrop-filter on cards
15. `src/components/Name.tsx` - blink cursor animation
16. `src/index.css` - body blur, scrollbar blur, global transitions
17. `src/App.css` - translate-x animations

---

## Task 7: Add Translation Keys

**Files:** `src/locals/ar/translation.json`, `src/locals/en/translation.json`

Add translation keys for the quality toggle:
- `"quality.label"` -> "Quality" / "الجودة"
- `"quality.low"` -> "Low" / "منخفض"
- `"quality.medium"` -> "Medium" / "متوسط"
- `"quality.high"` -> "High" / "عالي"

---

## Task 8: Default Quality on First Visit

- On first visit (no localStorage value), auto-detect using `detectDeviceCapability()` and set the default.
- The user can then manually override via the dropdown.
- Store the override in localStorage so it persists across sessions.

---

## Summary of All Files to Create/Modify

| File | Action |
|---|---|
| `src/utils/quality.ts` | **CREATE** - Detection logic, localStorage, CSS class application |
| `src/components/Context.tsx` | **MODIFY** - Add qualityLevel state |
| `src/components/ActionSelect.tsx` | **MODIFY** - Add quality toggle dropdown item |
| `src/components/ActionsNavbar.tsx` | **MODIFY** - Add quality toggle button |
| `src/index.css` | **MODIFY** - Add CSS custom properties for quality levels |
| `src/components/Header.tsx` | **MODIFY** - Use CSS vars for blur |
| `src/components/Footer.tsx` | **MODIFY** - Use CSS vars for blur/animations |
| `src/components/Landing.tsx` | **MODIFY** - Use CSS vars for blur/animations |
| `src/components/Portfolio.tsx` | **MODIFY** - Use CSS vars for blur/animations |
| `src/components/Services.tsx` | **MODIFY** - Use CSS vars for blur/animations |
| `src/components/Socials.tsx` | **MODIFY** - Use CSS vars for blur |
| `src/components/ContactUs.tsx` | **MODIFY** - Use CSS vars for blur |
| `src/components/AdminForm.tsx` | **MODIFY** - Use CSS vars for blur/animations |
| `src/components/Dashboard.tsx` | **MODIFY** - Use CSS vars for blur |
| `src/components/Menu.tsx` | **MODIFY** - Use CSS vars for blur |
| `src/components/Name.tsx` | **MODIFY** - Use CSS vars for animation |
| `src/components/PagesSelect.tsx` | **MODIFY** - Use CSS vars for blur |
| `src/locals/ar/translation.json` | **MODIFY** - Add quality translations |
| `src/locals/en/translation.json` | **MODIFY** - Add quality translations |
