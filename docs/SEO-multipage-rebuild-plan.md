# Elite Junk Solutions — Multi-Page Rebuild Plan (SEO)

**Date:** 2026-06-17
**Goal:** Convert the single-page site into a set of real, indexable URLs so the business can rank across all of Utah County — not just for one page competing against itself.

---

## The core problem

Right now the entire site is one file (`index.html`) at one URL. What look like 7 pages (Home, Services, Pricing, About, Gallery, Reviews, How It Works) are sections toggled with JavaScript. Google only sees **one indexable page**, so every keyword — "junk removal Provo," "appliance removal Orem," "commercial cleanout Lehi" — competes for that single URL. You cannot rank a page for a city it doesn't have.

The fix is to give Google more surface area: dedicated pages, each targeting one intent or one city.

---

## Recommended URL structure

```
/                              → Home (overview, primary CTA)
/services/                     → Services hub
/services/residential-cleanouts/
/services/commercial-cleanouts/
/services/appliance-furniture-removal/
/services/yard-waste-removal/
/services/construction-debris-removal/
/pricing/
/about/
/reviews/
/how-it-works/
/junk-removal-orem/            → City landing pages (highest local-SEO value)
/junk-removal-provo/
/junk-removal-lehi/
/junk-removal-american-fork/
/junk-removal-pleasant-grove/
... (one per served city)
```

City pages are the biggest lever. Each should have unique copy (not duplicated) — local landmarks, neighborhoods served, a city-specific testimonial if available, and the same conversion CTA.

---

## Per-page SEO checklist

Each new page needs:

- Exactly **one** `<h1>` containing the target keyword (e.g., "Junk Removal in Provo, Utah")
- A unique `<title>` (~55–60 chars) and meta description (~150 chars)
- A unique canonical tag pointing to itself (absolute, www version)
- The LocalBusiness JSON-LD (can be shared sitewide; add a `Service` schema per service page)
- Internal links to/from the home page and related pages
- The lead form (reuse the existing Supabase-connected form)

---

## Technical approach options

**Option A — Static multi-page (simplest, fits current setup).**
Split `index.html` into separate `.html` files sharing the same CSS. Keep hosting as-is. Lowest effort, no framework. Downside: shared header/footer must be duplicated or templated at build time.

**Option B — Static site generator (Astro / Eleventy).**
Author shared layout once, generate all city/service pages from a data file. Best balance of maintainability and SEO. Recommended if adding 10+ city pages.

**Option C — Next.js.**
Most powerful (you're already familiar with it), but heavier than this brochure site needs. Reasonable if you want the site and a future dashboard under one app.

Recommendation: **Option B (Eleventy or Astro)** — city pages are templated from data, so adding a new city is one line.

---

## Migration safety (don't lose current rankings)

1. Keep `/` as home; don't change its URL.
2. Add a proper `sitemap.xml` listing every new URL (the current one-URL sitemap is a placeholder).
3. Submit the updated sitemap in Google Search Console.
4. If any old anchor URLs were shared/linked (e.g. `/#pricing`), they still resolve to home — fine.
5. Request indexing on the new key pages in Search Console after launch.

---

## Priority order

1. **Google Business Profile first** — for a local service business this outranks website changes. Claim it, set service area to Utah County, add photos, start collecting reviews.
2. City landing pages (Orem, Provo, Lehi, American Fork first — highest population/demand).
3. Service detail pages.
4. Pricing / About / Reviews / How It Works as standalone pages.

---

## Already completed (2026-06-17)

- LocalBusiness JSON-LD schema added to `index.html`
- Open Graph + Twitter card tags added
- Canonical fixed to www
- Consolidated to a single `<h1>`
- `sitemap.xml` + `robots.txt` created
- Google review button wired up (needs Place ID pasted in)
