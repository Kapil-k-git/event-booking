import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Basic info
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    venue: varchar("venue", { length: 255 }).notNull(),
    // eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
    eventDate: text("event_date").notNull(),

    // Capacity
    totalTickets: integer("total_tickets").notNull(),
    bookedTickets: integer("booked_tickets").notNull().default(0),

    // Pricing
    basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
    currentPrice: numeric("current_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    priceFloor: numeric("price_floor", { precision: 10, scale: 2 }).notNull(),
    priceCeiling: numeric("price_ceiling", {
      precision: 10,
      scale: 2,
    }).notNull(),

    // Dynamic pricing configuration
    pricingRules: jsonb("pricing_rules")
      .$type<{
        timeRules: Array<{
          daysOut: number;
          adjustment: number; // e.g., 0.20 for 20%
        }>;
        demandThreshold: number; // e.g., 10 bookings
        demandAdjustment: number; // e.g., 0.15
        inventoryThreshold: number; // e.g., 0.20 for 20% tickets left
        inventoryAdjustment: number; // e.g., 0.25
        enabledRules: Array<"time" | "demand" | "inventory">;
      }>()
      .notNull()
      .default({
        timeRules: [
          { daysOut: 30, adjustment: 0.0 },
          { daysOut: 7, adjustment: 0.2 },
          { daysOut: 1, adjustment: 0.5 },
        ],
        demandThreshold: 10,
        demandAdjustment: 0.15,
        inventoryThreshold: 0.2,
        inventoryAdjustment: 0.25,
        enabledRules: ["time", "demand", "inventory"],
      }),

    createdAt: timestamp("created_at", { withTimezone: true })
      // .defaultNow()
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      // .defaultNow()
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    eventDateIdx: index("events_event_date_idx").on(table.eventDate),
    venueIdx: index("events_venue_idx").on(table.venue),
    nameIdx: index("events_name_idx").on(table.name),
  }),
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userEmail: varchar("user_email", { length: 255 }).notNull(),
    quantity: integer("quantity").notNull(),

    // Snapshot of price paid per ticket at booking time
    pricePaid: numeric("price_paid", { precision: 10, scale: 2 }).notNull(),
    bookedAt: timestamp("booked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    eventIdx: index("bookings_event_id_idx").on(table.eventId),
    userEmailIdx: index("bookings_user_email_idx").on(table.userEmail),
    bookedAtIdx: index("bookings_booked_at_idx").on(table.bookedAt),

    // Optional duplicate prevention pattern
    uniqueBookingRef: uniqueIndex("bookings_unique_ref_idx").on(
      table.eventId,
      table.userEmail,
      table.bookedAt,
    ),
  }),
);
// Relations
export const eventsRelations = relations(events, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
}));
