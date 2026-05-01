export interface PricingMetrics {
  basePrice: number;
  eventDate: string;
  totalTickets: number;
  bookedTickets: number;
  bookingsLastHour: number;
  priceFloor: number;
  priceCeiling: number;
}

export class PricingEngine {
  // Weights loaded from Environment Variables
  private readonly weights = {
    time: parseFloat(process.env.WEIGHT_TIME || "1.0"),
    demand: parseFloat(process.env.WEIGHT_DEMAND || "1.0"),
    inventory: parseFloat(process.env.WEIGHT_INVENTORY || "1.0"),
  };

  calculate(metrics: PricingMetrics): string {
    const {
      basePrice,
      eventDate,
      totalTickets,
      bookedTickets,
      bookingsLastHour,
    } = metrics;

    let totalAdjustment = 0;

    // 1. Time-Based Rule
    const daysUntilEvent = Math.ceil(
      (new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    let timeAdj = 0;
    if (daysUntilEvent <= 1)
      timeAdj = 0.5; // Tomorrow: +50%
    else if (daysUntilEvent <= 7) timeAdj = 0.2; // Within 7 days: +20%

    totalAdjustment += timeAdj * this.weights.time;

    // 2. Demand-Based Rule (Velocity)
    let demandAdj = 0;
    if (bookingsLastHour >= 10) {
      demandAdj = 0.15; // High velocity: +15%
    }
    totalAdjustment += demandAdj * this.weights.demand;

    // 3. Inventory-Based Rule (Scarcity)
    let inventoryAdj = 0;
    const remainingPercent =
      ((totalTickets - bookedTickets) / totalTickets) * 100;
    if (remainingPercent < 20) {
      inventoryAdj = 0.25; // Less than 20% left: +25%
    }
    totalAdjustment += inventoryAdj * this.weights.inventory;

    // 4. Final Calculation: currentPrice = basePrice * (1 + sum of weighted adjustments)
    let finalPrice = basePrice * (1 + totalAdjustment);

    // 5. Apply Floor and Ceiling
    finalPrice = Math.min(
      Math.max(finalPrice, metrics.priceFloor),
      metrics.priceCeiling,
    );

    return finalPrice.toFixed(2);
  }
}
