# KhetSe Web — Architecture & Layout Guide

> **Repository:** `khetse-web`  
> **Purpose:** Next.js 16 storefront and admin dashboard for the KhetSe food brand.  
> **Key Tech:** Next.js (App Router), TypeScript, Tailwind CSS v4, @supabase/ssr.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BROWSER (Client)                               │
│                                                                         │
│  ┌───────────────────────┐    ┌──────────────────────────────────────┐  │
│  │  Server Components    │    │  Client Components ("use client")    │  │
│  │  (HTML streamed)      │    │  (JS hydrated)                      │  │
│  │                       │    │                                      │  │
│  │  - Homepage           │    │  - Navbar (mobile menu toggle)       │  │
│  │  - Login Page         │    │  - Footer (form onSubmit)            │  │
│  │  - Product Pages      │    │  - Cart Drawer (future)              │  │
│  └───────────┬───────────┘    └──────────────────────────────────────┘  │
│              │                                                          │
└──────────────┼──────────────────────────────────────────────────────────┘
               │
               │  Server Actions (form submissions)
               │  Data fetching (RSC await)
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER (Node.js)                           │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Server Actions ("use server")                                   │   │
│  │  - login()   → supabase.auth.signInWithPassword()               │   │
│  │  - signup()  → supabase.auth.signUp()                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Supabase Client (utils/supabase/server.ts)                     │   │
│  │  - Creates cookie-based server client via @supabase/ssr          │   │
│  │  - Auth tokens stored in httpOnly cookies (XSS safe)            │   │
│  │  - Used by RSCs and Server Actions                               │   │
│  └───────────────────────────┬──────────────────────────────────────┘   │
│                              │                                          │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               │  PostgREST API + GoTrue Auth
                               ▼
                    ┌─────────────────────┐
                    │   Supabase          │
                    │   (khetse-backend)  │
                    │                     │
                    │   PostgreSQL DB     │
                    │   Auth (GoTrue)     │
                    │   Storage (S3)      │
                    └─────────────────────┘
```

---

## Directory Layout

```
khetse-web/
│
├── app/                                  # Next.js App Router root
│   │
│   ├── layout.tsx                        # Root layout (html, body, fonts)
│   ├── globals.css                       # Tailwind v4 imports + @theme +
│   │                                       @config reference + body defaults
│   ├── favicon.ico
│   │
│   ├── (shop)/                           # Route group: public storefront
│   │   │                                   (no /shop prefix in URL)
│   │   ├── layout.tsx                    # Shop shell: Navbar + Footer
│   │   ├── page.tsx                      # Homepage (RSC)
│   │   │                                   - Hero section
│   │   │                                   - Featured Harvest (from DB)
│   │   │                                   - Why Subscribe section
│   │   │
│   │   └── login/                        # Auth route: /login
│   │       ├── page.tsx                  # Login/Signup form (RSC)
│   │       └── actions.ts               # Server Actions: login(), signup()
│   │
│   ├── (admin)/                          # Route group: admin dashboard
│   │   └── dashboard/                    # (future implementation)
│   │
│   └── components/                       # Shared UI components
│       ├── Navbar.tsx                    # Sticky nav ("use client")
│       └── Footer.tsx                   # Brand footer ("use client")
│
├── utils/
│   └── supabase/
│       ├── server.ts                     # Server-side Supabase client
│       │                                   (cookie-based, for RSC + Actions)
│       └── client.ts                     # Browser-side Supabase client
│                                           (for Client Components)
│
├── types/
│   └── database.types.ts                 # TypeScript types generated from
│                                           khetse-backend/types.ts (copied)
│                                           Exports: Database, Tables<>,
│                                           TablesInsert<>, Enums<>
│
├── tailwind.config.ts                    # Brand color tokens:
│                                           brand-primary   (#1E2A38)
│                                           brand-secondary (#2E7D32)
│                                           brand-accent    (#C59B27)
│                                           brand-canvas    (#FDFBF7)
│
├── next.config.ts                        # Next.js config (allowedDevOrigins)
├── tsconfig.json                         # TypeScript config (@/* path alias)
├── postcss.config.mjs                    # PostCSS → @tailwindcss/postcss
├── package.json                          # Dependencies
└── .env.local                            # Supabase URL + Anon Key (local)
```

---

## Request Flow: Page Load (Server Component)

```
GET /                   Next.js App Router
  │                           │
  │                     ┌─────┴──────┐
  │                     │ (shop)/     │
  │                     │ layout.tsx  │   ← Renders Navbar + Footer
  │                     └─────┬──────┘
  │                           │
  │                     ┌─────┴──────┐
  │                     │ (shop)/     │
  │                     │ page.tsx    │   ← RSC: fetches products server-side
  │                     └─────┬──────┘
  │                           │
  │                    createClient()
  │                    (server.ts)
  │                           │
  │                    supabase.from("products")
  │                    .select("*")
  │                    .eq("is_active", true)
  │                           │
  │                     Supabase DB
  │                     (PostgREST)
  │                           │
  │                     RLS Policy:
  │                     "Active products are
  │                      viewable by everyone"
  │                           │
  │                    Products[] returned
  │                           │
  │                    HTML streamed to browser
  │ <─────────────────────────│
```

---

## Request Flow: Login (Server Action)

```
POST /login             Next.js Server
  │                           │
  │   FormData:               │
  │   email, password         │
  │ ─────────────────────────>│
  │                           │
  │                     login() Server Action
  │                     (actions.ts)
  │                           │
  │                    createClient()
  │                    supabase.auth
  │                    .signInWithPassword()
  │                           │
  │                     ┌─────┴─────┐
  │                     │           │
  │                  Success     Error
  │                     │           │
  │              revalidatePath  redirect to
  │              redirect("/")   /login?error=...
  │                     │
  │   Set-Cookie:       │
  │   sb-*-auth-token   │
  │ <───────────────────│
```

---

## Brand Color System

| Token | Hex | Usage |
|---|---|---|
| `brand-primary` | `#1E2A38` | Headers, nav, primary text, form labels |
| `brand-secondary` | `#2E7D32` | CTAs, success states, "Add to Cart" |
| `brand-accent` | `#C59B27` | Badges, highlights, category pills |
| `brand-canvas` | `#FDFBF7` | Page backgrounds, card backgrounds |

Use these via Tailwind utilities: `bg-brand-primary`, `text-brand-canvas`, `border-brand-accent/20`, etc.
