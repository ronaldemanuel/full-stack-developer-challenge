CREATE TABLE "user_item" (
	"user_id" text NOT NULL,
	"item_id" text NOT NULL,
	CONSTRAINT "user_item_pkey" PRIMARY KEY("user_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "hp_level" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "sp_level" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "mp_level" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;