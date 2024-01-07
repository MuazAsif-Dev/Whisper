import {
	pgTable,
	varchar,
	timestamp,
	boolean,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users.model";

export const rooms = pgTable("rooms", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: varchar("title", { length: 256 }).notNull(),
	createdByUserId: uuid("created_by")
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	isDeleted: boolean("is_deleted").notNull().default(false),
});
