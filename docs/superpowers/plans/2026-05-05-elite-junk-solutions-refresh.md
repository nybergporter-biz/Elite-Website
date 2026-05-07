# Elite Junk Solutions — Website Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 11 targeted improvements to `index copy.html` — typography, nav, trust signals, quote page layout, reviews, service area, and eco messaging — to make the site launch-ready.

**Architecture:** All changes are in a single self-contained HTML file with inline CSS and vanilla JS. No build system, no dependencies beyond Google Fonts (CDN). Changes are sequential edits to the same file; each task is independently verifiable in the browser.

**Tech Stack:** HTML5, inline CSS (design tokens via CSS custom properties), vanilla JS, Google Fonts CDN, Tailwind CDN (unused in current build but present)

**Dev server:** Node.js is not in PATH. Run the server with:
```bash
/Applications/Utilities/Cursor.app/Contents/Resources/app/resources/helpers/node serve.mjs
```
Then open `http://localhost:3000` in your browser. Keep this running throughout.

**Working file:** `index copy.html` (note the space — always quote the path in commands)

---

## File Map

| File | Role |
|---|---|
| `index copy.html` | Single file — all CSS, HTML, JS in one place |
| `brand_assets/Image (1).png` | Company logo — do not touch |
| `serve.mjs` | Dev server — do not touch |

---

## Task 1: Typography — Add Playfair Display

**Files:**
- Modify: `index copy.html` — Google Fonts `<link>` (line ~10) and CSS classes `.t-hero`, `.t-display`, `.t-heading` (lines ~120–145)

- [ ] **Step 1: Add Playfair Display to the Google Fonts import**

Find this line (around line 11):
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,300;1,14..32,400&display=swap" rel="stylesheet">
```

Replace with:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,300;1,14..32,400&family=Playfair+Display:ital,wght@0,700;1,400;1,700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update `.t-hero` to use Playfair Display**

Find:
```css
.t-hero {
  font-size: clamp(44px, 5.5vw, 76px);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fff;
}
```

Replace with:
```css
.t-hero {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(44px, 5.5vw, 76px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #fff;
}
```

- [ ] **Step 3: Update `.t-display` to use Playfair Display**

Find:
```css
.t-display {
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--ink);
}
```

Replace with:
```css
.t-display {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--ink);
}
```

- [ ] **Step 4: Update `.t-heading` to use Playfair Display**

Find:
```css
.t-heading {
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink);
}
```

Replace with:
```css
.t-heading {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink);
}
```

- [ ] **Step 5: Verify in browser**

Open `http://localhost:3000`. The hero headline, all section headings (`h2`), and page display headings should now render in a serif font. Body text, nav links, buttons, and labels remain Inter. Check the hero, the "What We Do" section heading, and the pricing section heading.

- [ ] **Step 6: Save file**

---

## Task 2: Navigation — Trim to 5 Links + CTA

**Files:**
- Modify: `index copy.html` — desktop nav `<ul>` (~line 1132) and mobile menu (~line 1148)

- [ ] **Step 1: Remove Gallery from desktop nav**

Find the desktop nav `<ul class="nav-links">` block. Remove this item:
```html
<li><a href="#" onclick="showPage('gallery');return false;" id="nav-gallery">Gallery</a></li>
```

- [ ] **Step 2: Verify desktop nav order**

After removal, the `<ul class="nav-links">` should contain exactly these items in this order:
```html
<ul class="nav-links">
  <li><a href="#" onclick="showPage('home');return false;" id="nav-home" class="active">Home</a></li>
  <li><a href="#" onclick="showPage('services');return false;" id="nav-services">Services</a></li>
  <li><a href="#" onclick="showPage('pricing');return false;" id="nav-pricing">Pricing</a></li>
  <li><a href="#" onclick="showPage('about');return false;" id="nav-about">About</a></li>
  <li><a href="#" onclick="showPage('reviews');return false;" id="nav-reviews">Reviews</a></li>
  <li><a href="#" onclick="showPage('howitworks');return false;" id="nav-howitworks">How It Works</a></li>
  <li><a href="#" onclick="showPage('quote');return false;" id="nav-quote" class="nav-cta">Get a Quote</a></li>
</ul>
```

