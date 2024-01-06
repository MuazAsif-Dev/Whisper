import { pgTable, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { rooms } from "./rooms.model";
import { users } from "./users.model";
import { text } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id),
	roomId: uuid("room_id").references(() => rooms.id),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	editedAt: timestamp("edited_at").notNull().defaultNow(),
	isDeleted: boolean("is_deleted").notNull().default(false),
});
