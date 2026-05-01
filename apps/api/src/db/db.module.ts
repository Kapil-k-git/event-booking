import { Module, Global } from "@nestjs/common";
import { db } from "@repo/database";

export const DRIZZLE = "DRIZZLE_CLIENT";

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useValue: db,
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