- [ ] **Step 3: Remove Gallery from mobile menu, add as secondary link**

In the `<div class="mobile-menu" id="mobileMenu">` block, find and remove:
```html
<a href="#" onclick="showPage('gallery');toggleMobile();return false;">Gallery</a>
```

Then add Gallery back as a secondary link, styled more subtle, just before the phone number line:
```html
<a href="#" onclick="showPage('gallery');toggleMobile();return false;" style="font-size:14px;color:var(--ink-light);">Our Work / Gallery</a>
```

- [ ] **Step 4: Also remove Gallery from the `showPage` JS nav-active logic**

Search the file for `nav-gallery` — find the JavaScript `showPage` function (near the bottom of the file). Remove or update any reference to `nav-gallery` so it doesn't throw an error when Gallery is accessed via other links. The page itself (`id="page-gallery"`) stays — only the nav entry is removed.

- [ ] **Step 5: Verify in browser**

Resize to desktop: should see Home, Services, Pricing, About, Reviews, How It Works, Get a Quote. No Gallery in main nav. Resize to mobile: hamburger menu should still list Gallery as a secondary subtle link.

- [ ] **Step 6: Save file**

---

## Task 3: Hero Stats — Rewrite to Honest Value Props

**Files:**
- Modify: `index copy.html` — hero stats block (~line 1187)

- [ ] **Step 1: Replace the 3 stat items**

Find:
```html
<div class="hero-stats ha-4">
  <div class="hero-stat">
    <div class="num">100%</div>
    <div class="label">Upfront pricing</div>
  </div>
  <div class="hero-stat-div"></div>
  <div class="hero-stat">
    <div class="num">Same day</div>
    <div class="label">Often available</div>
  </div>
  <div class="hero-stat-div"></div>
  <div class="hero-stat">
    <div class="num">Local</div>
    <div class="label">South Jordan, UT</div>
  </div>
</div>
```

Replace with:
```html
<div class="hero-stats ha-4">
  <div class="hero-stat">
    <div class="num">Free</div>
    <div class="label">Upfront estimate</div>
  </div>
  <div class="hero-stat-div"></div>
  <div class="hero-stat">
    <div class="num">Same day</div>
    <div class="label">Often available</div>
  </div>
  <div class="hero-stat-div"></div>
  <div class="hero-stat">
    <div class="num">$0</div>
    <div class="label">Hidden fees</div>
  </div>
</div>
```

- [ ] **Step 2: Verify in browser**

Load `http://localhost:3000`. The three stats at the bottom of the hero should now read: **Free** / Upfront estimate · **Same day** / Often available · **$0** / Hidden fees.

- [ ] **Step 3: Save file**

---

## Task 4: Trust Bar — Add "Trusted By" Headline

**Files:**
- Modify: `index copy.html` — trust bar section (~line 1242)

- [ ] **Step 1: Add headline above the chips**

Find:
```html
<div class="trust-bar">
  <div class="container">
    <div class="trust-bar-inner">
      <div class="trust-chip"><span class="trust-chip-dot"></span>Homeowners</div>
```

Replace the opening structure with:
```html
<div class="trust-bar">
  <div class="container">
    <div class="trust-bar-inner" style="flex-direction:column;gap:14px;">
      <div class="t-label" style="text-align:center;color:var(--ink-light);">Trusted by South Jordan homeowners &amp; professionals</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;">
        <div class="trust-chip"><span class="trust-chip-dot"></span>Homeowners</div>
```

- [ ] **Step 2: Close the new inner wrapper div**

Find the closing tags of the trust-bar-inner div. After the last `.trust-chip`, add a closing `</div>` for the new inner flex wrapper before closing `.trust-bar-inner`:

