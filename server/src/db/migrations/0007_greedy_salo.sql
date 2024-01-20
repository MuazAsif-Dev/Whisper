ALTER TABLE "users" ADD COLUMN "role" varchar(256) DEFAULT 'user' NOT NULL;
ALTER TABLE "users" DROP COLUMN IF EXISTS "is_management";