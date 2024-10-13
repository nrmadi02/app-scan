ALTER TABLE "npwpd-app_npwpd" DROP CONSTRAINT "npwpd-app_npwpd_taxpayers_id_npwpd-app_taxpayers_id_fk";
--> statement-breakpoint
ALTER TABLE "npwpd-app_taxpayers" ADD COLUMN "npwpd_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "npwpd-app_npwpd" DROP COLUMN IF EXISTS "taxpayers_id";