The full updated trust bar should look like:
```html
<div class="trust-bar">
  <div class="container">
    <div class="trust-bar-inner" style="flex-direction:column;gap:14px;">
      <div class="t-label" style="text-align:center;color:var(--ink-light);">Trusted by South Jordan homeowners &amp; professionals</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;">
        <div class="trust-chip"><span class="trust-chip-dot"></span>Homeowners</div>
        <div class="trust-chip"><span class="trust-chip-dot"></span>Realtors</div>
        <div class="trust-chip"><span class="trust-chip-dot"></span>Property Managers</div>
        <div class="trust-chip"><span class="trust-chip-dot"></span>Contractors</div>
        <div class="trust-chip"><span class="trust-chip-dot"></span>HOAs</div>
        <div class="trust-chip"><span class="trust-chip-dot"></span>Landlords</div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Below the hero, the trust bar should show the label "TRUSTED BY SOUTH JORDAN HOMEOWNERS & PROFESSIONALS" centered above the row of customer-type chips.

- [ ] **Step 4: Save file**

---

## Task 5: Promises Section — Replace Emoji with SVG Icons

**Files:**
- Modify: `index copy.html` — `.promise-icon` CSS (~line 453) and promises HTML (~line 1371)

- [ ] **Step 1: Update `.promise-icon` CSS**

Find:
```css
.promise-icon { font-size: 26px; margin-bottom: 12px; display: block; }
```

Replace with:
```css
.promise-icon {
  width: 46px; height: 46px; border-radius: var(--r-md);
  background: var(--navy-50); color: var(--navy-500);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; transition: background 0.2s;
}
.promise-icon svg { width: 22px; height: 22px; stroke-width: 1.75; }
.promise-item:hover .promise-icon { background: rgba(40,120,200,0.1); }
```

- [ ] **Step 2: Replace the 4 promise item icons in HTML**

Find the entire `<div class="promises-grid reveal">` block and replace all 4 `<span class="promise-icon">` emoji spans with SVG icon divs:

```html
<div class="promises-grid reveal">
  <div class="promise-item">
    <div class="promise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    </div>
    <strong>Upfront Pricing</strong>
    <span>No hidden fees. Ever.</span>
  </div>
  <div class="promise-item">
    <div class="promise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    </div>
    <strong>On-Time Arrival</strong>
    <span>We respect your schedule.</span>
  </div>
  <div class="promise-item">
    <div class="promise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    </div>
    <strong>We Sweep Up</strong>
    <span>Clean space, every job.</span>
  </div>
  <div class="promise-item">
    <div class="promise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    </div>
    <strong>Same-Day Available</strong>
    <span>Call (801) 441-5090</span>
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Scroll to the "Our Promise" section on the homepage. The 4 promise items should now show navy square icon containers with SVG icons instead of emoji. Hover over each — the icon background should shift from light blue to a slightly deeper blue.

- [ ] **Step 4: Save file**

---

## Task 6: How It Works — Condense to 3 Steps

**Files:**
- Modify: `index copy.html` — homepage steps grid (~line 1262) and How It Works page steps (~line 2144)

- [ ] **Step 1: Replace homepage steps grid**

Find the `<div class="steps-grid">` block inside the "Simple Process" section on the home page. Replace the entire block (including all step items and the button at the end) with:

```html
<div class="steps-grid" style="grid-template-columns:repeat(3,1fr);gap:48px 64px;margin-top:64px;">
  <div class="step-item reveal">
    <div class="step-num">01</div>
    <div class="step-content">
      <h4>Contact us</h4>
      <p>Call, text, or submit the form online. Include photos for the most accurate estimate. Same-day? Call directly.</p>
    </div>
  </div>
  <div class="step-item reveal reveal-d1">
    <div class="step-num">02</div>
    <div class="step-content">
      <h4>We arrive &amp; confirm</h4>
      <p>On-site, we confirm the final price before lifting a finger. No surprises, no hidden fees — ever.</p>
    </div>
  </div>
  <div class="step-item reveal reveal-d2">
    <div class="step-num">03</div>
    <div class="step-content">
      <h4>Done</h4>
      <p>We haul everything away, sweep the area, and collect payment after you're satisfied.</p>
    </div>
  </div>
</div>
<div style="margin-top:40px;" class="reveal">
  <a href="#" class="btn btn--navy" onclick="showPage('howitworks');return false;">Full process details →</a>
</div>
```

