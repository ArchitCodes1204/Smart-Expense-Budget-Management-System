# Smart Expense & Budget Management System

A full-stack, production-grade personal finance application for tracking expenses, managing budgets, generating reports, and receiving automated alerts. Built with React, Node.js, Express, PostgreSQL, and Drizzle ORM inside a TypeScript PNPM monorepo. Implements JWT authentication, Repository pattern, Observer pattern, Strategy pattern, and SOLID principles throughout.

---
**Hosted Link:-** https://smart-expense-budget-management-system-weop.onrender.com/


**Full Documentation:** [https://drive.google.com/drive/folders/1tk2u_1PCYppCrecRbUt5IQTJrSuBRCza?usp=sharing](https://drive.google.com/drive/folders/1tk2u_1PCYppCrecRbUt5IQTJrSuBRCza?usp=sharing)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (Vite), Wouter, React Query, TailwindCSS 4, Recharts, Framer Motion |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | Zod, OpenAPI 3.1, Orval (code generation) |
| Logging | Pino, pino-http |
| Security | CORS, Helmet-style headers, parameterized queries |
| Build | esbuild (backend), Vite (frontend), PNPM Workspaces |

---

## Features

- User registration and login with hashed passwords (bcrypt, 12 salt rounds)
- JWT-based stateless authentication with 7-day token expiry
- Full CRUD for expenses with pagination, filtering by category/budget/date range
- Budget management with configurable periods: `monthly`, `weekly`, `yearly`
- Automated budget alerts — notification at 90% usage (warning) and 100% (exceeded)
- Custom spending categories with user-defined colors and icons
- Real-time dashboard with summary cards, bar charts (monthly trend), and pie charts (by category)
- Financial report generation: `monthly`, `yearly`, or `custom` date ranges
- Notification system with read/unread management and mark-all-read
- Automatic transaction ledger — debit entries auto-created on expense logging
- Multi-currency support — USD and INR with locale-aware formatting
- Task ownership enforcement — every database query is scoped by `userId`
- Centralized error handling with database-unavailable and schema-missing detection
- End-to-end TypeScript type safety from database schema to React component

---

## Project Structure

```
Smart-Expense-Budget-Management-System/
├── lib/
│   ├── db/
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts               # User table (id, name, email, passwordHash)
│   │   │   │   ├── budgets.ts             # Budget table (limit, period, startDate)
│   │   │   │   ├── categories.ts          # Category table (name, color, icon)
│   │   │   │   ├── expenses.ts            # Expense table (amount, description, paymentMethod)
│   │   │   │   ├── transactions.ts        # Transaction table (type: debit/credit)
│   │   │   │   ├── reports.ts             # Report table (type, period, generatedAt)
│   │   │   │   ├── notifications.ts       # Notification table (message, type, isRead)
│   │   │   │   ├── payment-methods.ts     # PaymentMethod table
│   │   │   │   └── index.ts              # Barrel export for all schemas
│   │   │   └── index.ts                  # Drizzle client + connection pool
│   │   ├── drizzle.config.ts             # Drizzle Kit configuration
│   │   └── package.json
│   ├── api-spec/
│   │   ├── openapi.yaml                  # OpenAPI 3.1 specification (single source of truth)
│   │   └── orval.config.ts               # Orval code generation config
│   ├── api-zod/
│   │   └── src/generated/                # Auto-generated Zod validation schemas
│   └── api-client-react/
│       └── src/
│           ├── generated/                 # Auto-generated React Query hooks
│           └── custom-fetch.ts            # Custom fetch with auth token injection
├── artifacts/
│   ├── api-server/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts               # Register & login HTTP handlers
│   │   │   │   ├── expenses.ts           # CRUD expense handlers + budget alerts
│   │   │   │   ├── budgets.ts            # CRUD budget handlers + spent calculation
│   │   │   │   ├── categories.ts         # CRUD category handlers
│   │   │   │   ├── transactions.ts       # Transaction listing handler
│   │   │   │   ├── reports.ts            # Report generation + retrieval
│   │   │   │   ├── notifications.ts      # Notification listing + read management
│   │   │   │   ├── users.ts              # Profile get/update handlers
│   │   │   │   ├── dashboard.ts          # Dashboard summary, trends, spending
│   │   │   │   ├── health.ts             # Health check endpoint
│   │   │   │   └── index.ts              # Route aggregator
│   │   │   ├── domain/
│   │   │   │   └── entities.ts           # OOP domain classes + interfaces (IUser, IBudget...)
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts               # JWT generation, verification, bcrypt, authMiddleware
│   │   │   │   └── logger.ts             # Pino logger with sensitive field redaction
│   │   │   ├── app.ts                    # Express app setup (CORS, JSON, error handler)
│   │   │   └── index.ts                  # Server entry point (listen on PORT)
│   │   ├── build.mjs                     # esbuild bundling configuration
│   │   └── package.json
│   └── expense-app/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── dashboard.tsx          # Dashboard with charts and summary cards
│       │   │   ├── expenses.tsx           # Expense list, create, edit, delete
│       │   │   ├── budgets.tsx            # Budget management page
│       │   │   ├── categories.tsx         # Category management page
│       │   │   ├── reports.tsx            # Report generation and viewing
│       │   │   ├── notifications.tsx      # Notification center
│       │   │   ├── settings.tsx           # Profile and currency settings
│       │   │   ├── login.tsx              # Login page
│       │   │   ├── register.tsx           # Registration page
│       │   │   ├── landing.tsx            # Public landing page
│       │   │   └── not-found.tsx          # 404 page
│       │   ├── components/
│       │   │   ├── layout/                # App shell, sidebar, navigation
│       │   │   └── ui/                    # Reusable UI components (Card, Button, etc.)
│       │   ├── hooks/
│       │   │   ├── use-auth.tsx           # Auth context provider (login, register, logout)
│       │   │   ├── auth.ts                # Token storage (localStorage) + getter setup
│       │   │   ├── use-preferences.tsx    # Currency preference context (USD/INR)
│       │   │   ├── use-toast.ts           # Toast notification hook
│       │   │   └── use-mobile.tsx         # Responsive breakpoint hook
│       │   ├── App.tsx                    # Root component with routing + providers
│       │   ├── main.tsx                   # Application entry point
│       │   └── index.css                  # Global styles + TailwindCSS
│       ├── vite.config.ts                 # Vite build configuration + API proxy
│       └── package.json
├── scripts/
│   └── src/hello.ts                      # Utility script
├── pnpm-workspace.yaml                   # Workspace package definitions + catalog
├── tsconfig.base.json                    # Shared TypeScript configuration
├── .env.example                          # Environment variable template
├── .env.local                            # Local environment overrides
└── package.json                          # Root monorepo scripts
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PNPM (`corepack enable` to activate)
- A running PostgreSQL instance (local or cloud-hosted)

### 1. Clone the repository

```bash
git clone https://github.com/ArchitCodes1204/Smart-Expense-Budget-Management-System.git
cd Smart-Expense-Budget-Management-System
```

### 2. Install dependencies

```bash
corepack pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/finance_manager
SESSION_SECRET=change-me
APP_ORIGIN=http://localhost:3000
PORT=4001

# Frontend
VITE_API_BASE_URL=http://localhost:4001
VITE_API_PROXY_TARGET=http://localhost:4001
```

Generate a strong session secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Push database schema

```bash
DATABASE_URL=... corepack pnpm --filter @workspace/db run push
```

### 5. Start the services

**API Server** (runs at `http://localhost:4001`):
```bash
PORT=4001 SESSION_SECRET=... DATABASE_URL=... APP_ORIGIN=http://localhost:3000 corepack pnpm --filter @workspace/api-server run dev
```

**Web App** (runs at `http://localhost:3000`):
```bash
PORT=3000 BASE_PATH=/ VITE_API_BASE_URL=http://localhost:4001 corepack pnpm --filter @workspace/expense-app run dev
```

---

## API Reference

Base URL: `http://localhost:4001/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Health Endpoint

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/healthz` | No | Returns server health status |

### Auth Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive JWT token |
| POST | `/auth/logout` | Yes | Logout (invalidate client token) |

#### POST /auth/register
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "SecurePass@123"
}
```

#### POST /auth/login
```json
{
  "email": "ravi@example.com",
  "password": "SecurePass@123"
}
```
Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Ravi Kumar", "email": "ravi@example.com", "createdAt": "..." }
}
```

