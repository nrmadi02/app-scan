DO $$ BEGIN
 CREATE TYPE "public"."taxpayer_type" AS ENUM('personal', 'company');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "npwpd-app_npwpd" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"registration_number" varchar(255) NOT NULL,
	"registration_date" timestamp with time zone,
	"taxpayers_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "npwpd-app_taxpayers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"taxpayer_type" "taxpayer_type" NOT NULL,
	"identity_number" varchar(255) NOT NULL,
	"identity_number_type" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"phone_number" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deactive_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "npwpd-app_npwpd" ADD CONSTRAINT "npwpd-app_npwpd_taxpayers_id_npwpd-app_taxpayers_id_fk" FOREIGN KEY ("taxpayers_id") REFERENCES "public"."npwpd-app_taxpayers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
