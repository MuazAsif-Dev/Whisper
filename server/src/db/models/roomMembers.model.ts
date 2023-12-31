import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { rooms } from "./rooms.model";
import { users } from "./users.model";

export const roomMembers = pgTable(
	"room_members",
	{
		roomId: uuid("room_id")
			.references(() => rooms.id)
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id)
			.notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.roomId, table.userId] }),
		};
	},
);
