"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_1 = require("./index");
const drizzle_orm_1 = require("drizzle-orm");
async function seed() {
    console.log("🌱 Seeding database...");
    // Clear old data
    await index_1.db.delete(index_1.bookings);
    await index_1.db.delete(index_1.events);
    // Insert sample events
    const insertedEvents = await index_1.db
        .insert(index_1.events)
        .values([
        {
            name: "Tech Conference 2026",
            description: "A large-scale conference for developers and startups.",
            venue: "Bangalore International Convention Centre",
            eventDate: new Date("2026-06-15T10:00:00Z"),
            totalTickets: 500,
            bookedTickets: 0,
            basePrice: "2000.00",
            currentPrice: "2200.00",
            priceFloor: "1500.00",
            priceCeiling: "5000.00",
        },
        {
            name: "Music Fest 2026",
            description: "Annual outdoor music festival.",
            venue: "Mumbai Open Grounds",
            eventDate: new Date("2026-08-20T18:00:00Z"),
            totalTickets: 1000,
            bookedTickets: 0,
            basePrice: "3000.00",
            currentPrice: "3500.00",
            priceFloor: "2500.00",
            priceCeiling: "8000.00",
        },
    ])
        .returning();
    const techEvent = insertedEvents[0];
    const musicEvent = insertedEvents[1];
    // Insert sample bookings
    await index_1.db.insert(index_1.bookings).values([
        {
            eventId: techEvent.id,
            userEmail: "alice@example.com",
            quantity: 2,
            pricePaid: "2200.00",
        },
        {
            eventId: techEvent.id,
            userEmail: "bob@example.com",
            quantity: 3,
            pricePaid: "2200.00",
        },
        {
            eventId: musicEvent.id,
            userEmail: "charlie@example.com",
            quantity: 4,
            pricePaid: "3500.00",
        },
    ]);
    // Update booked tickets counts
    await index_1.db
        .update(index_1.events)
        .set({ bookedTickets: 5 })
        .where((0, drizzle_orm_1.eq)(index_1.events.id, techEvent.id));
    await index_1.db
        .update(index_1.events)
        .set({ bookedTickets: 4 })
        .where((0, drizzle_orm_1.eq)(index_1.events.id, musicEvent.id));
    console.log("✅ Database seeded successfully!");
}
seed()
    .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
})
    .finally(() => process.exit(0));