### User Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update profile (name, email, password) |

### Expense Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/expenses` | List expenses (paginated, filterable) |
| POST | `/expenses` | Create a new expense |
| GET | `/expenses/:id` | Get a single expense by ID |
| PATCH | `/expenses/:id` | Update an expense |
| DELETE | `/expenses/:id` | Delete an expense |

#### GET /expenses — Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `skip` | integer | 0 | Offset for pagination |
| `limit` | integer | 20 | Number of results per page |
| `categoryId` | integer | — | Filter by category |
| `budgetId` | integer | — | Filter by budget |
| `startDate` | string | — | Filter from this date |
| `endDate` | string | — | Filter until this date |

#### POST /expenses — Request Body
```json
{
  "amount": 850,
  "description": "Weekly groceries",
  "date": "2026-04-14T00:00:00.000Z",
  "paymentMethod": "debit_card",
  "categoryId": 3,
  "budgetId": 1
}
```

Valid `paymentMethod` values: `cash`, `credit_card`, `debit_card`, `bank_transfer`, `other`

### Budget Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/budgets` | List all budgets (with spent/remaining) |
| POST | `/budgets` | Create a new budget |
| GET | `/budgets/:id` | Get a single budget with spending stats |
| PATCH | `/budgets/:id` | Update a budget |
| DELETE | `/budgets/:id` | Delete a budget |