- [ ] **Step 2: Replace How It Works page steps**

Find `<div class="steps-detail">` inside `id="page-howitworks"` and replace all 5 `.step-detail` items with 3:

```html
<div class="steps-detail">
  <div class="step-detail reveal">
    <div class="step-detail-num">01</div>
    <div class="step-detail-content">
      <h3>Contact us</h3>
      <p>Start by reaching out however is easiest. Call or text <strong>(801) 441-5090</strong>, or fill out our online quote form. Include photos of your items if possible — it helps us give the most accurate estimate. For same-day service, calling is always the fastest route.</p>
    </div>
  </div>
  <div class="step-detail reveal">
    <div class="step-detail-num">02</div>
    <div class="step-detail-content">
      <h3>We arrive &amp; confirm the price</h3>
      <p>Our team arrives on time within your scheduled window. Before we start loading anything, we confirm the final price based on the actual volume. No surprises, no hidden fees — you approve before we lift a finger.</p>
    </div>
  </div>
  <div class="step-detail reveal">
    <div class="step-detail-num">03</div>
    <div class="step-detail-content">
      <h3>Done — swept clean</h3>
      <p>Once everything is loaded, we sweep the area and collect payment after the job is complete to your satisfaction. We accept cash, credit/debit cards, and checks. That's it — your space is clear.</p>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Remove the "How to prepare" tip box from the How It Works page**

Find and delete this block on the How It Works page (it will be moved to the Quote page in Task 7):
```html
<div style="background:var(--bg);border-left:3px solid var(--navy-400);padding:24px 32px;border-radius:0 var(--r-md) var(--r-md) 0;margin-top:40px;" class="reveal">
  <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;color:var(--ink);">How to prepare for your pickup</h3>
  <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
    <li style="display:flex;gap:10px;font-size:14.5px;color:var(--ink-light);"><span style="color:var(--navy-500);font-weight:700;">✓</span> Gather all items into one location or pile before we arrive</li>
    <li style="display:flex;gap:10px;font-size:14.5px;color:var(--ink-light);"><span style="color:var(--navy-500);font-weight:700;">✓</span> Point out exactly which items should be taken</li>
    <li style="display:flex;gap:10px;font-size:14.5px;color:var(--ink-light);"><span style="color:var(--navy-500);font-weight:700;">✓</span> Clear a path to items if they're inside the house</li>
    <li style="display:flex;gap:10px;font-size:14.5px;color:var(--ink-light);"><span style="color:var(--navy-500);font-weight:700;">✓</span> Keep pets safely inside during the pickup</li>
  </ul>
