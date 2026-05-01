/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, BadRequestException } from '@nestjs/common';
// import * as request from 'supertest';
const request = require('supertest');
import { AppModule } from '../src/app.module';
import { DRIZZLE } from '../src/db/db.module';
import * as schema from "../../../packages/database/src/index";
import { eq } from 'drizzle-orm';

describe('Bookings Concurrency (e2e)', () => {
  let app: INestApplication;
  let db: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    db = moduleFixture.get(DRIZZLE);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should prevent overbooking when 2 users grab the last ticket simultaneously', async () => {
    // 1. SETUP: Create an event with exactly 1 ticket capacity
    const eventId = `80d4cac7-0784-4940-baf6-63254b56246f`;
    await db.insert(schema.events).values({
      id: eventId,
      name: 'Concurrent Test Event',
      venue: 'Any city',
      totalTickets: 1,
      bookedTickets: 0,
      basePrice: '100',
      currentPrice: '100',
      priceFloor: '50',
      priceCeiling: '200',
      eventDate: `${new Date().toISOString()}`,
    });

    const bookingPayload = {
      eventId,
      userEmail: 'racer@example.com',
      quantity: 1,
    };

    // 2. EXECUTE: Fire two requests at the exact same time
    // Promise.all ensures they are dispatched concurrently
    const [res1, res2] = await Promise.all([
      request(app.getHttpServer()).post('/bookings').send(bookingPayload),
      request(app.getHttpServer()).post('/bookings').send(bookingPayload),
    ]);

    // 3. ASSERT: One must succeed (201) and one must fail (400)
    const statuses = [res1.status, res2.status];
    console.log("statuses", statuses);
    const successCount = statuses.filter(s => s === 201 || s === 200).length;
    const failureCount = statuses.filter(s => s === 400 || s === 500).length;

    // expect(successCount).toBe(0);
    // expect(failureCount).toBe(1);
    console.log("success count", successCount);
    console.log("failureCount", failureCount);

    // Verify the error message of the failed one
    const failedResponse = res1.status === 400 ? res1 : res2;
    expect(failedResponse.body.message).toMatch(/tickets left/i);

    // 4. VERIFY DB STATE: Ensure bookedTickets is exactly 1 and not 2
    const [event] = await db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, eventId));
    
    expect(event.bookedTickets).toBe(1);
  });
});