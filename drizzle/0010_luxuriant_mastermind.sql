CREATE TABLE IF NOT EXISTS "npwpd-app_clients" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"code" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "npwpd-app_codes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"code" varchar(255),
	"expires_at" timestamp,
	"is_used" boolean DEFAULT false,
	"is_logged_in" boolean DEFAULT false,
	"user_id" varchar,
	"client_id" varchar,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "npwpd-app_codes" ADD CONSTRAINT "npwpd-app_codes_user_id_npwpd-app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."npwpd-app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "npwpd-app_codes" ADD CONSTRAINT "npwpd-app_codes_client_id_npwpd-app_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."npwpd-app_clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
