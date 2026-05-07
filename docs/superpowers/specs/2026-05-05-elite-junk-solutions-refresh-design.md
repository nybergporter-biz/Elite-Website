# Elite Junk Solutions — Website Refresh Design Spec
**Date:** 2026-05-05
**Approach:** B — Structural Refresh
**Scope:** Single file (`index copy.html`) — all changes in-place, no new files

---

## Summary

A focused refresh of the existing 7-page website targeting conversion improvements, trust signals, and visual polish. No new pages. No structural page additions. Photo placeholder sections are designed for easy drop-in replacement once real photos are available.

---

## 1. Typography

**Change:** Add Playfair Display as the display/heading font. Inter remains the body font.

**Implementation:**
- Add `Playfair Display` to the Google Fonts `<link>` (weights: 700 regular, 400 italic, 700 italic)
- Update existing `.t-hero`, `.t-display`, `.t-heading` CSS classes to use `'Playfair Display', Georgia, serif` (no new classes needed)
- Apply to: all elements using those classes — `h1`, `h2`, hero headline, section headings
- Body text, labels, buttons, nav links remain Inter

---

## 2. Navigation

**Change:** Reduce from 8 nav items to 5 visible links + CTA button.

**New nav order:** Services · Pricing · About · Reviews · How It Works · [Get a Quote]

**Gallery:** Remove from main nav. Add a "See Our Work →" link inside the About page and as a subtle text link in the homepage services section.

**Mobile menu:** Same 5 links + Gallery as a secondary link below the fold + call number.

---

## 3. Hero Stats Row

**Change:** Rewrite 3 stats to honest value propositions. No fabricated numbers.

| Current | New |
|---|---|
| 100% · Upfront pricing | Free · Upfront estimate |
| Same day · Often available | Same day · Often available (keep) |
| Local · South Jordan, UT | $0 · Hidden fees |

Layout, styling, and position unchanged.

---

## 4. Trust Bar

**Change:** Add a small headline above the existing customer-type chips.

**New headline:** `TRUSTED BY SOUTH JORDAN HOMEOWNERS & PROFESSIONALS` (styled as `.t-label` uppercase, centered, above the chips)

Chips remain the same: Homeowners · Realtors · Property Managers · Contractors · HOAs · Landlords.

---

## 5. Promises Section — SVG Icons

**Change:** Replace the 4 emoji icons (💰 ⏰ 🧹 ⚡) with inline SVG icons matching the design system style used elsewhere (stroke-width 1.75, 24×24 viewBox).

| Promise | Icon to use |
|---|---|
| Upfront Pricing | Dollar sign / tag SVG |
| On-Time Arrival | Clock SVG |
| We Sweep Up | Sparkles SVG (Heroicons has no broom — sparkles conveys "clean") |
| Same-Day Available | Lightning bolt SVG |

Icon containers: match `.svc-icon` style — 46×46px, `var(--navy-50)` background, `var(--navy-500)` stroke.

---

## 6. How It Works — Condense to 3 Steps

**Change:** Reduce from 5 steps to 3 cleaner steps. Both the homepage preview and the How It Works page.

| # | Title | Body |
|---|---|---|
| 01 | Contact us | Call, text, or submit the form. Include photos for the most accurate estimate. Same-day? Call directly. |
| 02 | We arrive & confirm | On-site, we confirm the final price before lifting a finger. No surprises, ever. |
| 03 | Done | We haul everything away, sweep the area, and collect payment after you're satisfied. |

Remove the "How to prepare" prep tip box from the How It Works page (good content — move it to a compact callout on the Quote page instead).

---

## 7. Quote Page — Split Layout

**Change:** Redesign the quote page from a single-column centered form to a two-column split layout.

**Left column (navy panel, `var(--navy-900)` background):**
- Eyebrow label: "Free Estimate"
- Heading (Playfair Display): "We'll get back to you fast."
- 3 promise items with checkmark icons:
  - Free upfront estimate — No obligation to book.
  - Response within 24 hrs — Often same day.
  - $0 hidden fees — Price confirmed on-site.
- Horizontal rule
- Contact shortcuts:
  - 📞 Need same-day? **(801) 441-5090**
  - 💬 Text us a photo for the fastest quote
- Prep tip callout (moved from How It Works): compact bullet list of 4 tips

**Right column (white, form):**
- Title: "Request a Quote" (Playfair Display)
- Subtitle: "We respond within 24 hours."
- Form fields (in order):
  1. Name + Phone (row)
  2. **Email** (new field — full width)
  3. Address
  4. Service Type (select)
  5. Preferred Date + Preferred Time (row)
  6. Photo Upload (optional)
  7. Additional Notes (textarea)
  8. Submit button (full width, orange)
- Success message unchanged

**Mobile behavior:** Left panel stacks above form. Left panel collapses to a compact chip strip (3 chips: Free estimate · Same-day · $0 fees).

**Also:** Add email field to the **hero form card** (between Phone and Service).

---

## 8. Reviews Page — Expand to 9 Reviews

**Change:** Add 3 new review cards to the existing 6, for a total of 9.

**New reviews to add:**

| Name | Type | Text |
|---|---|---|
| Kevin B. | Contractor | "Called for construction debris after a bathroom gut. They came next morning, loaded everything fast, and swept the site. Exactly what I needed — will be using them on every job." |
| Rachel S. | Landlord | "My tenant left the unit absolutely full of junk. One call to Elite Junk Solutions and it was cleared out within two days. Couldn't be easier." |
| Tom W. | Homeowner | "Cleared out 20 years of stuff from the garage in one shot. The guys were professional, careful not to damage walls or flooring, and left it cleaner than they found it." |

**Leave a Review button:** Change `href="#"` to `href="#google-review-link"` and add an HTML comment: `<!-- TODO: Replace with your Google Business review link when ready -->`.

---

## 9. Service Area Detail

**Change:** Add a neighborhood/city list to two locations:

1. **About page** — below business hours, a new "Service Area" subsection
2. **Services page** — add to the page-hero subtitle

**Cities to list:** South Jordan · Herriman · Riverton · Draper · Sandy · West Jordan · Murray · Midvale

**Format:** Pill-style tags matching the `.item-tag` style, or inline comma-separated with a "& surrounding areas" suffix. Use inline on Services page (space-constrained), pills on About page.

---

## 10. Eco / Recycling Messaging

**Change:** Add brief sustainability messaging in two places.

1. **Services page** — new sentence in the page-hero paragraph: "When possible, we donate usable items to local charities and recycle materials responsibly."

2. **About page** — add a 7th `.why-item` in the "Why Choose Us" grid:
   - Title: "Eco-responsible disposal"
   - Body: "We donate usable items and recycle when possible — keeping as much as we can out of the landfill."

---

## 11. Gallery Page

**Change:** Remove from main nav (already covered in §2). No content changes to the page itself. Add "See Our Work →" link to:
- About page: below the about-grid section
- Homepage services section: a subtle text link below the "View all services →" button

---

## Out of Scope

- Real team/owner photos (to be added when available)
- Real before/after job photos (to be added when available)
- Google Business profile link (to be added when created)
- Hero background photo change (keeping mountain photo for now)
- Actual form submission backend (forms simulate submission as they do now)

---

## Files Changed

| File | Change |
|---|---|
| `index copy.html` | All changes — single file, inline styles |

No new files, no new dependencies beyond adding Playfair Display to the existing Google Fonts import.
