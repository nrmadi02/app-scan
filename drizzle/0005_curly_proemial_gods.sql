ALTER TABLE "npwpd-app_npwpd" ADD COLUMN "user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "npwpd-app_user" ADD CONSTRAINT "npwpd-app_user_email_unique" UNIQUE("email");