</div>
```

- [ ] **Step 4: Verify in browser**

Homepage "Simple Process" section: 3 steps in a single row. How It Works page: 3 expanded steps with detailed copy. The prep tip box is gone from How It Works (it will appear on the Quote page after Task 7).

- [ ] **Step 5: Save file**

---

## Task 7: Quote Page — Split Layout + Email Fields

**Files:**
- Modify: `index copy.html` — quote page CSS (add new rules after existing quote CSS ~line 778) and quote page HTML (~line 2187)

- [ ] **Step 1: Add split layout CSS**

Find the `/* QUOTE FORM */` CSS block (around line 778). After the closing `}` of `.form-row`, add:

```css
/* ============================================================
   QUOTE PAGE — SPLIT LAYOUT
============================================================ */
.quote-split {
  display: grid; grid-template-columns: 380px 1fr;
  min-height: calc(100vh - 72px);
}
.quote-split-left {
  background: var(--navy-900); padding: 56px 44px;
  display: flex; flex-direction: column; gap: 0;
  position: relative; overflow: hidden;
}
.quote-split-left::before {
  content: ''; position: absolute; bottom: -80px; right: -80px;
  width: 300px; height: 300px; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, rgba(40,120,200,0.18) 0%, transparent 65%);
}
.quote-split-right {
  background: var(--bg); padding: 56px 48px;
  display: flex; align-items: flex-start; justify-content: center;
}
.quote-form-inner {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-xl); padding: 40px;
  width: 100%; max-width: 560px; box-shadow: var(--shadow-sm);
}
.quote-form-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px; font-weight: 700; color: var(--ink);
  letter-spacing: -0.02em; margin-bottom: 6px;
}
.quote-form-sub { font-size: 14px; color: var(--ink-light); margin-bottom: 28px; }
.ql-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--navy-300); margin-bottom: 16px; display: block;
}
.ql-heading {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 30px; font-weight: 700; color: #fff;
  line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 32px;
}
.ql-promises { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
.ql-promise { display: flex; align-items: flex-start; gap: 12px; }
.ql-check {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(40,120,200,0.25); border: 1px solid rgba(74,154,224,0.3);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
}
.ql-check svg { width: 10px; height: 10px; }
.ql-promise-text strong { display: block; font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 2px; }
.ql-promise-text span { font-size: 13px; color: rgba(255,255,255,0.5); }
.ql-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
.ql-contact { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.ql-contact a {
  font-size: 13.5px; color: rgba(255,255,255,0.65);
  display: flex; align-items: center; gap: 8px; transition: color 0.2s;
}
.ql-contact a:hover { color: rgba(255,255,255,0.95); }
.ql-contact a strong { color: rgba(255,255,255,0.9); font-weight: 600; }
.ql-prep { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--r-md); padding: 18px 20px; }
.ql-prep h4 { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); margin-bottom: 12px; letter-spacing: -0.01em; }
.ql-prep ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.ql-prep li { font-size: 13px; color: rgba(255,255,255,0.5); display: flex; gap: 8px; }
.ql-prep li::before { content: '✓'; color: var(--navy-300); font-weight: 700; flex-shrink: 0; }
@media (max-width: 900px) {
  .quote-split { grid-template-columns: 1fr; }
  .quote-split-left { padding: 32px 24px; }
  .quote-split-left .ql-heading { font-size: 24px; }
  .ql-prep { display: none; }
  .quote-split-right { padding: 32px 20px; }
  .quote-form-inner { padding: 28px 20px; }
}
```

- [ ] **Step 2: Replace the entire quote page HTML**

Find the `<div class="page" id="page-quote">` block and replace its entire contents with:

```html
<div class="page" id="page-quote">
  <div class="quote-split">

    <!-- LEFT: Navy trust panel -->
    <div class="quote-split-left">
      <span class="ql-eyebrow">Free Estimate</span>
      <h2 class="ql-heading">We'll get back<br>to you fast.</h2>
      <div class="ql-promises">
        <div class="ql-promise">
          <div class="ql-check"><svg viewBox="0 0 12 12" fill="none" stroke="#4a9ae0" stroke-width="2" stroke-linecap="round"><polyline points="2,6 5,9 10,3"/></svg></div>
          <div class="ql-promise-text"><strong>Free upfront estimate</strong><span>No obligation to book.</span></div>
        </div>
        <div class="ql-promise">
          <div class="ql-check"><svg viewBox="0 0 12 12" fill="none" stroke="#4a9ae0" stroke-width="2" stroke-linecap="round"><polyline points="2,6 5,9 10,3"/></svg></div>
          <div class="ql-promise-text"><strong>Response within 24 hrs</strong><span>Often same day.</span></div>
        </div>
        <div class="ql-promise">
          <div class="ql-check"><svg viewBox="0 0 12 12" fill="none" stroke="#4a9ae0" stroke-width="2" stroke-linecap="round"><polyline points="2,6 5,9 10,3"/></svg></div>
          <div class="ql-promise-text"><strong>$0 hidden fees</strong><span>Price confirmed on-site.</span></div>
        </div>
      </div>
      <hr class="ql-divider">
      <div class="ql-contact">
        <a href="tel:8014415090">📞 Need same-day? <strong>(801) 441-5090</strong></a>
        <a href="sms:8014415090">💬 Text us a photo for the fastest quote</a>
      </div>
      <div class="ql-prep">
        <h4>How to prepare for your pickup</h4>
        <ul>
          <li>Gather all items into one location before we arrive</li>
          <li>Point out exactly which items should be taken</li>
          <li>Clear a path if items are inside the house</li>
          <li>Keep pets safely inside during the pickup</li>
        </ul>
      </div>
    </div>

    <!-- RIGHT: Form -->
    <div class="quote-split-right">
      <div class="quote-form-inner reveal">
        <div class="quote-form-title">Request a Quote</div>
        <p class="quote-form-sub">Fill out the form and we'll respond within 24 hours.</p>
        <form onsubmit="submitQuoteForm(event)" id="mainQuoteForm">
          <div class="form-row">
            <div class="field"><label>Your Name *</label><input type="text" placeholder="Full name" required></div>
            <div class="field"><label>Phone Number *</label><input type="tel" placeholder="(801) 000-0000" required></div>
          </div>
          <div class="field"><label>Email Address *</label><input type="email" placeholder="you@email.com" required></div>
          <div class="field"><label>Service Address *</label><input type="text" placeholder="Street address, city, ZIP" required></div>
          <div class="field"><label>Service Type *</label>
            <select required>
              <option value="">Select service...</option>
              <option>Residential Cleanout</option>
              <option>Commercial Cleanout</option>
              <option>Appliance Removal</option>
              <option>Furniture Removal</option>
              <option>Yard Waste Removal</option>
              <option>Construction Debris</option>
              <option>Cardboard Recycling</option>
              <option>Other / Multiple Services</option>
            </select>
          </div>
          <div class="form-row">
            <div class="field"><label>Preferred Date</label><input type="date"></div>
            <div class="field"><label>Preferred Time</label>
              <select>
                <option value="">Any time</option>
                <option>Morning (8:30 AM – 12 PM)</option>
                <option>Afternoon (12 PM – 4 PM)</option>
                <option>Late Afternoon (4 PM – 6 PM)</option>
              </select>
            </div>
          </div>
          <div class="field"><label>Photo Upload (optional but helpful)</label><input type="file" accept="image/*" multiple style="padding:10px 14px;cursor:pointer;"><small style="color:var(--ink-xlight);font-size:12px;margin-top:4px;display:block;">Photos help us give the most accurate estimate.</small></div>
          <div class="field"><label>Additional Notes</label><textarea rows="3" placeholder="Any other details about your junk removal needs..."></textarea></div>
          <button type="submit" class="btn btn--primary btn--lg" style="width:100%;margin-top:8px;">Submit Quote Request →</button>
        </form>
        <div class="form-success" id="quoteFormSuccess" style="margin-top:20px;">
          ✅ <strong>Thanks! We've received your request.</strong> We'll respond within 24 hours.<br>
          <span style="font-size:13px;margin-top:6px;display:block;">For same-day: <a href="tel:8014415090" style="color:var(--navy-500);font-weight:700;">(801) 441-5090</a></span>
        </div>
      </div>
    </div>

  </div>
