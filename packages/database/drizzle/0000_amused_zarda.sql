CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"price_paid" numeric(10, 2) NOT NULL,
	"booked_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"venue" varchar(255) NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"total_tickets" integer NOT NULL,
	"booked_tickets" integer DEFAULT 0 NOT NULL,
	"base_price" numeric(10, 2) NOT NULL,
	"current_price" numeric(10, 2) NOT NULL,
	"price_floor" numeric(10, 2) NOT NULL,
	"price_ceiling" numeric(10, 2) NOT NULL,
	"pricing_rules" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_event_id_idx" ON "bookings" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "bookings_user_email_idx" ON "bookings" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "bookings_booked_at_idx" ON "bookings" USING btree ("booked_at");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_unique_ref_idx" ON "bookings" USING btree ("event_id","user_email","booked_at");--> statement-breakpoint
CREATE INDEX "events_event_date_idx" ON "events" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "events_venue_idx" ON "events" USING btree ("venue");--> statement-breakpoint
CREATE INDEX "events_name_idx" ON "events" USING btree ("name");