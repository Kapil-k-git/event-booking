import { Test, TestingModule } from "@nestjs/testing";
import { BookingsService } from "./bookings.service";
import { EventsService } from "../events/events.service";

describe("Concurrency Booking Protection", () => {
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

  it("should prevent overbooking under concurrent load", async () => {
    const mockCreate = jest
      .spyOn(bookingsService, "create")
      .mockImplementation(async (dto: any) => {
        if (dto.userEmail.includes("user0")) {
          return {
            id: "success",
            ...dto,
          } as any;
        }

        throw new Error("Sold out");
      });

    const bookingRequests = Array.from({ length: 10 }).map((_, i) =>
      bookingsService
        .create({
          eventId: "limited-event-id",
          userEmail: `user${i}@example.com`,
          quantity: 1,
        })
        .catch((err) => err),
    );

    const results = await Promise.all(bookingRequests);

    const successfulBookings = results.filter(
      (result) => !(result instanceof Error),
    );

    const failedBookings = results.filter((result) => result instanceof Error);

    expect(successfulBookings.length).toBe(1);
    expect(failedBookings.length).toBe(9);

    mockCreate.mockRestore();
  });
});
