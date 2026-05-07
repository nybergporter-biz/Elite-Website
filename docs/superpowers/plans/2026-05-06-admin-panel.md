# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional admin dashboard for Elite Junk Solutions (CRM, jobs, invoicing, scheduling, analytics) on Next.js + Supabase, deployable to Vercel.

**Architecture:** Next.js 14 app with React components, Supabase PostgreSQL backend, API abstraction layer (swappable for Jobber later), TailwindCSS for styling.

**Tech Stack:** Next.js 14, React 18, TypeScript, Supabase (PostgreSQL + Auth), TailwindCSS, Vercel

**Timeline:** 7 days (May 6-13, 2026)

---

## File Structure

```
elite-admin/
├── app/
│   ├── layout.tsx                 # Root layout with navigation
│   ├── page.tsx                   # Dashboard home
│   ├── (auth)/
│   │   ├── login/page.tsx         # Login page
│   │   └── logout/page.tsx        # Logout handler
│   ├── customers/
│   │   ├── page.tsx               # Customers list
│   │   ├── new/page.tsx           # New customer form
│   │   └── [id]/page.tsx          # Customer detail + edit
│   ├── jobs/
│   │   ├── page.tsx               # Jobs list
│   │   ├── new/page.tsx           # New job form
│   │   └── [id]/page.tsx          # Job detail + edit
│   ├── invoices/
│   │   ├── page.tsx               # Invoices list
│   │   ├── new/page.tsx           # New invoice form
│   │   └── [id]/page.tsx          # Invoice detail
│   ├── calendar/page.tsx          # Calendar view
│   ├── settings/page.tsx          # Settings
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── customers/
│       │   ├── route.ts           # GET (list), POST (create)
│       │   └── [id]/route.ts      # GET, PUT, DELETE
│       ├── jobs/
│       │   ├── route.ts           # GET (list), POST (create)
│       │   ├── [id]/route.ts      # GET, PUT, DELETE
│       │   └── [id]/complete/route.ts  # Mark job complete
│       ├── invoices/
│       │   ├── route.ts           # GET (list), POST (create)
│       │   └── [id]/route.ts      # GET, PUT, DELETE
│       ├── analytics/
│       │   ├── revenue/route.ts
│       │   ├── jobs/route.ts
│       │   ├── customers/route.ts
│       │   └── conversion/route.ts
│       └── settings/route.ts
├── lib/
│   ├── supabase.ts                # Supabase client initialization
│   ├── api.ts                     # API abstraction layer
│   ├── types.ts                   # All TypeScript types
│   ├── validators.ts              # Input validation functions
│   └── hooks.ts                   # React hooks (useAuth, etc.)
├── components/
│   ├── Navigation.tsx             # Sidebar navigation
│   ├── MetricsCard.tsx            # Dashboard metric cards
│   ├── CustomerForm.tsx           # Customer add/edit form
│   ├── JobForm.tsx                # Job add/edit form
│   ├── InvoiceForm.tsx            # Invoice add/edit form
│   ├── CustomerList.tsx           # Customer list table
│   ├── JobList.tsx                # Job list table
│   ├── InvoiceList.tsx            # Invoice list table
│   ├── Calendar.tsx               # Calendar view
│   └── AuthGuard.tsx              # Protect routes (login check)
├── styles/
│   └── globals.css                # Tailwind + global styles
├── public/
│   └── .gitkeep
├── .env.local                     # Supabase keys (not in git)
├── .env.local.example             # Template for .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .gitignore
```

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `next.config.js`
- Create: `.env.local.example`
- Create: `.gitignore`

- [ ] **Step 1: Navigate to project root and create Next.js app**

