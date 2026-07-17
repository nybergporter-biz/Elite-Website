# Elite Junk Solutions — Website Services & Tools

_Last updated: July 17, 2026. A running inventory of every service the website (elitejunkut.com) depends on and what each one does._

## Accounts you own / log into

These are the services with a login where your data and settings live. If one goes down or a password is lost, part of the site is affected.

| Service | What it's used for |
|---|---|
| **GitHub** (`nybergporter-biz/elite-website`) | Stores all your website code and its history. Every change is committed here; it's the source of truth for the site. |
| **Vercel** | Hosts the live website and deploys it. Whenever code is pushed to GitHub, Vercel automatically rebuilds and publishes elitejunkut.com within ~a minute. |
| **GoDaddy** (domain registrar) | Where you bought and manage the domain elitejunkut.com — the annual registration and the DNS that points visitors to Vercel. |
| **Supabase** | The site's database. Stores lead form submissions (`lead_requests` table) and job booking slots (`booked_slots` table). This is what feeds your field/quote app so new leads show up instantly. |
| **Google Apps Script** (Google account) | A backup logger. Every lead form submission is also written to a Google Sheet as a secondary record, in case anything is ever missed. |
| **Featurable** | Pulls your Google reviews into the website's review sections and refreshes them automatically (~every 48h). Free account, connected to your Google Business Profile. |
| **Google Business Profile** | Your Google listing — the source of the reviews Featurable displays, the target of the "Leave Us a Review" button, and your presence in Google Maps / local search. |
| **Google Search Console** | Where your sitemap is submitted and where you monitor how the site is indexed and performing in Google Search. |
| **Google Analytics (GA4)** | Tracks website visitors — how many, where they come from, which pages they view, and which lead to form submissions. Installed on all pages. |

## Third-party resources the site loads (no account needed)

These are free public services the site pulls in automatically. Nothing to manage, but good to know they're in the mix.

| Resource | What it's used for |
|---|---|
| **Google Fonts** | Supplies the website's typography (Fraunces, DM Sans, Inter, Playfair Display, etc.). |
| **jsDelivr (CDN)** | Delivers the Supabase JavaScript library that the lead forms use to talk to your database. |
| **Unsplash** | Source of the stock photography used in some page imagery. |
| **schema.org** | Not a service or account — just the standard vocabulary used for the site's structured data (SEO markup). No login involved. |

## Notes

- **Analytics:** Google Analytics (GA4) is installed for visitor stats. No Tag Manager, Meta Pixel, or other trackers.
- **Lead flow:** Website form → Supabase (primary) + Google Sheet via Apps Script (backup) → your field/quote app.
- **Review flow:** Customer leaves a Google review → Google Business Profile → Featurable (refreshes ~48h) → website review sections.
