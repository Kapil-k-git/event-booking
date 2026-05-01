import { IsEmail, IsUUID, IsInt, Min } from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  eventId!: string;

  @IsEmail()
  userEmail!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
