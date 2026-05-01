import { IsString, IsNumber, IsOptional, Min, IsObject } from "class-validator";

export class CreateEventDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  venue!: string;

  // @IsDate()
  // @Type(() => Date)
  @IsString()
  eventDate!: string;

  @IsNumber()
  @Min(1)
  totalTickets!: number;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsNumber()
  @Min(0)
  priceFloor!: number;

  @IsNumber()
  @Min(0)
  priceCeiling!: number;

  @IsObject()
  @IsOptional()
  pricingRules?: Record<string, any>;
}
