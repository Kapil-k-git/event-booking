import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { DRIZZLE } from "../db/db.module";
import * as schema from "@repo/database";
import { EventsService } from "../events/events.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { eq, sql } from "drizzle-orm";

@Injectable()
export class BookingsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: any,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateBookingDto) {
    return await this.db.transaction(async (tx: any) => {
      // 1. Get current event details (to get the current price)
      const [event] = await tx
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, dto.eventId))
        .for("update");

      if (!event) throw new BadRequestException("Event not found");

      const remaining = event.totalTickets - event.bookedTickets;
      if (remaining < dto.quantity) {
        throw new BadRequestException(`Only ${remaining} tickets left`);
      }

      // 2. Create the booking record
      const [booking] = await tx
        .insert(schema.bookings)
        .values({
          eventId: dto.eventId,
          userEmail: dto.userEmail,
          quantity: dto.quantity,
          pricePaid: event.currentPrice, // Snapshot the price at time of purchase
        })
        .returning();

      console.log("booking", booking);

      // 3. Update the event (increment count & recalculate price)
      // We loop this if quantity > 1, or modify recordTicketSale to accept quantity
      for (let i = 0; i < dto.quantity; i++) {
        await this.eventsService.recordTicketSale(dto.eventId, tx);
      }

      return booking;
    });
  }

  async findAllByEvent(eventId: string) {
    return await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.eventId, eventId))
      .orderBy(sql`${schema.bookings.bookedAt} DESC`);
  }

  async findByUser(email: string) {
    return await this.db
      .select({
        id: schema.bookings.id,
        quantity: schema.bookings.quantity,
        pricePaid: schema.bookings.pricePaid,
        createdAt: schema.bookings.bookedAt,
        // Join with events to show the name of what they bought
        eventName: schema.events.name,
        eventDate: schema.events.eventDate,
      })
      .from(schema.bookings)
      .innerJoin(schema.events, eq(schema.bookings.eventId, schema.events.id))
      .where(eq(schema.bookings.userEmail, email))
      .orderBy(sql`${schema.bookings.bookedAt} DESC`);
  }

  async findById(bookingId: string) {
    const [booking] = await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.id, bookingId));

    if (!booking) {
      throw new BadRequestException("Booking not found");
    }

    return booking;
  }
}
