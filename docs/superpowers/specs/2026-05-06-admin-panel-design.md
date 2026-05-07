# Admin Panel for Elite Junk Solutions

**Design Document**  
**Date:** May 6, 2026  
**Status:** Approved  
**Timeline:** Phase 1 complete by May 13, 2026

---

## Executive Summary

Build a comprehensive admin dashboard for Elite Junk Solutions that allows Porter and his business partner to manage customers, jobs, invoicing, and scheduling without touching code. The system is designed to transition seamlessly to Jobber in 2-3 months without rebuilding or losing data.

**Key principle:** The API abstraction layer lets us swap data sources (Supabase → Jobber) without changing the dashboard code.

---

## Phase 1 Scope (This Week)

### What's Included
- **CRM:** Full customer management (add, edit, delete, search, history)
- **Job Management:** Create quotes, track job status, link jobs to customers
- **Invoicing:** Auto-generate invoices from jobs, track payment status
- **Scheduling:** Calendar view of upcoming jobs, mark jobs complete
- **Analytics:** Revenue, job count, conversion rates, customer acquisition
- **Authentication:** Email/password login with shared team access
- **Settings:** Business info, service types, pricing templates

### What's Not Included (Phase 2+)
- Website content editor (Phase 2)
- Google Business Profile integration (Phase 2)
- Payment processing (future)
- Team management/role-based access (future - for now, shared login)
- Photo uploads (future)
- SMS/email notifications (future)

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────┐
│         NEXT.JS ADMIN DASHBOARD                │
│  (React UI: CRM, Invoicing, Scheduling)       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   API ABSTRACTION     │
         │   LAYER (Node.js)     │
         │  Current: Supabase    │
         │  Future: Jobber       │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
    ┌─────────────┐         ┌──────────────┐
    │  SUPABASE   │         │  SUPABASE    │
    │ (PostgreSQL)│         │   AUTH       │
    │  - CRM Data │         │              │
    │  - Jobs     │         │              │
    │  - Invoices │         │              │
    └─────────────┘         └──────────────┘
