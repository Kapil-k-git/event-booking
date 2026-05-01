import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// postgres-js client
export const client = postgres(process.env.DATABASE_URL, {
  max: 10, // connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

// Drizzle database instance
export const db = drizzle(client, { schema });
export * from "./schema";
