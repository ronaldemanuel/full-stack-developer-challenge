ALTER TABLE "post" ALTER COLUMN "owner_id" SET NOT NULL;
--> statement-breakpoint
-- drop like primary key
ALTER TABLE "like" DROP CONSTRAINT "like_pkey";
--> statement-breakpoint
ALTER TABLE "like"
ADD CONSTRAINT "like_pkey" PRIMARY KEY ("user_id", "post_id");
--> statement-breakpoint
ALTER TABLE "like" DROP COLUMN "id";