```

### Why This Architecture

**Abstraction Layer:** All data requests go through an API layer that doesn't care *where* the data comes from. Currently it asks Supabase. In 2 months, it'll ask Jobber. The dashboard never knows the difference.

**Benefits:**
- Fast to ship now (no Jobber overhead)
- No data loss when switching (clean migration path)
- Dashboard code is reusable no matter what backend you use

---

## Database Schema (Supabase PostgreSQL)

### Customers Table

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| first_name | Text | Customer first name |
| last_name | Text | Customer last name |
| phone | Text | Primary phone number |
| email | Text | Email address |
| address | Text | Service address |
| city | Text | City |
| state | Text | State |
| zip | Text | ZIP code |
| notes | Text | Internal notes (gate codes, pet warnings, special instructions) |
| created_at | Timestamp | Created date |
| updated_at | Timestamp | Last modified date |

**Indexes:** phone, email (for quick search)

---

### Jobs Table

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| customer_id | UUID (FK) | Foreign key to Customers |
| service_type | Text | "Residential Cleanout", "Commercial Cleanout", "Appliance Removal", "Furniture Removal", "Yard Waste", "Construction Debris", "Recycling", "Other" |
| status | Text | "quoted", "booked", "in_progress", "completed", "cancelled" |
| quoted_price | Number | Price quoted to customer |
| actual_price | Number | Final price charged |
| scheduled_date | Timestamp | Date/time job is scheduled for |
| completed_date | Timestamp | Date/time job was completed |
| notes | Text | Job-specific notes, special instructions |
| created_at | Timestamp | When job was created |
| updated_at | Timestamp | Last modified |

**Indexes:** customer_id, status, scheduled_date (for filtering/sorting)

---

### Invoices Table

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| job_id | UUID (FK) | Foreign key to Jobs |
| customer_id | UUID (FK) | Foreign key to Customers |
| amount | Number | Base amount (before tax) |
| tax | Number | Tax amount |
| total | Number | Total amount due |
| status | Text | "draft", "sent", "paid", "overdue" |
| issued_date | Timestamp | When invoice was issued |
| due_date | Timestamp | When payment is due |
| paid_date | Timestamp | When payment was received (null if unpaid) |
| notes | Text | Invoice notes or payment terms |
| created_at | Timestamp | Created date |
| updated_at | Timestamp | Last modified |

**Indexes:** customer_id, job_id, status (for filtering)

---

### Settings Table (Business Config)

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| key | Text | Setting name (e.g., "business_name", "phone", "service_types") |
| value | Text/JSON | Setting value |
| created_at | Timestamp | Created |
| updated_at | Timestamp | Last modified |

**Examples:**
- `business_name` = "Elite Junk Solutions"
- `business_phone` = "(801) 441-5090"
- `service_types` = JSON array of available service types

---

## API Layer Design

### Why Abstraction Matters

The dashboard is "dumb"—it doesn't know where data comes from. It just asks the API: "Get me customer #123" and displays whatever comes back.

**Currently:** API queries Supabase and returns customer data  
**In 2 months:** API queries Jobber and returns customer data  
**The dashboard:** Displays the same data, unchanged

### API Endpoints (Phase 1)

#### Customers
- `GET /api/customers` — List all customers (with pagination/search)
- `GET /api/customers/:id` — Get single customer + job history
- `POST /api/customers` — Create customer
- `PUT /api/customers/:id` — Update customer
- `DELETE /api/customers/:id` — Delete customer

#### Jobs
- `GET /api/jobs` — List jobs (filter by status, date, customer)
- `GET /api/jobs/:id` — Get job details
- `POST /api/jobs` — Create job/quote
- `PUT /api/jobs/:id` — Update job status, pricing, date
- `PUT /api/jobs/:id/complete` — Mark job complete + create invoice option

#### Invoices
- `GET /api/invoices` — List invoices (filter by status)
- `GET /api/invoices/:id` — Get invoice details
- `POST /api/invoices` — Create invoice (from job or manually)
- `PUT /api/invoices/:id` — Update status (e.g., mark paid)
- `DELETE /api/invoices/:id` — Delete invoice

#### Analytics
- `GET /api/analytics/revenue` — Total revenue (by month/year)
- `GET /api/analytics/jobs` — Job count, completion rate, avg value
- `GET /api/analytics/customers` — Customer acquisition, retention
- `GET /api/analytics/conversion` — Quote-to-job conversion rate

#### Auth & Settings
- `POST /api/auth/login` — Email/password login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user info
- `GET /api/settings` — Business settings
- `PUT /api/settings/:key` — Update setting

---

## Dashboard Pages & Features

### 1. Dashboard (Home)
**Purpose:** Quick overview of business status

**Content:**
- Key metrics boxes: Total revenue (this month, YTD), jobs completed, pending jobs
- Conversion rate: Quotes vs. actual jobs
- Recent activity: Last 5 jobs completed, last 5 customers added
- Upcoming jobs: Calendar preview of next 7 days
- Quick actions: "New Customer", "New Job", "New Invoice"

---

### 2. Customers (CRM)
**Purpose:** Manage all customer information

**Sub-pages:**
- **List View:** All customers with search/filter, pagination
  - Columns: Name, Phone, Last job date, Total spent, Actions
  - Search by name, phone, email
  - Filter by: Last contacted date range, job count range

- **Customer Detail:** Full profile
  - Contact info (name, phone, email, address)
  - Notes (editable)
  - Job history (all jobs linked to this customer)
  - Total revenue from this customer
  - Actions: Edit, delete, create new job

- **Add/Edit Customer:** Form
  - Name (first + last)
  - Phone, email
  - Service address (street, city, state, zip)
  - Notes
  - Submit + Cancel buttons

---

### 3. Jobs (Project Management)
**Purpose:** Track jobs from quote to completion

**Sub-pages:**
- **List View:** All jobs, grouped by status
  - Tabs: All, Quoted, Booked, In Progress, Completed
  - Columns: Job ID, Customer, Service Type, Status, Date, Price, Actions
  - Sort by: Date, price, status
  - Filter by: Date range, service type, customer

- **Job Detail:** Full job record
  - Customer name (linked)
  - Service type
  - Quoted price, actual price
  - Status (with ability to change)
  - Scheduled date, completed date
  - Notes
  - Associated invoice (if exists)
  - Actions: Edit, complete job, delete, generate invoice

- **Create Job:** Form
  - Select customer (searchable dropdown)
  - Service type (dropdown)
  - Quoted price
  - Scheduled date
  - Notes
  - Submit

---

### 4. Calendar
**Purpose:** Visual scheduling view

**Features:**
- Month view (default)
- Week view (toggle)
- Day view (click to see all jobs for that day)
- Scheduled jobs shown as color-coded blocks
- Click job to see details
- Drag-to-reschedule (optional for Phase 1)
- Quick "Mark Complete" button from calendar

---

### 5. Invoices
**Purpose:** Create and track invoices

**Sub-pages:**
- **List View:** All invoices
  - Columns: Invoice ID, Customer, Job, Amount, Status, Due Date, Actions
  - Filter by: Status (draft, sent, paid, overdue), date range
  - Sort by: Date, amount, status

- **Invoice Detail:** Full invoice
  - Invoice number, date, due date
  - Customer info
  - Line items (job details)
  - Subtotal, tax, total
  - Payment status
  - Actions: Mark paid, edit, delete, download PDF, print

- **Create Invoice:** Form (two paths)
  - **From Job:** Select job → auto-populate customer, amount → submit
  - **Manual:** Enter customer, amount, description, tax → submit

---

### 6. Settings
**Purpose:** Configure business settings

**Features:**
- **Business Info:** Company name, phone, email, address
- **Service Types:** List of available service types (add/edit/delete)
- **Pricing Templates:** Default prices per service type
- **Account:** Email, password change
- **Team:** (Phase 1: show shared login status; Phase 2: role management)

---

## Authentication & Access

**Phase 1:** Shared email/password for you and your business partner
- One account = both users access the same dashboard
- No way to track who did what (future: add user tracking)

**Setup:**
- Supabase Auth (email/password)
- Session stored in browser
- 30-day session expiry
- Logout clears session

---

## Data Flow Examples

### Example 1: Create a Customer
1. User fills out customer form → clicks Submit
2. Dashboard sends: `POST /api/customers { first_name, last_name, phone, email, address... }`
3. API layer receives request → validates → inserts into Supabase
4. API returns: `{ id, ...customer_data }`
5. Dashboard shows: "Customer created" + redirects to customer list

### Example 2: Complete a Job & Create Invoice
1. User views job detail → clicks "Mark Complete"
2. Dashboard sends: `PUT /api/jobs/:id { status: "completed", completed_date: now() }`
3. API updates job in Supabase
4. Dashboard shows option: "Create invoice?"
5. User clicks "Create invoice"
6. Dashboard sends: `POST /api/invoices { job_id, customer_id, amount, ... }`
7. Invoice created and shown to user

---

## Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | Next.js | 14+ | Server-side rendering, API routes, fast deployment to Vercel |
| UI Library | React | 18+ | Component-based, paired with Next.js |
| Styling | TailwindCSS | Latest | Utility-first, matches website design, fast |
| Database | Supabase (PostgreSQL) | Latest | Serverless, real-time, migrations easy to Jobber |
| Auth | Supabase Auth | Built-in | Simple, secure, integrated with DB |
| Hosting | Vercel | N/A | Zero-config, Preview deployments, scales to millions |
| API Gateway | Next.js API Routes | Built-in | No separate backend needed initially |

---

## Transition to Jobber (2-3 Months)

### Timeline

**Week 1-8:** Use custom dashboard with Supabase  
- Build customer base
- Test workflows
- Prove concept works
- Gather feedback from partner

**Week 8-10:** Decision & setup  
- Sign up for Jobber
- Set up API keys in admin panel
- Plan data migration (customer mapping)
- 1-2 days to swap API layer

**Week 10+:** After migration  
- Dashboard connects to Jobber API instead of Supabase
- Customer data migrated to Jobber
- All dashboard features work the same
- No data loss, no downtime

### Migration Safety

1. **Backup:** Export all Supabase data before switching (CSV)
2. **Test:** Swap API layer in staging first, verify all features work
3. **Gradual:** If possible, run both systems in parallel for a week
4. **Data mapping:** Ensure Jobber customer fields map to ours

---

## Future Phases

### Phase 2 (Weeks 3-4)
- Website content editor (edit sections without code)
- Google Business Profile integration (import reviews, link button)

### Phase 3 (Weeks 5-8)
- Payment processing (collect payments online)
- Photo uploads (document jobs with photos)
- SMS/email notifications

### Phase 4+ (After Jobber)
- Team management (assign jobs to team members, role-based access)
- Mobile app (for field team)
- Advanced reporting (custom date ranges, export)

---

## Success Criteria

By end of Phase 1 (May 13, 2026):
- ✅ Can add/edit/delete customers without code
- ✅ Can create jobs and link to customers
- ✅ Can generate invoices from jobs
- ✅ Can view upcoming scheduled jobs on calendar
- ✅ Can see basic analytics (revenue, job count, conversion rate)
- ✅ Both partners can log in with shared credentials
- ✅ Dashboard deployed on Vercel and accessible online
- ✅ Data persists in Supabase (not just in memory)
- ✅ API abstraction layer ready for Jobber swap

---

## Open Questions / Decisions Needed

1. **Shared login:** Should both partners always see the same data, or do you need separate accounts later?
   - *Current decision:* Shared login for now
   - *Future:* Add role-based access in Phase 4

2. **Tax handling:** Should the app calculate tax, or do you enter it manually?
   - *Current decision:* Manual entry per invoice
   - *Future:* Configurable tax rate per service type

3. **Payment status tracking:** Do you want to manually mark invoices "paid", or integrate with payment processor?
   - *Current decision:* Manual tracking
   - *Future:* Stripe/Square integration in Phase 3

4. **Job status workflow:** Are the 5 statuses (quoted, booked, in_progress, completed, cancelled) sufficient, or do you need more?
   - *Current decision:* Yes, these are sufficient
   - *Future:* Can add custom statuses if needed

---

## Implementation Notes for Dev

- Use TypeScript for type safety
- Database constraints: customers.email unique, jobs.customer_id NOT NULL
- API response format: `{ success: boolean, data: {...}, error?: string }`
- Dashboard error states: Show toast notifications for success/error
- Defensive coding: Handle missing customer/job gracefully (404)
- Performance: Paginate customer/job lists (20 items per page default)

---

## Appendix: Pricing Model (For Later)

When you integrate Jobber, consider their pricing:
- **Free tier:** Limited features (good for starting)
- **Growth:** $99-199/month (includes field service features)
- **Plus:** $249-349/month (advanced integrations)

You'll likely land in **Growth** tier (~$150/month). This replaces the custom dashboard, so ROI is positive once you reach 50+ customers.

---

**Document Status:** Ready for implementation  
**Next Step:** Create implementation plan with writing-plans skill
