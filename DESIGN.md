# Design System — Sky n Soul

## 1. Visual Theme & Atmosphere

Sky n Soul is a **warm, calm, premium artisanal e-commerce** brand for handmade heirloom baby and nursery keepsakes. The experience should feel like opening a carefully wrapped gift: soft light, natural textures, generous breathing room, and emotional storytelling without visual noise.

The canvas is a warm off-white (`#FAFAF8`) rather than cold pure white. Photography does most of the heavy lifting — chunky knits, wood, yarn, linen, and nursery lifestyle shots. Color bands use pale sky blue (`#C3D4E4`) for soft editorial moments and deep chocolate (`#4b3222`) for the footer bookend. Accents of earth brown (`#80592C`) and sage (`#889A6F`) appear sparingly on links, labels, and trust signals.

Typography carries the brand voice: elegant serif display for headlines and quotes; clean uppercase sans for navigation and CTAs. Interactions stay quiet — underlined text links, subtle hover fades, whisper-soft card lift. No loud gradients, neon, or heavy chrome.

**Key Characteristics:**
- Warm cream canvas (`#FAFAF8`) with chocolate text (`#4b3222`)
- Photography-first lifestyle aesthetic (knit, wood, soft textiles)
- Serif display + uppercase sans labels
- Text-link CTAs with arrow (`→`) as the signature action style
- White category label overlays on image cards
- Generous section padding (80–120px) and quiet elevation
- Color-block rhythm: cream → white → sky → cream → chocolate footer

---

## 2. Color Palette & Roles

### Primary Brand

- **Chocolate** (`#4b3222`): Primary body text, dark surfaces, footer background, high-contrast icons
- **Earth** (`#80592C`): Headings accents, text links, primary brand accent aligned with logo nest/wordmark
- **Sky** (`#C3D4E4`): Soft section backgrounds, announcement bar option, editorial banner wash (matches logo birds)
- **Sage** (`#889A6F`): Secondary accent, badges, hover states, value-prop icons (matches logo leaves)

### Surface & Background

- **Canvas** (`#FAFAF8`): Primary page background — warm off-white, never cold `#FFFFFF` as full-page canvas
- **White** (`#FFFFFF`): Cards, category label pills, form inputs, product surfaces
- **Chocolate** (`#4b3222`): Footer and optional dark feature bands

### Text

- **Text Primary**: Chocolate `#4b3222`
- **Text Secondary**: Earth `#80592C` at ~85% opacity, or chocolate at 70% for captions
- **Text on Dark**: White `#FFFFFF` / soft white at 70% for footer secondary links
- **Text on Sky**: Chocolate `#4b3222`

### Semantic (sparing)

- **Success / Affirmation**: Sage `#889A6F`
- **Error**: Soft brick `#A63D2F` (use only for form validation; never as brand decoration)

### Gradient System

No structural gradients. Surfaces are solid color-block. Photography and whitespace create depth.

---

## 3. Typography Rules

### Font Family

- **Display / Editorial:** `Cormorant Garamond, Georgia, serif` — headlines, hero, brand story quotes, product names, testimonials
- **UI / Labels:** `Inter, system-ui, sans-serif` — navigation, CTAs, prices, form labels, footer meta
- Loaded via `next/font` as `--font-cormorant` and `--font-inter`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Cormorant | 48–72px | 500–600 | 1.1 | -0.01em | Homepage hero |
| Section Title | Cormorant | 32–40px | 500 | 1.2 | 0 | Brand story, featured |
| Quote | Cormorant | 28–36px | 500 | 1.35 | 0 | Centered editorial |
| Body Editorial | Cormorant | 18–20px | 400 | 1.7 | 0 | Story paragraphs |
| Product Name | Cormorant | 18–20px | 500 | 1.3 | 0 | Product cards |
| Nav / CTA Label | Inter | 11–13px | 500 | 1.2 | 0.12–0.18em | ALL CAPS |
| Body UI | Inter | 14–16px | 400 | 1.5 | 0 | Forms, footer |
| Price / Meta | Inter | 13–14px | 500 | 1.2 | 0.04em | Product price |

### Principles

- Serif carries emotion; sans carries navigation and commerce clarity
- Nav and CTAs are uppercase with generous tracking
- Never mix decorative scripts into shopping UI
- Body text prefers chocolate over pure black for warmth

---

## 4. Component Stylings

### Buttons

**1. Text Link CTA (signature) — "DISCOVER THE COLLECTION →"**
- Background: transparent
- Text: Chocolate or Earth
- Underline: 1px solid currentColor, offset 4–6px
- Font: Inter, 12px, weight 500, uppercase, tracking `0.14em`
- Hover: color shifts to Earth / Sage; underline remains
- Used in hero and editorial bands

