# Umayyads — Implementation Plan

## Project Structure

Two completely separate projects:

```
working-apps/
├── alomawy/                    ← EXISTING personal app (untouched)
│
└── ummayyads/                  ← NEW company project
    ├── ummayyads_frontend/     ← React + Vite + TypeScript
    └── ummayyads_backend/      ← Express.js + Supabase + Cloudinary
```

---

## Brand Identity

| Property | Value |
|---|---|
| **Brand Name** | Umayyads |
| **Lightest** | `#A7EBF2` |
| **Medium** | `#54ACBF` |
| **Primary** | `#023859` |
| **Secondary** | `#26658C` |
| **Darkest** | `#011C40` |

---

## Design Philosophy

**Production-first. Not a demo.**

- Clean, professional, minimal
- Simple layouts — no complex glass-morphism or heavy animations
- Fast load times, optimized assets
- Easy to update and maintain
- Subtle hover effects, smooth page transitions
- Mobile-first responsive design
- Dark/light mode support
- Accessible (proper contrast, semantic HTML, keyboard nav)

### Style Rules
- **No** heavy backdrop-filter or blur effects
- **No** complex keyframe animations
- **No** gradient text or glitch effects
- **Yes** clean card layouts with subtle shadows
- **Yes** smooth 0.2s hover transitions
- **Yes** consistent spacing and typography
- **Yes** proper color contrast for readability

---

## Phase 1: Project Scaffolding

### 1.1 — Frontend
```bash
cd working-apps
npm create vite@latest ummayyads_frontend -- --template react-ts
cd ummayyads_frontend
npm install
npm install react-router-dom @reduxjs/toolkit react-redux styled-components
npm install i18next react-i18next react-i18next-browser-languagedetector
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons
npm install normalize.css
npm install -D tailwindcss @tailwindcss/vite
```

### 1.2 — Backend
```bash
mkdir ummayyads_backend && cd ummayyads_backend
npm init -y
npm install express cors dotenv @supabase/supabase-js multer multer-storage-cloudinary
```

### 1.3 — Folder Structure

**Frontend:**
```
ummayyads_frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── NotFound.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── TechBar.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── Process.tsx
│   │   │   └── CTA.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Input.tsx
│   ├── data/
│   │   └── services.json
│   ├── locals/
│   │   ├── en/translation.json
│   │   └── ar/translation.json
│   ├── redux/
│   │   ├── store.ts
│   │   └── adminSlice.ts
│   ├── utils/
│   │   ├── i18n.ts
│   │   ├── theme.ts
│   │   └── helpers.ts
│   ├── styles/
│   │   ├── global.ts
│   │   └── variables.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env
```

**Backend:**
```
ummayyads_backend/
├── models/
│   └── Project.js
├── routes/
│   ├── projects.js
│   └── messages.js
├── middleware/
│   └── auth.js
├── uploads/
├── index.js
├── package.json
├── vercel.json
└── .env
```

---

## Phase 2: Theme & Styles

### 2.1 — CSS Variables
**File**: `src/styles/variables.ts`

```ts
export const colors = {
  primary: "#023859",
  secondary: "#26658C",
  accent: "#54ACBF",
  light: "#A7EBF2",
  dark: "#011C40",
  white: "#FFFFFF",
  gray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  }
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem",
};

export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
};
```

### 2.2 — Global Styles
**File**: `src/styles/global.ts`

Clean resets, typography, base element styles.

### 2.3 — Reusable UI Components
**File**: `src/components/ui/`

- `Button.tsx` — primary, secondary, outline variants
- `Card.tsx` — simple card with subtle shadow
- `Badge.tsx` — small labels/tags
- `Input.tsx` — form inputs with labels

---

## Phase 3: Routing & Layout

### 3.1 — Routes
**File**: `src/App.tsx`

| Path | Page |
|---|---|
| `/` | Home |
| `/services` | Services |
| `/portfolio` | Portfolio |
| `/about` | About |
| `/contact` | Contact |
| `/dash` | Admin |
| `*` | NotFound |

### 3.2 — Layout Wrapper
**File**: `src/components/layout/Layout.tsx`

```tsx
<Layout>
  <Header />
  <main>{children}</main>
  <Footer />
</Layout>
```

### 3.3 — Header
Simple top bar: logo left, nav links right, mobile hamburger.

### 3.4 — Footer
Clean 3-column: brand, links, contact. Copyright bottom.

---

## Phase 4: Pages

### 4.1 — Home
**File**: `src/components/pages/Home.tsx`

Sections stacked vertically:
1. **Hero** — headline, subtext, 2 CTA buttons
2. **TechBar** — horizontal row of tech logos
3. **Stats** — 3 number cards (50+, 5+, 99%)
4. **Process** — 5 steps, numbered, simple cards
5. **CTA** — "Ready to start?" banner with button

### 4.2 — Services
Grid of 5 service cards. Each: icon, title, description, tags.

### 4.3 — Portfolio
Category filter bar + project card grid. Fetches from API.

### 4.4 — About
Company info: name, description, mission, values. Simple layout.

### 4.5 — Contact
Form: name, email, message. Submit to API. Success/error states.

### 4.6 — NotFound
Clean "404 — Page not found" with back/home buttons.

---

## Phase 5: Admin Dashboard

### 5.1 — Login
Simple email/password form. Lockout after failed attempts.

### 5.2 — Dashboard
Tab layout: Overview | Projects | Settings

### 5.3 — Projects
Table with search/filter. Add/edit/delete. Image upload.

### 5.4 — Overview
Stat cards + recent projects list.

---

## Phase 6: Backend

### 6.1 — Server
Express + CORS + routes. Port 5000.

### 6.2 — Projects API
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/projects` | No |
| POST | `/api/projects` | Yes |
| PUT | `/api/projects/:id` | Yes |
| DELETE | `/api/projects/:id` | Yes |

### 6.3 — Messages API
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/messages` | Yes |
| POST | `/api/messages` | No |
| DELETE | `/api/messages/:id` | Yes |

### 6.4 — Auth
JWT middleware. Admin user in Supabase.

---

## Phase 7: Translations

Full EN + AR files with all keys. All content via i18n — zero hardcoded text.

---

## Phase 8: Deployment

- **Frontend**: Vercel/Netlify
- **Backend**: Vercel/Railway
- **DB**: Supabase
- **Images**: Cloudinary

---

## Implementation Order

| Step | What | Effort |
|---|---|---|
| 1 | Scaffold projects | Medium |
| 2 | Theme + UI components | Medium |
| 3 | Layout + routing + 404 | Low |
| 4 | Header + Footer | Low |
| 5 | Home page | Medium |
| 6 | Services page | Medium |
| 7 | Portfolio page | Medium |
| 8 | About + Contact | Medium |
| 9 | Admin dashboard | High |
| 10 | Backend API | High |
| 11 | Translations | Medium |
| 12 | Testing | Medium |
| 13 | Deployment | Low |
