# Tasks: Admin Panel & Statistics

## Part 1: Scale Dashboard to Full Admin Panel

### Overview
Transform the current Dashboard (project CRUD only) into a full admin panel with tab-based navigation that controls all pages and data.

---

### Task 1: Admin Panel Layout & Navigation

**File:** `src/components/Dashboard.tsx` (major refactor)

Replace the current single-page layout with a tabbed admin panel:

- **Sidebar/Tab bar** with sections:
  - Overview (stats summary)
  - Projects (current CRUD)
  - Statistics (charts and insights)
  - Site Settings (future)
- Each tab renders its own content area
- Active tab highlighted with `--main-color`
- Mobile: horizontal scrollable tabs or hamburger menu
- Add a **Logout button** in the panel header (dispatches `signOut`, clears session from localStorage)

---

### Task 2: Projects Tab (Refine Current)

**File:** `src/components/Dashboard.tsx`

Enhance the existing project management section:

- Add **search bar** to filter projects by title
- Add **filter dropdown** to filter by type (website, game, simple, dashboard, app)
- Add **sort options** (newest, oldest, highest rated, alphabetical)
- Add **project count badge** showing total / filtered count
- Keep existing add/edit/delete functionality

---

### Task 3: Overview Tab (Dashboard Home)

**File:** `src/components/Dashboard.tsx` (or new `AdminOverview.tsx`)

Quick summary cards when admin first enters the panel:

- **Total Projects** count (big number card)
- **Projects by Type** mini breakdown (website: 5, game: 3, etc.)
- **Average Rating** across all projects
- **Most Used Technology** (top 1)
- **Recent Projects** list (last 5 added)
- All computed client-side from the fetched projects array

---

### Task 4: Site Settings Tab (Placeholder)

**File:** `src/components/Dashboard.tsx` (or new `AdminSettings.tsx`)

Placeholder for future settings management:

- Section title: "Site Settings"
- Placeholder cards for future features:
  - Social media links management
  - Contact form messages
  - Site metadata (title, description)
  - Footer content management
- Each card shows "Coming Soon" state
- This is a structural placeholder -- no backend changes needed yet

---

## Part 2: Statistics Page

### Overview
A dedicated statistics tab in the admin panel with charts and data insights computed from the projects data.

---

### Task 5: Statistics Tab Layout

**File:** `src/components/Dashboard.tsx` (or new `AdminStatistics.tsx`)

Layout for the statistics section:

- Grid of stat cards at the top (key metrics)
- Chart sections below (2-column on desktop, stacked on mobile)
- All data computed client-side from `GET /api/projects` response
- No new backend endpoints needed -- all stats derived from existing data

---

### Statistics Ideas -- Pick What You Want

Below are all the statistics we **could** include. Each is grouped by category.
Tell me which ones to implement.

---

#### Category A: Project Overview

| # | Statistic | Description | Visualization |
|---|-----------|-------------|---------------|
| A1 | **Total Projects** | Simple count of all projects | Big number card |
| A2 | **Projects by Type** | Count per category (website, game, simple, dashboard, app) | Donut/pie chart or horizontal bars |
| A3 | **Projects by Language** | Count per language (arabic, english, mixed) | Pie chart or tag badges |
| A4 | **Projects Over Time** | Projects created per month/year | Line or bar chart (timeline) |
| A5 | **Projects with Images vs Without** | Ratio of projects that have an image | Two stat cards or progress bar |

---

#### Category B: Technology Insights

| # | Statistic | Description | Visualization |
|---|-----------|-------------|---------------|
| B1 | **Most Used Technologies** | Top 10 technologies across all projects | Horizontal bar chart (ranked) |
| B2 | **Technology Usage Heatmap** | All 22 technologies ranked by usage frequency | Color-coded grid or bars |
| B3 | **Languages vs Technologies** | Which techs are used more in Arabic vs English projects | Grouped bar chart |
| B4 | **Average Techs per Project** | Mean number of technologies used per project | Single number card |

---

#### Category C: Rating Analytics

| # | Statistic | Description | Visualization |
|---|-----------|-------------|---------------|
| C1 | **Average Rating** | Mean rating across all projects | Big number card with color indicator |
| C2 | **Rating Distribution** | Bucket ratings into ranges (0-20, 21-40, 41-60, 61-80, 81-100) | Bar chart (histogram) |
| C3 | **Highest Rated Projects** | Top 5 projects by rating | Ranked list with stars |
| C4 | **Rating by Type** | Average rating per project category | Grouped bar chart |
| C5 | **Rating by Technology** | Average rating for projects using each tech | Bar chart |

---

#### Category D: Developer Insights

| # | Statistic | Description | Visualization |
|---|-----------|-------------|---------------|
| D1 | **Projects per Developer** | Count of projects per developer name | Bar chart or leaderboard |
| D2 | **Developer Activity Timeline** | When each developer added projects | Stacked area or line chart |
| D3 | **Top Developer** | Developer with most projects | Stat card with name |

---

#### Category E: Content Analysis

| # | Statistic | Description | Visualization |
|---|-----------|-------------|---------------|
| E1 | **Idea Source Distribution** | Where project ideas come from (grouped by source field) | Pie chart or word cloud |
| E2 | **Projects with Visit Links** | Ratio of projects that have a live demo URL | Progress bar or two cards |
| E3 | **Average Description Length** | Mean character count of project descriptions | Single number card |
| E4 | **Most Common Project Titles** | Words that appear most in project titles | Word cloud or top-10 list |

---

#### Category F: Growth & Trends

| # | Statistic | Description | Visualization |
|---|-----------|-------------|---------------|
| F1 | **Cumulative Growth** | Total projects over time (running count) | Area chart |
| F2 | **Most Active Month** | Month with the most project additions | Stat card |
| F3 | **Projects Added This Month vs Last** | Month-over-month comparison | Two cards with percentage change |
| F4 | **Growth Rate** | Average projects added per month | Single number card |

---

### Task 6: Translation Keys for Statistics

**Files:** `src/locals/en/translation.json`, `src/locals/ar/translation.json`

Add translation keys for whichever statistics are chosen:
- Tab labels: "Overview", "Projects", "Statistics", "Settings"
- Stat labels: "Total Projects", "Average Rating", "Most Used Technology", etc.
- Chart labels and legends
- Filter/sort labels
- "Coming Soon" for placeholder settings

---

## Summary of Files to Create/Modify

| File | Action |
|---|---|
| `src/components/Dashboard.tsx` | **MAJOR REFACTOR** - Tab-based admin panel layout |
| `src/components/AdminOverview.tsx` | **CREATE** - Overview tab with summary cards |
| `src/components/AdminStatistics.tsx` | **CREATE** - Statistics tab with charts |
| `src/components/AdminSettings.tsx` | **CREATE** - Settings tab (placeholder) |
| `src/locals/en/translation.json` | **MODIFY** - Add admin panel + statistics translations |
| `src/locals/ar/translation.json` | **MODIFY** - Add admin panel + statistics translations |
| `src/redux/adminSign.ts` | **MODIFY** - Add signOut action (already done in parallel task) |

---

## Charting Library Options

For the statistics charts, we need a lightweight charting library. Options:

1. **recharts** - Most popular for React, declarative, ~45KB gzipped
2. **chart.js + react-chartjs-2** - Classic, flexible, ~65KB gzipped
3. **CSS-only charts** - No library, use styled divs for simple bars/progress (0KB, limited)

Recommendation: **recharts** for clean React integration, or **CSS-only** if you want zero dependencies.
