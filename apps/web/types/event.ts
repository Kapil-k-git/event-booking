export interface Event {
  id: string;
  name: string;
  description: string;
  venue: string;
  eventDate: string; // ISO date string
  totalTickets: number;
  bookedTickets: number;
  basePrice: string;
  currentPrice: string;
  priceFloor: string;
  priceCeiling: string;
  pricingRules: PricingRules;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PricingRules {
  timeRules: TimeRule[];
  enabledRules: PricingRuleType[];
  demandThreshold: number;
  demandAdjustment: number;
  inventoryThreshold: number;
  inventoryAdjustment: number;
}

export interface TimeRule {
  daysOut: number;
  adjustment: number;
}

export type PricingRuleType = "time" | "demand" | "inventory";