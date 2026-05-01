import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { DRIZZLE } from "../db/db.module";
import * as schema from "@repo/database";
import { and, eq, gt, sql } from "drizzle-orm";
import { CreateEventDto } from "./dto/create-event.dto";
import { PricingEngine } from "./pricing.service";

@Injectable()
export class EventsService {
  private pricingEngine = new PricingEngine();

  constructor(@Inject(DRIZZLE) private db: any) {}

  async findAll() {
    return await this.db.select().from(schema.events);
  }

  async findOne(id: string) {
    // 1. Fetch event
    const [event] = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, id));

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    // 2. Calculate bookings in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [demandStats] = await this.db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(schema.bookings)
      .where(
        and(
          eq(schema.bookings.eventId, id),
          gt(schema.bookings.bookedAt, oneHourAgo),
        ),
      );

    const bookingsLastHour = Number(demandStats?.count || 0);

    // 3. Calculate dynamic price
    const dynamicPrice = this.pricingEngine.calculate({
      basePrice: parseFloat(event.basePrice),
      eventDate: event.eventDate,
      totalTickets: event.totalTickets,
      bookedTickets: event.bookedTickets,
      bookingsLastHour,
      priceFloor: parseFloat(event.priceFloor),
      priceCeiling: parseFloat(event.priceCeiling),
    });

    // 4. Return enriched response
    return {
      ...event,

      currentPrice: dynamicPrice,

      pricingMetrics: {
        bookingsLastHour,
        ticketsRemaining: event.totalTickets - event.bookedTickets,
        occupancyPercent: Number(
          ((event.bookedTickets / event.totalTickets) * 100).toFixed(2),
        ),
      },
    };
  }

  async create(dto: CreateEventDto) {
    const dateStr = new Date(dto.eventDate).toISOString();

    const [newEvent] = await this.db
      .insert(schema.events)
      .values({
        ...dto,
        eventDate: dateStr,
        basePrice: dto.basePrice.toString(),
        currentPrice: dto.basePrice.toString(), // Initialize with base price
        priceFloor: dto.priceFloor.toString(),
        priceCeiling: dto.priceCeiling.toString(),
      })
      .returning();

    return newEvent;
  }

  async recordTicketSale(eventId: string, externalTx?: any) {
    const db = externalTx || this.db;

    return await db.transaction(async (tx: any) => {
      // 1. Fetch Event
      const [event] = await tx
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, eventId))
        .for("update");

      console.log("recordTicketSale event", event);

      // 2. Fetch Demand Metric (Bookings in the last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      console.log("recordTicketSale oneHourAgo", oneHourAgo);

      const [demandStats] = await tx
        .select({ count: sql<number>`count(*)` })
        .from(schema.bookings) // Assuming you have a bookings table
        .where(
          and(
            eq(schema.bookings.eventId, eventId),
            gt(schema.bookings.bookedAt, oneHourAgo),
          ),
        );

      console.log("recordTicketSale demandStats", demandStats);

      const bookingsLastHour = Number(demandStats?.count || 0);

      // 3. Calculate New Price
      const newPrice = this.pricingEngine.calculate({
        basePrice: parseFloat(event.basePrice),
        eventDate: event.eventDate,
        totalTickets: event.totalTickets,
        bookedTickets: event.bookedTickets + 1,
        bookingsLastHour,
        priceFloor: parseFloat(event.priceFloor),
        priceCeiling: parseFloat(event.priceCeiling),
      });

      console.log("recordTicketSale newPrice", newPrice);

      // 4. Update Database
      return await tx
        .update(schema.events)
        .set({
          bookedTickets: event.bookedTickets + 1,
          currentPrice: newPrice,
          updatedAt: new Date(),
        })
        .where(eq(schema.events.id, eventId))
        .returning();
    });
  }
}
