# Event Ticketing Platform Monorepo

A full-stack event booking system built with:

* **Node.js v24**
* **pnpm**
* **Turborepo**
* **Next.js 15** (Web frontend)
* **NestJS** (API backend)
* **PostgreSQL**
* **Drizzle ORM**

---

# Prerequisites

Before running the project, ensure you have the following installed:

* **Node.js v24**
* **pnpm**
* **PostgreSQL**

### Verify Node version:

```bash
node -v
```

Expected:

```bash
v24.x.x
```

---

# Project Setup

## 1. Install dependencies

From the **root of the monorepo**, run:

```bash
pnpm install
```

This installs dependencies for:

* Web app
* API app
* Shared database package
* Shared configs/packages

---

# Environment Configuration

You must create `.env` files for the following:

* `apps/api/.env`
* `apps/web/.env`
* `packages/database/.env`

Each project includes a corresponding:

```bash
.env.example
```

### Setup:

Copy each example file:

```bash
cp .env.example .env
```

Then configure the required values.

---

# API Pricing Engine Configuration

Inside `apps/api/.env`, configure:

```env
WEIGHT_TIME=
WEIGHT_DEMAND=
WEIGHT_INVENTORY=
```

## Important:

Each value **must be between `0` and `1`**.

### Example:

```env
WEIGHT_TIME=0.8
WEIGHT_DEMAND=0.6
WEIGHT_INVENTORY=0.7
```

These values control the dynamic pricing algorithm:

* **WEIGHT_TIME** → Time remaining until event
* **WEIGHT_DEMAND** → Booking demand rate
* **WEIGHT_INVENTORY** → Ticket scarcity

---

# Database Setup

## Seed the database

From the root of the project:

```bash
pnpm --filter @repo/database db:seed
```

This populates the database with sample:

* Events
* Bookings
* Pricing configurations

---

# Run Development Servers

From the root of the project:

```bash
pnpm dev
```

This starts:

* **Web frontend**
* **API backend**

---

# Typical Local URLs

### Web:

```bash
http://localhost:3000
```

### API:

```bash
http://localhost:3001
```

---

# Common Development Commands

## Install all dependencies:

```bash
pnpm install
```

## Seed database:

```bash
pnpm --filter @repo/database db:seed
```

## Run development:

```bash
pnpm dev
```

## Run tests:

```bash
pnpm test
```

## Run coverage:

```bash
pnpm test:cov
```

---

# Monorepo Structure

```txt
apps/
 ├── api/        # NestJS backend
 └── web/        # Next.js frontend

packages/
 ├── database/   # Drizzle ORM + PostgreSQL
 └── typescript-config/
```

---

# Troubleshooting

## Workspace dependency issues:

Always run commands from the root using:

```bash
pnpm
```

Do **not** use:

```bash
npm install
```

---

## Database issues:

Ensure:

* PostgreSQL is running
* DATABASE_URL is correct
* Seed script has been executed

---

# Notes

* Use **pnpm** for all package management
* Node.js version **24** is required
* Ensure `.env` files are configured before running dev servers
* Dynamic pricing weights must remain within `0–1`

---

# Summary

### Initial setup:

```bash
pnpm install
pnpm --filter @repo/database db:seed
pnpm dev
```

Your full Event Ticketing Platform should now be running locally.