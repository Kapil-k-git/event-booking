import { PricingEngine } from "./pricing.service";

describe("PricingEngine", () => {
  let pricingEngine: PricingEngine;

  beforeEach(() => {
    pricingEngine = new PricingEngine();
  });

  const baseMetrics = {
    basePrice: 100,
    totalTickets: 100,
    bookedTickets: 10,
    bookingsLastHour: 0,
    priceFloor: 80,
    priceCeiling: 300,
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  it("should return base price when no rules apply", () => {
    const price = pricingEngine.calculate(baseMetrics);
    expect(price).toBe("100.00");
  });

  it("should apply time-based pricing within 7 days", () => {
    const price = pricingEngine.calculate({
      ...baseMetrics,
      eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
    expect(parseFloat(price)).toBeGreaterThan(100);
  });

  it("should apply last-minute pricing within 1 day", () => {
    const price = pricingEngine.calculate({
      ...baseMetrics,
      eventDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    });
    expect(parseFloat(price)).toBeCloseTo(150);
  });

  it("should apply demand-based pricing", () => {
    const price = pricingEngine.calculate({
      ...baseMetrics,
      bookingsLastHour: 15,
    });
    expect(parseFloat(price)).toBeGreaterThan(100);
  });

  it("should apply inventory scarcity pricing", () => {
    const price = pricingEngine.calculate({
      ...baseMetrics,
      bookedTickets: 85,
    });
    expect(parseFloat(price)).toBeGreaterThan(100);
  });

  it("should combine multiple pricing rules", () => {
    const price = pricingEngine.calculate({
      ...baseMetrics,
      bookingsLastHour: 15,
      bookedTickets: 90,
      eventDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    });
    expect(parseFloat(price)).toBeGreaterThan(150);
  });

  it("should enforce price floor", () => {
    const price = pricingEngine.calculate({
      ...baseMetrics,
      basePrice: 50,
      priceFloor: 80,
    });
    expect(price).toBe("80.00");
  });

  it("should enforce price ceiling", () => {
    const price = pricingEngine.calculate({
      ...baseMetrics,
      basePrice: 500,
      priceCeiling: 300,
      bookingsLastHour: 50,
      bookedTickets: 99,
    });
    expect(price).toBe("300.00");
  });
});