**2. Soft Filled — Newsletter submit**
- Background: Chocolate `#4b3222`
- Text: White
- Radius: 0 (sharp) or 2px max — refined, not pill-heavy
- Padding: `14px 28px`
- Hover: Earth `#80592C`

**3. Category Label Overlay**
- Background: White
- Text: Chocolate
- Padding: `12px 20px`
- Font: Inter uppercase tracked
- Positioned bottom-center of image cards with trailing `→`
- Hover: slight `translateY(-2px)` and soft shadow

### Cards

**Category Card**
- Full-bleed image, aspect ~4/5 or 3/4
- No border; optional whisper shadow on hover
- White label pill centered near bottom

**Product Card**
- Image on white/canvas, product name (serif), price (sans)
- Hover: image slight scale `1.03`, 400ms ease
- No loud badges unless “Gift Ready” in sage

### Inputs

- Border: 1px solid Earth/Chocolate at 25% opacity
- Background: White
- Focus: border Earth or Sage, outline none, soft ring optional
- Radius: 0–2px
- Newsletter: horizontal input + filled button on desktop; stack on mobile

### Navigation

**Announcement Bar**
- Full width, Sky or Sage wash, Inter 12px centered text, chocolate text

**Header**
- Sticky, canvas/white background, soft bottom border or whisper shadow after scroll
- Logo left (nest mark + wordmark when space allows)
- Center nav: uppercase Inter links separated by thin pipes `|`
- Right: search + bag outline icons (stroke chocolate)
- Mobile: hamburger → full-height drawer with stacked links

**Footer**
- Background Chocolate, text White / soft white
- Multi-column: Shop, Care, Newsletter echo, social
- Logo mark may invert or sit as light mark on dark

---

## 5. Layout Principles

- **Max content width:** ~1280px (`max-w-7xl`), centered with horizontal padding `1.25rem` → `2rem` → `3rem`
- **Section vertical rhythm:** `5rem` mobile / `7.5rem` desktop between major bands
- **Grid:** Category 1 → 2 → 4 columns; Products 2 → 4 columns
- **Whitespace philosophy:** Prefer empty cream space over dividers; dividers only when necessary and hairline
- **Hero:** Full-bleed image with left-aligned copy overlay (desktop); stack text below or over with gradient scrim on mobile for readability

---

## 6. Depth & Elevation

- Default surfaces are flat
- Card hover: `0 8px 24px rgba(75, 50, 34, 0.08)`
- Sticky header after scroll: `0 1px 0 rgba(75, 50, 34, 0.08)`
- No heavy drop shadows, glassmorphism, or neon glow
- Depth comes from photography contrast and color-band sequencing

---

## 7. Do's and Don'ts

### Do
- Use warm canvas `#FAFAF8` as the page background
- Keep CTAs quiet: underlined uppercase text with `→`
- Pair Cormorant headlines with Inter UI labels
- Let lifestyle photography dominate category and hero sections
- Use Sky for soft editorial bands and Chocolate for footer
- Maintain generous padding and calm pacing

### Don't
- Don't use cold pure white as the full-page canvas
- Don't introduce bright primary blues, reds, or neon accents
- Don't use thick borders, busy patterns, or loud gradients
- Don't make pill-shaped “app” buttons the default CTA style
- Don't crowd sections — avoid dense marketplace density
- Don't use pure black `#000000` for body text on light surfaces

---

## 8. Responsive Behavior

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | < 768px | Hamburger nav; hero stacks; categories 1-col; products 2-col; newsletter stacks |
| Tablet | 768–1023px | Categories 2-col; products 2-col; centered nav may wrap or hide into menu |
| Desktop | 1024px+ | Full pipe nav; categories 4-col; products 4-col; hero overlay left |

### Touch Targets
- Icons and nav items ≥ 44px tap area
- Category labels large enough for thumb tap

### Collapsing Strategy
- Pipe-separated desktop nav → drawer on mobile
- Editorial split → stacked image then copy
- Footer columns → stacked accordion-free vertical lists

---

## 9. Agent Prompt Guide

### Quick Color Reference
- Page canvas: Canvas `#FAFAF8`
- Text: Chocolate `#4b3222`
- Accent / links: Earth `#80592C`
- Soft band: Sky `#C3D4E4`
- Secondary accent: Sage `#889A6F`
- Cards / overlays: White `#FFFFFF`
- Footer: Chocolate `#4b3222` with white text

### Ready-to-use prompts
- “Build a Sky n Soul section using DESIGN.md — warm canvas, Cormorant headline, Inter uppercase CTA with arrow.”
- “Add a product grid with quiet cards, serif names, Inter prices, and soft hover lift.”
- “Create a chocolate footer with shop/care columns matching DESIGN.md tokens.”

### Homepage section order
AnnouncementBar → Header → Hero → BrandStory → CategoryGrid → ValueProps → FeaturedProducts → EditorialBanner → Testimonials → Newsletter → Footer