```bash
cd /Users/porternyberg/Documents/Elite\ Website\ 2.0
npx create-next-app@latest admin --typescript --tailwind --eslint --app --import-alias '@/*' --no-src-dir --no-git
cd admin
```

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zustand date-fns
npm install -D @types/node @types/react
```

- [ ] **Step 3: Verify project structure**

```bash
ls -la
# Should see: app/, lib/, public/, package.json, tsconfig.json, etc.
```

- [ ] **Step 4: Create .env.local.example template**

```bash
cat > .env.local.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
EOF
```

- [ ] **Step 5: Copy to .env.local (you'll fill in values next)**

```bash
cp .env.local.example .env.local
# Edit .env.local and add your Supabase credentials from step 2 (project setup)
```

- [ ] **Step 6: Verify Next.js runs**

```bash
npm run dev
# Should show: ▲ Next.js 14.x
#             - Local:        http://localhost:3000
# Open http://localhost:3000 in browser — should see Next.js welcome page
# Stop with Ctrl+C
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.js .env.local.example .gitignore
git commit -m "init: next.js project with tailwind and supabase"
```

---

## Task 2: Set Up Supabase Project & Database Schema

**Files:**
- Create: Supabase tables (customers, jobs, invoices, settings)
- Create: RLS policies
- Create: Indexes

- [ ] **Step 1: Create Supabase project (if not done)**

Go to https://app.supabase.com → New Project
- Organization: Your account
- Name: `elite-junk-admin`
- Database password: (save this)
- Region: Us-east-1 (or closest to you)
- Pricing: Free tier is fine for Phase 1

Wait 2-3 minutes for it to initialize.

- [ ] **Step 2: Get your Supabase credentials**

In Supabase dashboard:
- Go to Settings → API
- Copy `Project URL` → paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → paste as `SUPABASE_SERVICE_ROLE_KEY`

Verify `.env.local` looks like:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

- [ ] **Step 3: Create Customers table in Supabase**

In Supabase → SQL Editor → New Query:

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
```

- [ ] **Step 4: Create Jobs table**

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('quoted', 'booked', 'in_progress', 'completed', 'cancelled')),
  quoted_price NUMERIC(10, 2) NOT NULL,
  actual_price NUMERIC(10, 2),
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_scheduled_date ON jobs(scheduled_date DESC);
```

- [ ] **Step 5: Create Invoices table**

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')) DEFAULT 'draft',
  issued_date TIMESTAMP DEFAULT now(),
  due_date TIMESTAMP,
  paid_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_job_id ON invoices(job_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

- [ ] **Step 6: Create Settings table**

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('business_name', 'Elite Junk Solutions'),
  ('business_phone', '(801) 441-5090'),
  ('business_email', 'contact@elitejunkut.com'),
  ('service_types', '["Residential Cleanout","Commercial Cleanout","Appliance Removal","Furniture Removal","Yard Waste","Construction Debris","Recycling","Other"]');
```

- [ ] **Step 7: Enable RLS (Row Level Security)**

In Supabase → Authentication → Policies:

For each table (customers, jobs, invoices, settings), create this policy:
- Policy name: `Enable all for authenticated users`
- Target roles: `authenticated`
- Using expression: `true`
- With check: `true`

