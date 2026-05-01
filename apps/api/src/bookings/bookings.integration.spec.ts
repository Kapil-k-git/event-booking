import { Test, TestingModule } from "@nestjs/testing";
import { BookingsService } from "./bookings.service";
import { EventsService } from "../events/events.service";

describe("Bookings Integration Flow", () => {
  let bookingsService: BookingsService;

  const mockDb = {
    transaction: jest.fn(),
  };

  const mockEventsService = {
    findOne: jest.fn(),
    recordTicketSale: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: "DRIZZLE_CLIENT",
          useValue: mockDb,
        },
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    bookingsService = module.get<BookingsService>(BookingsService);
  });

  it("should be defined", () => {
    expect(bookingsService).toBeDefined();
  });
});
