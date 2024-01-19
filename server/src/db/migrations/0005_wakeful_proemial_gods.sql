ALTER TABLE "room_members" DROP CONSTRAINT "room_members_user_id_users_id_fk";

DO $$ BEGIN
 ALTER TABLE "room_members" ADD CONSTRAINT "room_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