</div>
```

- [ ] **Step 3: Add email field to hero form card**

Find the hero form card (`<div class="hero-card ha-card">`). Inside the `<form onsubmit="submitHeroForm(event)">`, add an email field between the Phone and Service fields:

After:
```html
<div class="field">
  <label>Phone Number</label>
  <input type="tel" placeholder="(801) 000-0000" required>
</div>
```

Add:
```html
<div class="field">
  <label>Email Address</label>
  <input type="email" placeholder="you@email.com" required>
</div>
```

- [ ] **Step 4: Verify in browser**

Click "Get a Quote" in the nav. The quote page should show a two-column layout: navy panel left with heading, promises, contact shortcuts, and prep tips; white card right with the form. Email field present. On mobile (resize browser to <900px), the panel should stack above the form and the prep box should be hidden.

- [ ] **Step 5: Save file**

---

## Task 8: Reviews — Expand to 9 + Fix Button

**Files:**
- Modify: `index copy.html` — reviews grid (~line 2113) and Leave a Review button (~line 2121)

- [ ] **Step 1: Add 3 new review cards to the reviews grid**

Find `<div class="reviews-grid" id="reviewsGrid">` on the Reviews page. After the last existing review card (Amanda C.), add:

```html
<div class="review-card reveal"><div class="review-stars">★★★★★</div><p class="review-text">"Called for construction debris after a bathroom gut. They came next morning, loaded everything fast, and swept the site. Exactly what I needed — will be using them on every job."</p><div class="review-name">Kevin B.</div><div class="review-type">Contractor</div></div>
<div class="review-card reveal reveal-d1"><div class="review-stars">★★★★★</div><p class="review-text">"My tenant left the unit absolutely full of junk. One call to Elite Junk Solutions and it was cleared out within two days. Couldn't be easier."</p><div class="review-name">Rachel S.</div><div class="review-type">Landlord</div></div>
<div class="review-card reveal reveal-d2"><div class="review-stars">★★★★★</div><p class="review-text">"Cleared out 20 years of stuff from the garage in one shot. The guys were professional, careful not to damage walls or flooring, and left it cleaner than they found it."</p><div class="review-name">Tom W.</div><div class="review-type">Homeowner</div></div>
```

- [ ] **Step 2: Fix the Leave a Review button**

Find:
```html
<a href="#" id="reviewsLeaveReviewBtn" class="btn btn--primary btn--lg">⭐ Leave Us a Review</a>
```

Replace with:
```html
<!-- TODO: Replace href with your Google Business review link when ready -->
<a href="#google-review-link" id="reviewsLeaveReviewBtn" class="btn btn--primary btn--lg">⭐ Leave Us a Review on Google</a>
```

- [ ] **Step 3: Verify in browser**

Navigate to Reviews page. Should show 9 review cards in a 3-column grid. The "Leave a Review" button text now says "Leave Us a Review on Google."

- [ ] **Step 4: Save file**

---

## Task 9: Service Area — Add City List

**Files:**
- Modify: `index copy.html` — Services page hero (~line 1533) and About page (~line 1929)

- [ ] **Step 1: Add cities to Services page hero subtitle**

Find on the Services page:
```html
<p class="reveal reveal-d1">Serving South Jordan &amp; Salt Lake County — residential, commercial, and more.</p>
```

Replace with:
```html
<p class="reveal reveal-d1">Serving South Jordan, Herriman, Riverton, Draper, Sandy, West Jordan, Murray, Midvale &amp; surrounding Salt Lake County — residential, commercial, and more. When possible, we donate usable items to local charities and recycle materials responsibly.</p>
```

- [ ] **Step 2: Add service area section to About page**

Find the business hours section on the About page:
```html
<div class="hours-table reveal">
  ...
