// src/bookings/bookings.module.ts
import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { EventsModule } from "../events/events.module";
import { DbModule } from "../db/db.module";

@Module({
  imports: [
    DbModule,
    EventsModule, // Allows access to EventsService
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
