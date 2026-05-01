import "dotenv/config";
import { db, events, bookings } from "./index";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear old data
  await db.delete(bookings);
  await db.delete(events);

  // Insert sample events
  const insertedEvents = await db
    .insert(events)
    .values([
      {
        name: "Tech Conference 2026",
        description: "A large-scale conference for developers and startups.",
        venue: "Bangalore International Convention Centre",
        eventDate: new Date("2026-05-15T10:00:00Z"),
        totalTickets: 5,
        bookedTickets: 0,
        basePrice: "2000.00",
        currentPrice: "2000.00",
        priceFloor: "1500.00",
        priceCeiling: "5000.00",
      },
      {
        name: "Music Fest 2026",
        description: "Annual outdoor music festival.",
        venue: "Mumbai Open Grounds",
        eventDate: new Date("2026-06-20T18:00:00Z"),
        totalTickets: 10,
        bookedTickets: 0,
        basePrice: "3000.00",
        currentPrice: "3000.00",
        priceFloor: "2500.00",
        priceCeiling: "8000.00",
      },
    ] as any)
    .returning();

  const techEvent = insertedEvents[0];
  const musicEvent = insertedEvents[1];

  // Insert sample bookings
  await db.insert(bookings).values([
    {
      eventId: techEvent!.id,
      userEmail: "alice@example.com",
      quantity: 2,
      pricePaid: "2000.00",
    },
    {
      eventId: musicEvent!.id,
      userEmail: "bob@example.com",
      quantity: 1,
      pricePaid: "3000.00",
    },
    {
      eventId: musicEvent!.id,
      userEmail: "charlie@example.com",
      quantity: 4,
      pricePaid: "3000.00",
    },
  ]);

  // Update booked tickets counts
  await db
    .update(events)
    .set({ bookedTickets: 5 })
    .where(eq(events.id, techEvent!.id));

  await db
    .update(events)
    .set({ bookedTickets: 4 })
    .where(eq(events.id, musicEvent!.id));

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