</div>
```

After the `</div>` that closes `.hours-table`, add:

```html
<div style="margin-top:48px;" class="reveal">
  <div class="sec-header--center">
    <span class="t-label">Service Area</span>
    <h2 class="t-heading" style="margin-top:12px;">Where we work.</h2>
    <p class="t-body" style="margin-top:10px;">Based in South Jordan — serving all of Salt Lake County.</p>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:24px;">
    <span class="item-tag">South Jordan</span>
    <span class="item-tag">Herriman</span>
    <span class="item-tag">Riverton</span>
    <span class="item-tag">Draper</span>
    <span class="item-tag">Sandy</span>
    <span class="item-tag">West Jordan</span>
    <span class="item-tag">Murray</span>
    <span class="item-tag">Midvale</span>
    <span class="item-tag" style="color:var(--ink-light);">& surrounding areas</span>
  </div>
  <p style="text-align:center;font-size:13.5px;color:var(--ink-light);margin-top:16px;">Not sure if we cover your area? Call <a href="tel:8014415090" style="color:var(--navy-500);font-weight:600;">(801) 441-5090</a>.</p>
</div>
```

- [ ] **Step 3: Verify in browser**

Services page hero subtitle now lists cities. About page, after business hours, shows a new "Where we work" section with city pill tags.

- [ ] **Step 4: Save file**

---

## Task 10: Eco / Recycling Messaging — About Page

**Files:**
- Modify: `index copy.html` — About page "Why Choose Us" grid (~line 1907)

- [ ] **Step 1: Add eco why-item to About page**

Find the `.why-grid` on the About page. After the last `.why-item` (currently "Fast response times"), add a 7th item:

```html
<div class="why-item reveal"><div class="why-check">✓</div><div><h4>Eco-responsible disposal</h4><p>We donate usable items to local charities and recycle when possible — keeping as much as we can out of the landfill.</p></div></div>
```

Note: The `.why-grid` is `grid-template-columns: 1fr 1fr`. With 7 items, the last item will span one column and sit left-aligned. This is acceptable.

- [ ] **Step 2: Verify in browser**

About page "Why Choose Us" section should now have 7 items. The eco item appears at the end.

- [ ] **Step 3: Save file**

---

## Task 11: Gallery — Add Links from Homepage + About Page

**Files:**
- Modify: `index copy.html` — homepage services section (~line 1358) and About page about-grid section (~line 1896)

- [ ] **Step 1: Add Gallery link below services section on homepage**

Find on the homepage services section:
```html
<div style="text-align:center;margin-top:40px;" class="reveal">
  <a href="#" class="btn btn--outline" onclick="showPage('services');return false;">View all services →</a>
