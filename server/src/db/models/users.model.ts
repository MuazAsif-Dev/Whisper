import {
	pgTable,
	timestamp,
	boolean,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: varchar("username", { length: 256 }).unique().notNull(),
	password: varchar("password", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).unique(),
	role: varchar("role", { length: 256, enum: ["admin", "management", "user"] })
		.notNull()
		.default("user"),
	isDeleted: boolean("is_deleted").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