#### POST /budgets — Request Body
```json
{
  "name": "Monthly Groceries",
  "limit": 5000,
  "period": "monthly",
  "startDate": "2026-04-01T00:00:00.000Z",
  "endDate": null
}
```

Valid `period` values: `monthly`, `weekly`, `yearly`

Budget response includes computed fields:
```json
{
  "id": 1,
  "name": "Monthly Groceries",
  "limit": 5000,
  "spent": 3200,
  "remaining": 1800,
  "percentUsed": 64
}
```

### Category Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/categories` | List all user categories |
| POST | `/categories` | Create a new category |
| PATCH | `/categories/:id` | Update a category |
| DELETE | `/categories/:id` | Delete a category |

#### POST /categories — Request Body
```json
{
  "name": "Food & Dining",
  "color": "#ef4444",
  "icon": "utensils"
}
```

### Dashboard Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard/summary` | Aggregated stats (totals, counts, budget %) |
| GET | `/dashboard/spending-by-category` | Spending grouped by category |
| GET | `/dashboard/monthly-trend` | Spending trend over last 6 months |
| GET | `/dashboard/recent-expenses` | Latest 5 expense entries |

#### GET /dashboard/summary — Response
```json
{
  "totalExpensesThisMonth": 12500,
  "totalExpensesLastMonth": 9800,
  "totalBudget": 20000,
  "budgetUsedPercent": 62.5,
  "expenseCount": 23,
  "budgetCount": 4,
  "categoryCount": 6,
  "unreadNotifications": 2
}
```

### Report Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reports` | List all generated reports |
| POST | `/reports` | Generate a new report |
| GET | `/reports/:id` | Get report with full data |

#### POST /reports — Request Body
```json
{
  "type": "monthly",
  "period": "2026-04"
}
```

Valid `type` values: `monthly`, `yearly`, `custom`
Period format: `YYYY-MM` (monthly), `YYYY` (yearly), `YYYY-MM-DD:YYYY-MM-DD` (custom)

### Transaction Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/transactions` | List user transactions (paginated) |

### Notification Endpoints (require JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/notifications` | List all notifications |
| PATCH | `/notifications/:id/read` | Mark one notification as read |
| PATCH | `/notifications/read-all` | Mark all notifications as read |

---

## Budget Alert Workflow

```
User adds expense linked to a budget
        │
        ▼
System calculates:  spent = SUM(expenses for this budget)
                    percent = (spent / budget.limit) × 100
        │
        ├── percent < 90%     → No action
        ├── 90% ≤ percent < 100% → ⚠️  Warning notification created
        └── percent ≥ 100%    → 🚨 Budget exceeded notification created
```

Notification types: `budget_alert`, `expense_added`, `report_ready`, `system`

---

## Entity-Relationship Diagram

