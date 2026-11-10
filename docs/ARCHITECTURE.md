# Frontend Architecture & Design System

## 1. System Overview

DocIntel AI is built with **Next.js 16 (App Router)**, **TypeScript**, **Redux Toolkit Query (RTK Query)**, and **Tailwind CSS v4**. The application follows a **feature-driven modular architecture** designed around high-performance real-time interactions, streaming Server-Sent Events (SSE), and a custom dual-theme design system (**Warm Cream** light mode and **Obsidian** dark mode).

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 16 App Router                         │
│  src/app/(auth)/* (Login, Register, Forgot)   src/app/dashboard/page   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Feature-Driven Modules                          │
│   src/features/auth         src/features/collections                   │
│   src/features/documents    src/features/chat                          │
│   src/features/home         src/features/theme                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     State & Network Infrastructure                     │
│  • Redux Toolkit Query (api-slice) with Auth Mutex Re-Authentication   │
│  • Native SSE Streaming Async Generator (ReadableStream / TextDecoder) │
│  • React 19 useSyncExternalStore Theme Subscription Guard             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / SSE via Next.js Proxy
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               FastAPI Backend + PostgreSQL / Supabase                  │
│       HTTP-Only JWT Cookies • Docling Parser • pgvector + BM25         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
ai-document-intelligence-frontend/
├── docs/                             # Production Architecture & Testing Playbooks
│   ├── ARCHITECTURE.md               # System design, state & UI patterns
│   ├── API_INTEGRATION.md            # Backend endpoint contracts & SSE protocol
│   └── TESTING_GUIDE.md              # End-to-end testing playbook
├── public/                           # Static assets & platform API postman spec
├── src/
│   ├── app/                          # Next.js 16 App Router (Thin Server Components)
│   │   ├── (auth)/                   # Authentication route group
│   │   ├── dashboard/                # Main AI workspace (/dashboard)
│   │   ├── globals.css               # Design system tokens, cubic-bezier easing
│   │   └── layout.tsx                # Root layout with Anti-FOUC theme script
│   ├── components/                   # Shared UI primitives
│   │   ├── theme-provider.tsx        # Zero-FOUC 2-state theme context
│   │   ├── theme-toggle.tsx          # Cream ☀️ / Obsidian 🌙 segmented control
│   │   └── ui/                       # Button, Input, Modal, Dropzone primitives
│   ├── config/                       # Type-safe environment configuration
│   ├── features/                     # Self-contained business feature modules
│   │   ├── auth/                     # Forms, slices, cookies, profile
│   │   ├── chat/                     # ChatGPT-style workspace, SSE stream, citations
│   │   ├── collections/              # Knowledge bases, CRUD modals, cascade delete
│   │   ├── documents/                # File upload dropzone, status polling, drawer
│   │   └── home/                     # Landing page & live document inspector
│   └── store/                        # Central Redux store & RTK Query base slice
│       ├── services/api-slice.ts     # Base query with token refresh mutex
│       └── index.ts                  # Root store configuration
```

---

## 3. Core Architectural Patterns

### 3.1 Feature-Driven Modular Pattern
All domain code is encapsulated inside `src/features/<feature-name>/`:
- `api/`: RTK Query endpoints injected into the central `apiSlice`.
- `components/`: UI components scoped strictly to this feature.
- `types/`: Domain TypeScript interfaces and API payload types.
- `utils/`: Feature-specific helper functions (e.g. byte formatting, category detection).
- `index.ts`: Public feature barrel export.

### 3.2 State Management & Network Layer
- **Redux Toolkit Query (`src/store/services/api-slice.ts`)**:
  - Centralized base query pointing to `/api/*` (proxied to FastAPI backend on `http://127.0.0.1:8000`).
  - Cache tag system with automated invalidation (`User`, `Collections`, `Documents`, `Threads`).
  - **Concurrency Mutex (`async-mutex`)**: When any query receives `HTTP 401 Unauthorized`, all in-flight requests pause while a single mutex lock dispatches `POST /auth/refresh-token`. Once cookies rotate, all pending requests replay automatically.
- **Real-Time Streaming (`src/features/chat/utils/sse-stream.ts`)**:
  - Consumes Server-Sent Events via `fetch` with `ReadableStreamDefaultReader` and `TextDecoder`.
  - Dispatches typed event stream: `metadata` (citations & thread metadata) → `token` (word-by-word streaming) → `done` (latency metrics) → `error`.
  - AbortController support allows the user to cancel generation anytime.

### 3.3 Design System & Theme Engine
- **Two Distinct Theme States**:
  - **Light Mode: Warm Cream**
    - Background: Canvas `#FAF8F5`, Surface `#F4EFE6`, Card `#FFFFFF`.
    - Borders: Warm stone `#E6DFD3`.
    - Text: Deep warm ink `#1C1917` with amber `#D97706` accents.
  - **Dark Mode: Deep Obsidian (Default)**
    - Background: Canvas `#0C0A09`, Surface `#141210`, Card `#191614`.
    - Borders: Deep stone `#292524`.
    - Text: Warm stone `#F5F5F4` with glowing amber accents.
- **Hydration & Anti-FOUC Guard**:
  - Subscribed via React 19's native `useSyncExternalStore` to eliminate hydration mismatch and cascading re-render warnings.
  - Inline head script in `src/app/layout.tsx` applies `.dark` before first paint.
- **Tactile Micro-Interactions (Emil Kowalski Philosophy)**:
  - Buttons use responsive `active:scale-[0.98]` physical depression.
  - Modals and drawers use hardware-accelerated transforms with `cubic-bezier(0.16, 1, 0.3, 1)`.
