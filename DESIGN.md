# System Design Overview

This Event Ticketing Platform was built as a full-stack monorepo using Turborepo, combining a NestJS backend, Next.js frontend, and a shared PostgreSQL + Drizzle ORM database package. The architecture was designed to prioritize maintainability, scalability, and clear separation of concerns.

## Pricing Algorithm Design

The dynamic pricing engine uses a weighted multi-factor model based on three primary inputs:

* **Time until event**
* **Recent booking demand**
* **Inventory scarcity**

Each factor is normalized and multiplied by configurable environment-based weights (`WEIGHT_TIME`, `WEIGHT_DEMAND`, `WEIGHT_INVENTORY`) ranging from `0` to `1`. This allows pricing behavior to be tuned without code changes. The final calculated price is constrained by predefined floor and ceiling values to prevent excessive volatility. This design balances flexibility with business safety while allowing real-time market responsiveness.

## Concurrency Protection

To prevent overbooking, database transactions combined with row-level locking were used. During booking creation, the event record is selected using `FOR UPDATE`, ensuring only one transaction can modify ticket inventory at a time. This prevents race conditions where multiple simultaneous bookings could oversell available tickets. This approach was chosen for correctness and simplicity over more distributed solutions like external locks or queues.

## Monorepo Architecture Decisions

Turborepo was selected to manage multiple applications and shared packages efficiently. The monorepo structure includes:

* `apps/api` → NestJS backend
* `apps/web` → Next.js frontend
* `packages/database` → Shared Drizzle ORM package

This structure promotes code reuse, centralized dependency management, and consistent type sharing across services. The database package is compiled independently to avoid cross-package TypeScript runtime issues.

## Trade-offs

The system prioritizes reliability and modularity over extreme optimization. For example:

* Row-level locking is simpler but may reduce throughput under extreme load
* Dynamic pricing calculations are request-driven instead of fully precomputed
* Current test coverage focuses on business-critical paths rather than exhaustive application coverage

## Future Improvements

With more time, I would implement:

* Redis caching for pricing and ticket availability
* Payment integration (e.g., Stripe)
* Advanced observability/logging
* Seat-level inventory management
* Background jobs for analytics and notifications
* Expanded automated test coverage

Overall, the design emphasizes production readiness, transactional safety, and long-term extensibility.