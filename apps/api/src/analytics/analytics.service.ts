import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { DRIZZLE } from "../db/db.module";
// import * as schema from "../../../../packages/database/src/index";
import * as schema from "@repo/database";
import { eq, sql } from "drizzle-orm";

@Injectable()
export class AnalyticsService {
  constructor(@Inject(DRIZZLE) private readonly db: any) {}

  async getEventMetrics(eventId: string) {
    const stats = await this.db
      .select({
        totalRevenue: sql<number>`COALESCE(sum(${schema.bookings.pricePaid} * ${schema.bookings.quantity}), 0)`,
        ticketsSold: sql<number>`COALESCE(sum(${schema.bookings.quantity}), 0)`,
        avgPrice: sql<number>`COALESCE(avg(${schema.bookings.pricePaid}), 0)`,
      })
      .from(schema.bookings)
      .where(eq(schema.bookings.eventId, eventId));

    const [event] = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, eventId));

    if (!event) throw new NotFoundException("Event not found");

    return {
      eventId: event.id,
      name: event.name,
      totalSold: Number(stats[0].ticketsSold),
      revenue: Number(stats[0].totalRevenue),
      averagePrice: Number(stats[0].avgPrice).toFixed(2),
      remaining: event.totalTickets - Number(stats[0].ticketsSold),
    };
  }

  async getSystemSummary() {
    const summary = await this.db
      .select({
        totalRevenue: sql<number>`COALESCE(sum(${schema.bookings.pricePaid} * ${schema.bookings.quantity}), 0)`,
        totalBookings: sql<number>`count(${schema.bookings.id})`,
        uniqueUsers: sql<number>`count(distinct ${schema.bookings.userEmail})`,
      })
      .from(schema.bookings);

    const eventCount = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.events);

    return {
      totalRevenue: Number(summary[0].totalRevenue),
      totalTicketsSold: Number(summary[0].totalBookings), // Count of booking records
      activeEvents: Number(eventCount[0].count),
      platformUsers: Number(summary[0].uniqueUsers),
    };
  }
}