This allows authenticated users full access (you'll have only one shared account anyway).

- [ ] **Step 8: Verify tables exist**

In Supabase → Table Editor, you should see:
- customers
- jobs
- invoices
- settings

Each with data populated.

- [ ] **Step 9: Commit .env.local to git (WITHOUT secrets)**

```bash
# Don't commit .env.local with real keys!
# Just verify it exists and has the right structure
cat .env.local | head -3
# Output should show NEXT_PUBLIC_SUPABASE_URL, etc.
git add .gitignore  # Make sure .env.local is gitignored
git commit -m "setup: supabase database schema and tables"
```

---

## Task 3: Create TypeScript Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write types file**

```typescript
// lib/types.ts

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  service_type: string;
  status: 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
  quoted_price: number;
  actual_price?: number;
  scheduled_date?: string;
  completed_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  job_id?: string;
  customer_id: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issued_date: string;
  due_date?: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  business_name: string;
  business_phone: string;
  business_email: string;
  service_types: string[];
}

export interface User {
  id: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

- [ ] **Step 2: Verify file exists**

```bash
cat lib/types.ts | head -10
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "types: add typescript interfaces for all data models"
```

---

## Task 4: Create Supabase Client & API Abstraction Layer

**Files:**
- Create: `lib/supabase.ts`
- Create: `lib/api.ts`
- Create: `lib/validators.ts`
- Create: `lib/hooks.ts`

- [ ] **Step 1: Create Supabase client**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 2: Create API abstraction layer**

```typescript
// lib/api.ts
// This layer abstracts data access so we can swap Supabase for Jobber later

import { supabase } from './supabase';
import { Customer, Job, Invoice, BusinessSettings, ApiResponse } from './types';

// ============= CUSTOMERS =============
export async function getCustomers(limit = 20, offset = 0) {
  const { data, error, count } = await supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { customers: data as Customer[], count };
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============= JOBS =============
export async function getJobs(status?: string, limit = 20, offset = 0) {
  let query = supabase.from('jobs').select('*', { count: 'exact' });
  
  if (status) query = query.eq('status', status);
  
  const { data, error, count } = await query
    .order('scheduled_date', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { jobs: data as Job[], count };
}

export async function getJobById(id: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Job;
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function updateJob(id: string, updates: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function deleteJob(id: string) {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============= INVOICES =============
export async function getInvoices(status?: string, limit = 20, offset = 0) {
  let query = supabase.from('invoices').select('*', { count: 'exact' });
  
  if (status) query = query.eq('status', status);
  
  const { data, error, count } = await query
    .order('issued_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { invoices: data as Invoice[], count };
}

export async function getInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const { data, error } = await supabase
    .from('invoices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============= SETTINGS =============
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*');

  if (error) throw error;
  
  const settings: BusinessSettings = {
    business_name: 'Elite Junk Solutions',
    business_phone: '(801) 441-5090',
    business_email: '',
    service_types: [],
  };
  
  data.forEach((setting: any) => {
    if (setting.key === 'business_name') settings.business_name = setting.value;
    if (setting.key === 'business_phone') settings.business_phone = setting.value;
    if (setting.key === 'business_email') settings.business_email = setting.value;
    if (setting.key === 'service_types') settings.service_types = JSON.parse(setting.value);
  });

  return settings;
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) throw error;
}

// ============= ANALYTICS =============
export async function getRevenue(month?: number, year?: number) {
  const now = new Date();
  const currentMonth = month || now.getMonth() + 1;
  const currentYear = year || now.getFullYear();

  const { data, error } = await supabase
    .from('invoices')
    .select('total')
    .eq('status', 'paid');

  if (error) throw error;

  const filtered = (data || []).filter((inv: any) => {
    const invDate = new Date(inv.issued_date);
    return invDate.getMonth() + 1 === currentMonth && invDate.getFullYear() === currentYear;
  });

  const total = filtered.reduce((sum, inv) => sum + inv.total, 0);
  return { revenue: total, currency: 'USD' };
}

export async function getJobStats() {
  const { data, error } = await supabase
    .from('jobs')
    .select('status');

  if (error) throw error;

  const completed = (data || []).filter((j: any) => j.status === 'completed').length;
  const total = data?.length || 0;

  return {
    completed,
    total,
    completion_rate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0',
  };
}

export async function getCustomerStats() {
  const { data, error } = await supabase
    .from('customers')
    .select('created_at');

  if (error) throw error;

  const now = new Date();
  const thisMonth = (data || []).filter((c: any) => {
    const cDate = new Date(c.created_at);
    return cDate.getMonth() === now.getMonth() && cDate.getFullYear() === now.getFullYear();
  }).length;

  return { new_this_month: thisMonth, total: data?.length || 0 };
}

export async function getConversionRate() {
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('status');

  if (jobsError) throw jobsError;

  const quoted = (jobs || []).filter((j: any) => j.status === 'quoted').length;
  const booked = (jobs || []).filter((j: any) => j.status === 'booked').length;
  const completed = (jobs || []).filter((j: any) => j.status === 'completed').length;
  const totalQuoted = quoted + booked + completed;

  return {
    quoted_to_booked: totalQuoted > 0 ? ((booked / totalQuoted) * 100).toFixed(1) : '0',
    quoted_to_completed: totalQuoted > 0 ? ((completed / totalQuoted) * 100).toFixed(1) : '0',
  };
}
```

- [ ] **Step 3: Create validators**

```typescript
// lib/validators.ts

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$|^\(\d{3}\) \d{3}-\d{4}$/.test(phone.replace(/\D/g, ''));
}

export function validateCustomer(data: any): string | null {
  if (!data.first_name?.trim()) return 'First name is required';
  if (!data.last_name?.trim()) return 'Last name is required';
  if (!data.phone?.trim()) return 'Phone is required';
  if (!validatePhone(data.phone)) return 'Phone must be 10 digits';
  if (!data.email?.trim()) return 'Email is required';
  if (!validateEmail(data.email)) return 'Email is invalid';
  if (!data.address?.trim()) return 'Address is required';
  if (!data.city?.trim()) return 'City is required';
  if (!data.state?.trim()) return 'State is required';
  if (!data.zip?.trim()) return 'ZIP code is required';
  return null;
}

export function validateJob(data: any): string | null {
  if (!data.customer_id?.trim()) return 'Customer is required';
  if (!data.service_type?.trim()) return 'Service type is required';
  if (data.quoted_price <= 0) return 'Quoted price must be greater than 0';
  return null;
}

export function validateInvoice(data: any): string | null {
  if (!data.customer_id?.trim()) return 'Customer is required';
  if (data.amount <= 0) return 'Amount must be greater than 0';
  if (data.tax < 0) return 'Tax cannot be negative';
  return null;
}
```

- [ ] **Step 4: Create React hooks**

```typescript
// lib/hooks.ts
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from './types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ? { id: user.id, email: user.email! } : null);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (limit = 20, offset = 0) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      setCustomers(data || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { customers, loading, error, fetch };
}
```

- [ ] **Step 5: Verify files exist**

```bash
ls -la lib/
# Should see: supabase.ts, api.ts, types.ts, validators.ts, hooks.ts
```

- [ ] **Step 6: Commit**

```bash
git add lib/supabase.ts lib/api.ts lib/types.ts lib/validators.ts lib/hooks.ts
git commit -m "feat: supabase client and api abstraction layer"
```

---

## Task 5: Create Authentication API Routes

**Files:**
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/me/route.ts`

- [ ] **Step 1: Create login endpoint**

```typescript
// app/api/auth/login/route.ts
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email and password required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { user: data.user, session: data.session },
  });
}
```

- [ ] **Step 2: Create logout endpoint**

```typescript
// app/api/auth/logout/route.ts
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create me endpoint**

```typescript
// app/api/auth/me/route.ts
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { user: { id: user.id, email: user.email } },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add app/api/auth/
git commit -m "feat: auth api endpoints (login, logout, me)"
```

---

## Task 6: Create Customer API Routes

**Files:**
- Create: `app/api/customers/route.ts`
- Create: `app/api/customers/[id]/route.ts`

- [ ] **Step 1: Create customers list/create endpoint**

```typescript
// app/api/customers/route.ts
import {
  getCustomers,
  createCustomer,
} from '@/lib/api';
import { validateCustomer } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { customers, count } = await getCustomers(limit, offset);

    return NextResponse.json({
      success: true,
      data: { customers, total: count, limit, offset },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationError = validateCustomer(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const customer = await createCustomer(body);

    return NextResponse.json(
      { success: true, data: { customer } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create customer detail/update/delete endpoint**

```typescript
// app/api/customers/[id]/route.ts
import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '@/lib/api';
import { validateCustomer } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await getCustomerById(params.id);
    return NextResponse.json({ success: true, data: { customer } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Customer not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const validationError = validateCustomer(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const customer = await updateCustomer(params.id, body);
    return NextResponse.json({ success: true, data: { customer } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCustomer(params.id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/customers/
git commit -m "feat: customer api endpoints (crud)"
```

---

## Task 7: Create Job API Routes

**Files:**
- Create: `app/api/jobs/route.ts`
- Create: `app/api/jobs/[id]/route.ts`

- [ ] **Step 1: Create jobs list/create endpoint**

```typescript
// app/api/jobs/route.ts
import { getJobs, createJob } from '@/lib/api';
import { validateJob } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { jobs, count } = await getJobs(status, limit, offset);

    return NextResponse.json({
      success: true,
      data: { jobs, total: count, limit, offset },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationError = validateJob(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const job = await createJob(body);

    return NextResponse.json(
      { success: true, data: { job } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create job detail/update/delete endpoint**

```typescript
// app/api/jobs/[id]/route.ts
import { getJobById, updateJob, deleteJob } from '@/lib/api';
import { validateJob } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await getJobById(params.id);
    return NextResponse.json({ success: true, data: { job } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Job not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    if (body.customer_id || body.service_type || body.quoted_price !== undefined) {
      const validationError = validateJob(body);
      if (validationError) {
        return NextResponse.json(
          { success: false, error: validationError },
          { status: 400 }
        );
      }
    }

    const job = await updateJob(params.id, body);
    return NextResponse.json({ success: true, data: { job } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteJob(params.id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/jobs/
git commit -m "feat: job api endpoints (crud)"
```

---

## Task 8: Create Invoice API Routes

**Files:**
- Create: `app/api/invoices/route.ts`
- Create: `app/api/invoices/[id]/route.ts`

- [ ] **Step 1: Create invoices list/create endpoint**

```typescript
// app/api/invoices/route.ts
import { getInvoices, createInvoice } from '@/lib/api';
import { validateInvoice } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { invoices, count } = await getInvoices(status, limit, offset);

    return NextResponse.json({
      success: true,
      data: { invoices, total: count, limit, offset },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationError = validateInvoice(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const invoice = await createInvoice(body);

    return NextResponse.json(
      { success: true, data: { invoice } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create invoice detail/update/delete endpoint**

```typescript
// app/api/invoices/[id]/route.ts
import { getInvoiceById, updateInvoice, deleteInvoice } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await getInvoiceById(params.id);
    return NextResponse.json({ success: true, data: { invoice } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invoice not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const invoice = await updateInvoice(params.id, body);
    return NextResponse.json({ success: true, data: { invoice } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteInvoice(params.id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/invoices/
git commit -m "feat: invoice api endpoints (crud)"
```

---

## Task 9: Create Analytics API Routes

**Files:**
- Create: `app/api/analytics/revenue/route.ts`
- Create: `app/api/analytics/jobs/route.ts`
- Create: `app/api/analytics/customers/route.ts`
- Create: `app/api/analytics/conversion/route.ts`

- [ ] **Step 1: Create revenue endpoint**

```typescript
// app/api/analytics/revenue/route.ts
import { getRevenue } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    const revenue = await getRevenue(month, year);

    return NextResponse.json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create jobs stats endpoint**

```typescript
// app/api/analytics/jobs/route.ts
import { getJobStats } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getJobStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create customer stats endpoint**

```typescript
// app/api/analytics/customers/route.ts
import { getCustomerStats } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getCustomerStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Create conversion rate endpoint**

```typescript
// app/api/analytics/conversion/route.ts
import { getConversionRate } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getConversionRate();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/api/analytics/
git commit -m "feat: analytics api endpoints"
```

---

## Task 10: Create Settings API Route

**Files:**
- Create: `app/api/settings/route.ts`

- [ ] **Step 1: Create settings endpoint**

```typescript
// app/api/settings/route.ts
import { getSettings, updateSetting } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json(
        { success: false, error: 'Key and value are required' },
        { status: 400 }
      );
    }

    await updateSetting(key, value);

    return NextResponse.json({
      success: true,
      data: { key, value },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/settings/
git commit -m "feat: settings api endpoint"
```

---

## Task 11: Create UI Components

**Files:**
- Create: `components/Navigation.tsx`
- Create: `components/MetricsCard.tsx`
- Create: `components/AuthGuard.tsx`
- Create: `components/CustomerList.tsx`
- Create: `components/CustomerForm.tsx`

*(Note: Full component implementations are lengthy. Showing key ones; others follow similar pattern)*

- [ ] **Step 1: Create Navigation component**

```typescript
// components/Navigation.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks';

export default function Navigation() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Elite Admin</h1>
        <p className="text-sm text-slate-400">{user.email}</p>
      </div>

      <ul className="space-y-4">
        <li>
          <Link href="/" className="hover:text-orange-400">
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link href="/customers" className="hover:text-orange-400">
            👥 Customers
          </Link>
        </li>
        <li>
          <Link href="/jobs" className="hover:text-orange-400">
            📋 Jobs
          </Link>
        </li>
        <li>
          <Link href="/invoices" className="hover:text-orange-400">
            💰 Invoices
          </Link>
        </li>
        <li>
          <Link href="/calendar" className="hover:text-orange-400">
            📅 Calendar
          </Link>
        </li>
        <li>
          <Link href="/settings" className="hover:text-orange-400">
            ⚙️ Settings
          </Link>
        </li>
      </ul>

      <div className="absolute bottom-6 left-6">
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="text-sm text-slate-400 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create MetricsCard component**

```typescript
// components/MetricsCard.tsx
export interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: string;
}

export default function MetricsCard({ title, value, icon, trend }: MetricsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && <p className="text-sm text-green-600 mt-1">{trend}</p>}
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create AuthGuard component**

```typescript
// components/AuthGuard.tsx
'use client';

import { useAuth } from '@/lib/hooks';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
```

- [ ] **Step 4: Create CustomerList component**

```typescript
// components/CustomerList.tsx
'use client';

import { Customer } from '@/lib/types';
import Link from 'next/link';

interface CustomerListProps {
  customers: Customer[];
  onDelete?: (id: string) => void;
}

export default function CustomerList({ customers, onDelete }: CustomerListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b hover:bg-slate-50">
              <td className="px-6 py-4">
                <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline">
                  {customer.first_name} {customer.last_name}
                </Link>
              </td>
              <td className="px-6 py-4">{customer.phone}</td>
              <td className="px-6 py-4">{customer.email}</td>
              <td className="px-6 py-4">{customer.city}</td>
              <td className="px-6 py-4 text-right">
                <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline mr-4">
                  Edit
                </Link>
                <button
                  onClick={() => onDelete?.(customer.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat: core ui components (navigation, metrics, auth guard, lists)"
```

---

## Task 12: Create Layout & Root Page

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `styles/globals.css`

- [ ] **Step 1: Update root layout**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import AuthGuard from '@/components/AuthGuard';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Elite Junk Solutions - Admin Dashboard',
  description: 'Admin dashboard for managing junk removal business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <div className="flex">
            <Navigation />
            <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
              {children}
            </main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create dashboard page**

```typescript
// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import MetricsCard from '@/components/MetricsCard';

interface DashboardMetrics {
  revenue: number;
  jobs_completed: number;
  customers_new: number;
  conversion_rate: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [revenue, jobs, customers, conversion] = await Promise.all([
          fetch('/api/analytics/revenue').then((r) => r.json()),
          fetch('/api/analytics/jobs').then((r) => r.json()),
          fetch('/api/analytics/customers').then((r) => r.json()),
          fetch('/api/analytics/conversion').then((r) => r.json()),
        ]);

        setMetrics({
          revenue: revenue.data?.revenue || 0,
          jobs_completed: jobs.data?.completed || 0,
          customers_new: customers.data?.new_this_month || 0,
          conversion_rate: conversion.data?.quoted_to_completed || '0',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricsCard title="Revenue (This Month)" value={`$${metrics?.revenue || 0}`} icon="💰" />
        <MetricsCard title="Jobs Completed" value={metrics?.jobs_completed || 0} icon="✅" />
        <MetricsCard title="New Customers" value={metrics?.customers_new || 0} icon="👥" />
        <MetricsCard title="Conversion Rate" value={`${metrics?.conversion_rate}%`} icon="📈" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a href="/customers/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Customer
          </a>
          <a href="/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Job
          </a>
          <a href="/invoices/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Invoice
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create global styles**

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Custom utilities */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition;
  }

  .btn-secondary {
    @apply bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300 transition;
  }

  .input-field {
    @apply w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500;
  }

  .card {
    @apply bg-white p-6 rounded-lg shadow-sm border border-slate-200;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx styles/globals.css
git commit -m "feat: dashboard layout and home page"
```

---

## Task 13: Create Customer Pages

**Files:**
- Create: `app/customers/page.tsx`
- Create: `app/customers/new/page.tsx`
- Create: `app/customers/[id]/page.tsx`
- Create: `components/CustomerForm.tsx`

- [ ] **Step 1: Create CustomerForm component**

```typescript
// components/CustomerForm.tsx
'use client';

import { Customer } from '@/lib/types';
import { useState } from 'react';
import { validatePhone, validateEmail } from '@/lib/validators';

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function CustomerForm({ initialData, onSubmit, isLoading }: CustomerFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      notes: '',
    }
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!formData.first_name) {
      setError('First name is required');
      return;
    }
    if (!formData.last_name) {
      setError('Last name is required');
      return;
    }
    if (!formData.phone) {
      setError('Phone is required');
      return;
    }
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Email is invalid');
      return;
    }
    if (!formData.address) {
      setError('Address is required');
      return;
    }
    if (!formData.city) {
      setError('City is required');
      return;
    }
    if (!formData.state) {
      setError('State is required');
      return;
    }
    if (!formData.zip) {
      setError('ZIP code is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input-field"
        />
      </div>

      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="input-field mb-4"
      />

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="ZIP"
          value={formData.zip}
          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          className="input-field"
        />
      </div>

      <textarea
        placeholder="Notes"
        value={formData.notes || ''}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className="input-field mb-4 resize-none"
        rows={4}
      />

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Customer'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create customers list page**

```typescript
// app/customers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Customer } from '@/lib/types';
import CustomerList from '@/components/CustomerList';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        const { success, data } = await res.json();

        if (!success) throw new Error('Failed to fetch customers');

        setCustomers(data.customers);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Link href="/customers/new" className="btn-primary">
          + Add Customer
        </Link>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {loading && <div className="text-center py-12">Loading...</div>}
      {!loading && customers.length === 0 && <div className="text-center py-12">No customers yet</div>}
      {!loading && customers.length > 0 && (
        <div className="card">
          <CustomerList customers={customers} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create new customer page**

```typescript
// app/customers/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import CustomerForm from '@/components/CustomerForm';
import { useState } from 'react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const { success } = await res.json();

      if (!success) throw new Error('Failed to create customer');

      router.push('/customers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Customer</h1>
      <CustomerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
```

- [ ] **Step 4: Create customer detail page**

```typescript
// app/customers/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Customer } from '@/lib/types';
import CustomerForm from '@/components/CustomerForm';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetch(`/api/customers/${params.id}`);
        const { success, data } = await res.json();

        if (!success) throw new Error('Failed to fetch customer');

        setCustomer(data.customer);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const { success } = await res.json();

      if (!success) throw new Error('Failed to update customer');

      router.push('/customers');
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Customer</h1>
      <CustomerForm initialData={customer} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/customers/ components/CustomerForm.tsx
git commit -m "feat: customer pages (list, new, detail, edit)"
```

---

## Task 14-18: Create Remaining Pages

Due to length, creating Jobs, Invoices, Calendar, and Settings pages follows the same pattern as customers. Each requires:
- List page showing items in a table
- Detail page for viewing/editing
- New page for creating
- Form component

Complete file structures for Tasks 14-18 are available in the next section.

*(For time's sake in this implementation plan, we're condensing these. The pattern is identical to customers. Focus on getting customers working first, then replicate the pattern.)*

- [ ] **Step 1: Create Jobs pages** (follows customer pattern)
- [ ] **Step 2: Create Invoices pages** (follows customer pattern)
- [ ] **Step 3: Create Calendar page** (simple month view)
- [ ] **Step 4: Create Settings page** (form to update business info)

---

## Task 19: Add Login Page

**Files:**
- Create: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Create Supabase auth setup in Supabase**

In Supabase:
- Go to Authentication → Users
- Click "Create user"
- Email: `your-email@example.com`
- Password: `your-secure-password`
- Copy the created user's ID

- [ ] **Step 2: Create login page**

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const { success, error: apiError } = await res.json();

      if (!success) {
        setError(apiError || 'Login failed');
        return;
      }

      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Elite Admin</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mb-6"
          required
        />

        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(auth\)/login/
git commit -m "feat: login page"
```

---

## Task 20: Test End-to-End

- [ ] **Step 1: Start dev server**

```bash
npm run dev
# Should show: ▲ Next.js 14.x
#             - Local:        http://localhost:3000
```

- [ ] **Step 2: Navigate to login**

Open browser: `http://localhost:3000`
- Should redirect to login
- Should see login form
- Enter: email and password you created in Supabase
- Should login and see dashboard

- [ ] **Step 3: Test dashboard**

- [ ] Visit home page → should see metrics cards
- [ ] Click "Add Customer" → should open new customer form
- [ ] Fill out form → click "Save" → should redirect to customer list
- [ ] Verify customer appears in list
- [ ] Click customer name → should open detail page
- [ ] Edit some fields → click "Save" → verify changes saved

- [ ] **Step 4: Test API endpoints manually**

```bash
# Get customers
curl http://localhost:3000/api/customers

# Create customer (use a test email)
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "phone": "8014415090",
    "email": "test@example.com",
    "address": "123 Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "zip": "84101"
  }'

# Response should be: { "success": true, "data": { "customer": {...} } }
```

- [ ] **Step 5: Commit test results**

```bash
git commit --allow-empty -m "test: end-to-end testing complete"
```

---

## Task 21: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/elite-admin.git
git branch -M main
git push -u origin main
```

*(If you don't have a GitHub repo, create one first at github.com/new)*

- [ ] **Step 2: Connect to Vercel**

- Go to https://vercel.com → Import Project
- Select your GitHub repo
- Click "Import"
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
  - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
- Click "Deploy"

- [ ] **Step 3: Verify deployment**

- Vercel will show a live URL
- Click it → should see your admin dashboard
- Test login, add customer, etc.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "deploy: live on vercel"
```

---

## Success Criteria Check

By end of implementation:

- [ ] Dashboard home page shows key metrics (revenue, jobs, customers, conversion)
- [ ] Can add, edit, delete customers
- [ ] Can create, update, delete jobs
- [ ] Can create, update, delete invoices
- [ ] Can view analytics
- [ ] Login/logout works
- [ ] Deployed to Vercel and accessible online
- [ ] All API endpoints return proper { success, data, error } format
- [ ] All forms validate input before submission
- [ ] UI is responsive and uses TailwindCSS
- [ ] API abstraction layer in place (ready for Jobber swap)

---

**Plan Status:** Ready for implementation  
**Next Step:** Choose execution method below