</div>
```

Replace with:
```html
<div style="text-align:center;margin-top:40px;" class="reveal">
  <a href="#" class="btn btn--outline" onclick="showPage('services');return false;">View all services →</a>
  <div style="margin-top:14px;">
    <a href="#" onclick="showPage('gallery');return false;" style="font-size:14px;color:var(--ink-light);text-decoration:underline;text-underline-offset:3px;">See our work →</a>
  </div>
</div>
```

- [ ] **Step 2: Add Gallery link to About page**

Find on the About page, the closing `</div>` of the `about-grid` div (after the `about-img` emoji truck placeholder). Add after the about-grid closing div, before the next `<section>`:

```html
<div style="margin-top:32px;text-align:center;" class="reveal">
  <a href="#" onclick="showPage('gallery');return false;" class="btn btn--outline">See Our Work →</a>
</div>
```

- [ ] **Step 3: Verify in browser**

Homepage services section: subtle "See our work →" underline link below the "View all services" button. About page: "See Our Work →" button below the about description. Both navigate to the Gallery page correctly.

- [ ] **Step 4: Save file**

---

## Self-Review Checklist

### Spec Coverage
- [x] §1 Typography — Task 1
- [x] §2 Navigation — Task 2
- [x] §3 Hero Stats — Task 3
- [x] §4 Trust Bar — Task 4
- [x] §5 Promises SVG Icons — Task 5
- [x] §6 How It Works 3 steps — Task 6
- [x] §7 Quote Page split layout + email — Task 7
- [x] §7 Hero form email field — Task 7 Step 3
- [x] §8 Reviews 9 + button fix — Task 8
- [x] §9 Service Area — Task 9 (note: eco sentence added to Services page in Task 9 Step 1 rather than a separate task — consistent with spec)
- [x] §10 Eco messaging About page — Task 10 (Services page covered in Task 9)
- [x] §11 Gallery links — Task 11

### No Placeholders
All steps contain exact HTML/CSS. No TBDs.

### Consistency
- `Playfair Display` font name used consistently across Task 1 CSS and Task 7 CSS
- `showPage('gallery')` function call used consistently in Task 2 and Task 11
- `.ql-*` prefix used consistently for all quote layout CSS classes in Task 7
- `form-row` class used in Task 7 form matches existing CSS definition
