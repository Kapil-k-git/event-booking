import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  Param,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  async findAll(
    @Query("eventId") eventId?: string,
    @Query("email") email?: string,
  ) {
    // If email is provided, return user history
    if (email) {
      const decodedEmail = decodeURIComponent(email);
      return this.bookingsService.findByUser(decodedEmail);
    }

    // If eventId is provided, return event bookings
    if (eventId) {
      return this.bookingsService.findAllByEvent(eventId);
    }

    throw new BadRequestException(
      "Either eventId or email query parameter is required",
    );
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.bookingsService.findById(id);
  }
}