```
┌──────────────┐       1:M       ┌──────────────┐
│    USERS     │────────────────▶│   BUDGETS    │
│──────────────│                 │──────────────│
│ id (PK)      │                 │ id (PK)      │
│ name         │       1:M       │ user_id (FK) │──── CASCADE
│ email (UQ)   │────────────────▶│ name         │
│ password_hash│                 │ limit        │
│ created_at   │                 │ period       │
│ updated_at   │                 │ start_date   │
└──────┬───────┘                 │ end_date     │
       │                         └──────┬───────┘
       │ 1:M                            │ 1:M
       │                                │
       ▼                                ▼
┌──────────────┐       1:M       ┌──────────────┐
│  CATEGORIES  │────────────────▶│   EXPENSES   │
│──────────────│                 │──────────────│
│ id (PK)      │                 │ id (PK)      │
│ user_id (FK) │── CASCADE       │ user_id (FK) │──── CASCADE
│ name         │                 │ category_id  │──── SET NULL
│ color        │                 │ budget_id    │──── SET NULL
│ icon         │                 │ amount       │
└──────────────┘                 │ description  │
                                 │ date         │
       ┌──────────────┐          │ payment_method│
       │ TRANSACTIONS │          │ created_at   │
       │──────────────│          └──────┬───────┘
       │ id (PK)      │                │ 1:0..1
       │ user_id (FK) │── CASCADE       │
       │ expense_id   │── SET NULL ◀────┘
       │ type         │ (debit/credit)
       │ amount       │
       │ description  │
       └──────────────┘

┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   REPORTS    │  │  NOTIFICATIONS   │  │ PAYMENT_METHODS  │
│──────────────│  │──────────────────│  │──────────────────│
│ id (PK)      │  │ id (PK)          │  │ id (PK)          │
│ user_id (FK) │  │ user_id (FK)     │  │ user_id (FK)     │
│ type         │  │ message          │  │ type             │
│ period       │  │ type             │  │ created_at       │
│ generated_at │  │ is_read          │  └──────────────────┘
└──────────────┘  │ created_at       │
                  └──────────────────┘
       All user_id FKs use CASCADE on delete
```

---

## Design Patterns & Principles

- **Repository Pattern** — `@workspace/db` with Drizzle ORM table schemas acts as the data access layer; route handlers never write raw SQL
- **Observer Pattern** — Expense creation automatically triggers budget threshold checks and notification creation (lines 94–118 of `expenses.ts`)
- **Strategy Pattern** — Currency formatting dynamically switches between USD (`en-US`) and INR (`en-IN`) formatting strategies via `use-preferences.tsx`
- **Factory Pattern** — `buildReportData()` in `reports.ts` constructs different report objects based on `type` parameter (monthly/yearly/custom)
- **Single Responsibility** — Each file has one job (route = HTTP handling, schema = table definition, auth.ts = JWT + bcrypt, logger.ts = logging)
- **Open/Closed** — Route registration in `routes/index.ts` is extensible — new resources added via `router.use()` without modifying existing routes
- **Dependency Inversion** — Route handlers depend on the `@workspace/db` abstraction (Drizzle query builder), not on raw PostgreSQL drivers
- **Interface Segregation** — Domain interfaces (`IUser`, `IBudget`, `ICategory`) are small and focused; consumers only depend on what they need
- **Liskov Substitution** — All entity classes implement `IEntity`, making them substitutable wherever an entity with an `id` is expected
- **Layered Architecture** — Presentation (React) → Transport (Express routes) → Business Logic (validation + alerts) → Data Access (Drizzle) → Persistence (PostgreSQL)
- **Contract-First API Design** — `openapi.yaml` is the single source of truth; frontend hooks and backend validators are auto-generated from it

---

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens signed with `SESSION_SECRET`, expire after 7 days
- Auth middleware verifies Bearer token on every protected route
- Task/data ownership enforced on every query — `WHERE user_id = req.user.userId`
- Secrets stored in `.env`, never committed to source control
- CORS restricted to configured `APP_ORIGIN` and localhost origins
- Pino logger redacts `Authorization`, `Cookie`, and `Set-Cookie` headers from logs
- All database queries use parameterized statements via Drizzle ORM (SQL injection safe)
- Global error handler normalizes API errors to JSON and detects database unavailability

---

## Product Improvements Included

- API errors are normalized to JSON for better frontend diagnostics
- Frontend API base URL is configurable via `VITE_API_BASE_URL`
- Currency preferences support both **USD** and **INR (Indian Rupee)** from Settings
- Dashboard provides month-over-month comparison for spending awareness
- Budget responses include computed `spent`, `remaining`, and `percentUsed` fields

---

## License

Academic use only.
